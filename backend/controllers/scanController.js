require('dotenv').config();
const { spawn } = require('child_process');
const Scan = require('../models/Scan');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

const createScan = async (req, res) => {
  let responseSent = false;

  try {
    let { target } = req.body;
    const { type } = req.params;
    const userId = req.user._id;

    if (!target) return res.status(400).json({ error: 'Target is required' });

    const cveIdRegex = /^CVE-\d{4}-\d{4,7}$/i;
    const domainOrIpRegex = /^(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3})$/;

    // ✅ Type-specific input validation
    if (type === 'cve') {
      if (!target.trim()) {
        return res.status(400).json({ error: 'Keyword is required for CVE scan' });
      }
    } else if (type === 'webscraper') {
      if (!cveIdRegex.test(target)) {
        return res.status(400).json({ error: 'Invalid CVE ID format (e.g. CVE-2023-12345)' });
      }
    } else if (type === 'vulnerability') {
      if (!domainOrIpRegex.test(target)) {
        return res.status(400).json({ error: 'Invalid IP or domain name for vulnerability scan' });
      }
    } else {
      if (!target.startsWith('http://') && !target.startsWith('https://')) {
        target = 'http://' + target;
      }
      if (!isValidUrl(target)) {
        return res.status(400).json({ error: 'Invalid URL format' });
      }
    }

    const scriptMap = {
      'clickjacking': 'ClickJacking.py',
      'xss': 'XSS.py',
      'sql': 'SQLI.py',
      'malicious': 'MaliciousUrl.py',
      'port': 'port_scanner.py',
      'cve': 'cve_api_search.py',
      'vulnerability': 'vulnerability_lookup.py',
      'webscraper': 'web_scraper.py'
    };

    const scriptName = scriptMap[type];
    if (!scriptName) return res.status(400).json({ error: 'Invalid scan type' });

    const scriptPath = path.join(__dirname, '..', scriptName);
    if (!fs.existsSync(scriptPath)) {
      return res.status(500).json({ error: 'Scan script not found' });
    }

    const pythonPath = process.env.PYTHON_PATH || 'C:\\ProgramData\\anaconda3\\python.exe';
    const pythonProcess = spawn(pythonPath, [scriptPath, target]);

    let result = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('error', (err) => {
      if (!responseSent) {
        responseSent = true;
        return res.status(500).json({ error: 'Failed to start scan process', details: err.message });
      }
    });

    pythonProcess.on('close', async (code) => {
      if (responseSent) return;

      if (code !== 0) {
        responseSent = true;
        return res.status(500).json({
          error: errorOutput || 'Scan failed',
          details: 'Python script execution failed'
        });
      }

      try {
        let parsedResult;
        try {
          parsedResult = JSON.parse(result);
        } catch {
          parsedResult = { raw_output: result };
        }

        const scan = new Scan({
          target,
          type,
          result: parsedResult,
          user: userId,
          vulnerable: parsedResult.vulnerable || false,
          vulnerabilities: parsedResult.vulnerabilities || []
        });

        await scan.save();
        await User.findByIdAndUpdate(userId, { $push: { scanHistory: scan._id } });

        responseSent = true;
        return res.status(201).json(scan);
      } catch (err) {
        if (!responseSent) {
          responseSent = true;
          return res.status(500).json({ error: err.message });
        }
      }
    });
  } catch (err) {
    if (!responseSent) {
      responseSent = true;
      return res.status(500).json({ error: err.message });
    }
  }
};

const getScanHistory = async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('target type result vulnerable vulnerabilities createdAt');
    res.json(scans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createScan,
  getScanHistory
};

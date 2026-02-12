import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Features from '../components/Features';
import Contact from '../components/Contact';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import lockImage from '../assets/lockandkey.png';

const SCAN_TYPES = ['clickjacking', 'xss', 'sql', 'port', 'malicious', 'cve', 'webscraper', 'vulnerability'];


export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState('clickjacking');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const featuresRef = useRef(null);
  const contactRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleScan = async (e, isFullScan = false) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please log in to perform scans');
      return;
    }

    setLoading(true);
    setError('');
    try {
      if (isFullScan) {
        for (const type of SCAN_TYPES) {
          console.log(`Sending scan request for ${type}:`, { target: url, type });
          const response = await fetch(API_ENDPOINTS.SCANS(type), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              target: url,
              type: type,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 401) {
              navigate('/login');
              return;
            }
            throw new Error(errorData.error || errorData.details || `Scan failed for ${type}`);
          }
        }
      } else {
        console.log('Sending scan request:', { target: url, type: scanType });
        const response = await fetch(API_ENDPOINTS.SCANS(scanType), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            target: url,
            type: scanType,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error(errorData.error || errorData.details || 'Scan failed');
        }
      }

      navigate('/report');
    } catch (error) {
      console.error('Scan error:', error);
      setError(error.message || 'Something went wrong with the scan');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (location.state?.scrollTo === 'features') {
      featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (location.state?.scrollTo === 'contact') {
      contactRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="h-full w-full relative overflow-x-hidden">
      // Background gradient for visual effect
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-cyan-600/20 via-teal-600/10 to-purple-700/20 animate-pulse blur-3xl pointer-events-none z-0" />
      <main className="min-h-screen w-full flex items-center justify-center py-20 bg-[#0B0B14]">
        <div className="max-w-7xl w-full grid md:grid-cols-2 items-center gap-10 px-4">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">
              Welcome to KillSwitch
            </h1>
            <h2 className="text-3xl md:text-3xl font-bold leading-tight text-white">
              -Your First Line of Cyber Defense
            </h2>
            <p className="text-lg text-gray-300 max-w-md">
              A Cyber Attack Analyser that scans your website for vulnerabilities and analyzes potential threats in real-time.
            </p>

            <form onSubmit={(e) => handleScan(e, false)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Target URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="mt-1 block w-full rounded-xl bg-[#0f121a] text-white p-3 shadow-inner shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  placeholder={
                    scanType === 'cve'
                     ? 'Enter CVE ID (e.g. CVE-2021-41773)'
                     : scanType === 'webscraper'
                     ? 'Enter webpage URL to scrape'
                     : scanType === 'vulnerability'
                     ? 'Enter software name or version'
                     : 'Enter URL to scan'
                  }

                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Scan Type</label>
                <select
                  value={scanType}
                  onChange={(e) => setScanType(e.target.value)}
                  className="mt-1 block w-full rounded-xl bg-[#0f121a] text-white p-3 shadow-inner shadow-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                >
                  <option value="clickjacking">Clickjacking</option>
                  <option value="xss">XSS</option>
                  <option value="sql">SQL Injection</option>
                  <option value="port">Port Scanner</option>
                  <option value="malicious">Malicious URL Scanner</option>
                  <option value="cve">CVE Lookup</option>
                  <option value="webscraper">Web Scraper</option>
                  <option value="vulnerability">Vulnerability Lookup</option>

                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || !isAuthenticated}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-400 to-teal-700 font-extrabold rounded-2xl text-white shadow-cyan-500/70 hover:from-cyan-300 hover:to-teal-600 hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Scanning...' : 'Start Scan'}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleScan(e, true)}
                  disabled={loading || !isAuthenticated}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-400 to-pink-700 font-extrabold rounded-2xl text-white shadow-lg shadow-purple-500/70 hover:from-purple-300 hover:to-pink-600 hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Scanning...' : 'Full Scan'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                {error}
              </div>
            )}
          </div>

          <div className="w-full flex justify-center items-center">
            <img className="w-[600px] object-contain rounded-xl shadow-xl" src={lockImage} alt="Lock" />
          </div>
        </div>
      </main>

      <section ref={featuresRef} className="w-full">
        <Features />
      </section>

      <section ref={contactRef} className="w-full">
        <Contact />
      </section>

      <Footer />
    </div>
  );
}

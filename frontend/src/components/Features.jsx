import React from 'react';
import {
  FaNetworkWired,
  FaEyeSlash,
  FaDatabase,
  FaBug,
  FaExclamationTriangle,
  FaSearchPlus
} from 'react-icons/fa';

const features = [
  {
    icon: <FaNetworkWired className="text-white text-2xl" />,
    title: 'Port Scanner',
    description: 'Scan open ports to find exposed services on target systems.',
  },
  {
    icon: <FaEyeSlash className="text-white text-2xl" />,
    title: 'Clickjacking Detection',
    description: 'Detect hidden frames used to hijack user clicks.',
  },
  {
    icon: <FaDatabase className="text-white text-2xl" />,
    title: 'SQL Injection',
    description: 'Find input fields vulnerable to SQL injection attacks.',
  },
  {
    icon: <FaBug className="text-white text-2xl" />,
    title: 'XSS Attack',
    description: 'Identify cross-site scripting vulnerabilities in forms and URLs.',
  },
  {
    icon: <FaExclamationTriangle className="text-white text-2xl" />,
    title: 'Malicious URL Detector',
    description: 'Check if a URL is linked to phishing, malware, or scams.',
  },
  {
    icon: <FaSearchPlus className="text-white text-2xl" />,
    title: 'Vulnerability Lookup',
    description: 'Search known CVEs for detailed info on discovered issues.',
  },
];

const Features = () => {
  return (
    <section className="bg-[#0e0f1a] py-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          <span className="text-gray-400">Advanced</span> features<br />
          <span className="italic text-gray-500">engineered to address modern threats.</span>
        </h2>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-[#1a1d2e] to-[#0f101a] p-6 rounded-2xl shadow-lg border border-[#2a2f4a] hover:shadow-cyan-500/20 transition-all duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-cyan-400 text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
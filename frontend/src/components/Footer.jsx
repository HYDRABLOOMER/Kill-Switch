import React from 'react';
import logo from '../assets/killswitch-logo.png';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0e0f1a] text-gray-400 py-10 border-t border-[#1c1f2f]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-2">
          <img src={logo} alt="KillSwitch Logo" className="h-10 w-auto object-contain" style={{maxHeight:'40px'}} />
          <span className="text-2xl font-bold text-white tracking-widest hover:text-cyan-400">KillSwitch</span>
        </div>

        {/* Links & Message */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-xl text-center md:text-left">
          <a
            href="https://github.com/anika-dewari/Cyber-attack-analyser"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-cyan-400 transition"
          >
            GitHub Reposistory
          </a>
          <span className="text-white  hover:text-cyan-400 max-w-md md:max-w-none">
            ⚠️ Please use this tool only on websites or systems you own or have permission to scan.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = ({ scrollToFeatures, scrollToContact }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (section) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: section } });
    } else {
      section === 'features' ? scrollToFeatures?.() : scrollToContact?.();
    }
  };

  return (
    <header className="fixed w-full py-6 px-6 sm:px-10 bg-[#0e0f1a] border-b border-[#1c1f2f] shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-cyan-400 text-3xl font-bold tracking-wide">
          Kill<span className="text-white">Switch</span>
        </h1>
        <nav className="space-x-6 text-xl font-medium text-gray-300">
        <button onClick={() => navigate('/')} className="hover:text-cyan-400 transition">
          Home
        </button>
        <button onClick={() => handleClick('features')} className="hover:text-cyan-400 transition">
          Features
        </button>
        <button onClick={() => handleClick('contact')} className="hover:text-cyan-400 transition">
          Contact
        </button>
        <a className="hover:text-cyan-400 transition" href="">
          Logout
        </a>
      </nav>

      </div>
    </header>
  );
};

export default Header;

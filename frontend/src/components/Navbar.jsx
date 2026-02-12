import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/killswitch-logo.png';

const Navbar = ({ scrollToFeatures, scrollToContact }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (section) => {
    if (location.pathname === '/' && section === 'features' && scrollToFeatures) {
      scrollToFeatures();
    } else if (location.pathname === '/' && section === 'contact' && scrollToContact) {
      scrollToContact();
    } else {
      navigate('/', { state: { scrollTo: section } });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="fixed w-full top-0 z-50 py-4 px-6 sm:px-10 bg-[#0e0f1a] border-b border-[#1c1f2f] shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="KillSwitch Logo" className="h-10 w-auto object-contain" />
          <span className="text-2xl hover:text-cyan-400 transition font-bold text-white tracking-widest">KillSwitch</span>
        </Link>

        <nav className="flex items-center space-x-6 text-base sm:text-lg font-medium text-gray-300">
          <button onClick={() => navigate('/')} className="hover:text-cyan-400 transition">Home</button>
          <button onClick={() => handleClick('features')} className="hover:text-cyan-400 transition">Features</button>
          <button onClick={() => handleClick('contact')} className="hover:text-cyan-400 transition">Contact</button>

          {isAuthenticated && (
            <Link to="/history" className="hover:text-cyan-400 transition">
              History
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="text-gray-300 border-l border-gray-600 hover:text-cyan-400 transition pl-4 hidden sm:inline cursor-pointer bg-transparent border-none outline-none"
                style={{background: 'none'}}
              >
                {user?.user?.email || user?.email}
              </button>
              <button onClick={handleLogout} className="hover:text-cyan-400 transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-cyan-400 transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-cyan-400 transition">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

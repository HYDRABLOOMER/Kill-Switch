import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_ENDPOINTS, fetchWithAuth } from '../config/api';
import Footer from '../components/Footer';

export default function History() {
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const data = await fetchWithAuth(API_ENDPOINTS.SCAN_HISTORY);
        setScanHistory(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B14] flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading scan history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0B14] flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B14]">
      <div className="fixed top-0 left-0 w-full min-h-screen bg-gradient-to-tr from-cyan-600/20 via-teal-600/10 to-purple-700/20 animate-pulse blur-3xl pointer-events-none z-0" />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl text-white font-bold mb-8">📜 Scan History</h1>
        
        {scanHistory.length === 0 ? (
          <div className="text-cyan-400 text-xl text-center">
            No scan history available. Start scanning to see results here!
          </div>
        ) : (
          <div className="space-y-6 ">
            {scanHistory.map((scan, index) => (
              <div key={scan._id} className="bg-[#1A1D24] p-6 rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl text-white font-bold">
                      {scan.type.charAt(0).toUpperCase() + scan.type.slice(1)} Scan
                    </h2>
                    <p className="text-gray-400 mt-1">
                      Target: {scan.target}
                    </p>
                    <p className="text-gray-400">
                      Date: {new Date(scan.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    scan.vulnerable ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                  }`}>
                    {scan.vulnerable ? 'Vulnerable' : 'Secure'}
                  </span>
                </div>
                
                <div className="mt-4 bg-[#0f121a] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">Results:</h3>
                  <pre className="text-gray-300 overflow-auto">
                    {JSON.stringify(scan.result, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 
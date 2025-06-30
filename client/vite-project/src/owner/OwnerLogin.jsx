import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaPhone, FaLock, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const OwnerLogin = () => {
  const [homestayid, setHomestayid] = useState('');
  const [ownerMob, setOwnerMob] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/owner-auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ homestayid, ownerMob }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/owner/dashboard', { state: { homestayid } });
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center">
            <FaHome className="mr-2" />
            Homestay Owner Portal
          </h1>
          <p className="mt-2 opacity-90">Access your bookings and revenue dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <label className="block text-gray-700 mb-2 font-medium">Homestay ID</label>
            <div className="relative">
              <input
                type="text"
                value={homestayid}
                onChange={(e) => setHomestayid(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. rk01"
                required
              />
              <FaLock className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <label className="block text-gray-700 mb-2 font-medium">Registered Mobile</label>
            <div className="relative">
              <input
                type="tel"
                value={ownerMob}
                onChange={(e) => setOwnerMob(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 9876543210"
                required
              />
              <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700"
            >
              {error}
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-bold text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center ${isLoading ? 'opacity-75' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  Access Dashboard <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default OwnerLogin;

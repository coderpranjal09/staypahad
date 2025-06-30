import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUserShield, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LoginRoute = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const hoverCard = {
    scale: 1.03,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 }
  };

  const tapCard = {
    scale: 0.98
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-4xl text-center"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
        >
          Welcome to Homestay Management
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-gray-600 mb-8 text-lg"
        >
          Please select your login option
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Homestay Owner Card */}
          <motion.div
            variants={itemVariants}
            whileHover={hoverCard}
            whileTap={tapCard}
            onClick={() => navigate('/owner/login')}
            className="bg-white rounded-xl p-6 md:p-8 shadow-md cursor-pointer flex flex-col items-center border border-gray-100 hover:border-blue-200 transition-all"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaHome className="text-blue-600 text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Homestay Owner</h2>
            <p className="text-gray-600 mb-4 text-center">
              Access your homestay dashboard to manage bookings and view reports
            </p>
            <div className="flex items-center text-blue-600 font-medium mt-auto">
              <span>Continue</span>
              <FaArrowRight className="ml-2" />
            </div>
          </motion.div>

          {/* Admin Card */}
          <motion.div
            variants={itemVariants}
            whileHover={hoverCard}
            whileTap={tapCard}
            onClick={() => navigate('/admin/dashboard')}
            className="bg-white rounded-xl p-6 md:p-8 shadow-md cursor-pointer flex flex-col items-center border border-gray-100 hover:border-indigo-200 transition-all"
          >
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <FaUserShield className="text-indigo-600 text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Administrator</h2>
            <p className="text-gray-600 mb-4 text-center">
              Access admin dashboard to manage all homestays and system settings
            </p>
            <div className="flex items-center text-indigo-600 font-medium mt-auto">
              <span>Continue</span>
              <FaArrowRight className="ml-2" />
            </div>
          </motion.div>
        </div>

        <motion.div 
          variants={itemVariants}
          className="mt-8 text-gray-500 text-sm"
        >
          Need help? Contact support@homestay.com
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginRoute;

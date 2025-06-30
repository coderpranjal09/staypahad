import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  FaMountain,
  FaPhone,
  FaHome,
  FaTimes,
  FaBars,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaStar,
  FaBed,
  FaHiking,
  FaUserCircle,
  FaSearch
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { to: "/", text: "Home", icon: <FaHome size={14} /> },
    { to: "/search", text: "Destinations", icon: <FaMapMarkerAlt size={14} /> },
    { to: "/search", text: "Homestays", icon: <FaBed size={14} /> },
    { to: "/experiences", text: "Experiences", icon: <FaHiking size={14} /> },
    { to: "/contact", text: "About", icon: <FaInfoCircle size={14} /> }
  ];

  return (
    <>
      

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-sm' : 'bg-white/90 backdrop-blur-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <FaMountain className="text-2xl text-blue-600" />
                <div className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full w-2 h-2"></div>
              </div>
              <span className="ml-2 text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                <span className="text-blue-600">Stay</span>Pahad
              </span>
            </Link>

           
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => 
                    `flex items-center px-3 py-2 text-xs font-medium uppercase tracking-wider transition-colors rounded-lg mx-0.5
                    ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`
                  }
                >
                  {link.icon}
                  <span className="ml-1.5">{link.text}</span>
                </NavLink>
              ))}
            </nav>

            {/* Right side buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600">
                <FaUserCircle className="mr-1.5" />
                <span><Link to="/profile">Profile</Link></span>
              </button>
              <Link to="tel:9258902271">
              <button className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all">
                <FaPhone className="mr-1.5 transform rotate-12" />
                <span>Contact</span>
              </button>
              </Link>
              
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-blue-600" />
              ) : (
                <FaBars className="text-gray-600" />
              )}
            </button>
          </div>

          
          
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white border-t border-gray-100"
            >
              <nav className="flex flex-col">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) => 
                        `flex items-center px-4 py-3 text-sm font-medium border-b border-gray-100
                        ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`
                      }
                      onClick={toggleMobileMenu}
                    >
                      <span className="mr-3">{link.icon}</span>
                      {link.text}
                    </NavLink>
                  </motion.div>
                ))}
                <div className="flex p-4 space-x-2 border-t border-gray-100">
                  <button className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 border border-gray-300 rounded-lg">
                    <FaUserCircle className="mr-1.5" />
                    <Link to="/profile">Profile</Link>
                  </button>
                  <Link to="tel:9258902271">
              <button className="flex items-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all">
                <FaPhone className="mr-1.5 transform rotate-12" />
                <span>Contact</span>
              </button>
              </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Stay Pahad</h3>
            <p className="mb-4">Experience the authentic beauty of Uttarakhand with our handpicked homestays.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-yellow-300"><FaFacebook /></a>
              <a href="#" className="hover:text-yellow-300"><FaInstagram /></a>
              <a href="#" className="hover:text-yellow-300"><FaTwitter /></a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-yellow-300">Home</a></li>
              <li><a href="#testimonials" className="hover:text-yellow-300">Testimonials</a></li>
              <li><a href="#" className="hover:text-yellow-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-yellow-300">Terms & Conditions</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="flex items-center"><FaMapMarkerAlt className="mr-2" /> Rudraprayag Uttarakhand</p>
              <p className="flex items-center"><FaPhone className="mr-2" /> +919258902271</p>
              <p className="flex items-center"><FaEnvelope className="mr-2" /> staypahad@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Stay Pahad. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
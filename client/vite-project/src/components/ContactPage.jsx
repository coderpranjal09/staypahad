import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Contact StayPahad
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto"
          >
            Get in touch with our team for bookings, inquiries, or any assistance
          </motion.p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                <FaPhone className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Call Us</h3>
              <p className="text-gray-600 text-center">
                Available 9AM - 7PM, 7 days a week
              </p>
              <a 
                href="tel:9258902271" 
                className="block text-blue-600 font-medium text-lg text-center mt-4 hover:text-blue-800"
              >
                +91 9258902271
              </a>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                <FaEnvelope className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Email Us</h3>
              <p className="text-gray-600 text-center">
                We'll respond within 24 hours
              </p>
              <a 
                href="mailto:staypahad@gmail.com" 
                className="block text-blue-600 font-medium text-lg text-center mt-4 hover:text-blue-800"
              >
                staypahad@gmail.com
              </a>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 mx-auto">
                <FaMapMarkerAlt className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-center mb-3">Our Office</h3>
              <p className="text-gray-600 text-center">
                Based in the heart of Uttarakhand
              </p>
              <p className="text-gray-800 font-medium text-center mt-4">
                Rudraprayag, Uttarakhand
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 mb-2">Your Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-1 rounded-xl shadow-sm overflow-hidden"
            >
              <h2 className="text-2xl font-bold mb-6 px-7 pt-6">Find Us</h2>
              <div className="h-full w-full">
                <iframe
                  title="StayPahad Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3440.798272756083!2d78.9838683151086!3d30.28442258175048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092b9451a8b8a5%3A0x4e3e82f3a3a3266a!2sRudraprayag%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ minHeight: '400px', border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Follow us on social media for updates, offers, and beautiful Himalayan content
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="https://facebook.com/staypahad" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
            >
              <FaFacebook className="text-xl" />
            </a>
            <a 
              href="https://instagram.com/staypahad" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
            >
              <FaInstagram className="text-xl" />
            </a>
            <a 
              href="https://twitter.com/staypahad" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
            >
              <FaTwitter className="text-xl" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
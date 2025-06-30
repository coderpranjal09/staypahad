import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import {
  FaArrowRight,
  FaStar,
  FaMapMarkerAlt,
  FaHeart
} from 'react-icons/fa';
import { GiCampfire, GiVillage } from 'react-icons/gi';
import { motion } from 'framer-motion';
import Testimonials from '../components/Testimonials';

const Home = () => {
  const destinations = [
    {
      name: "Chopta & Tungnath",
      description: "Mini Switzerland with world's highest Shiva temple",
      image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgxSlGoF8-uQKFosYIJNIfVA_1LDsOw7kyBsvfQWSkCGZZIPBPSQMvQsGWQvDsaM4TkPwh7j5wQA7YTMPlbWuxhP_ZUGfx0H7DNA_10q1qRLvXCqxH8wDVYV9P2VFd7iaavJEvIPHujNZw/w1200-h630-p-k-no-nu/tungnath.jpg",
      location: "Rudraprayag",
      rating: 4.8,
      type: "Mountain",
      price: "₹1,200/night"
    },
    {
      name: "Kedarnath & Ukhimath",
      description: "Sacred pilgrimage site with winter deity abode",
      image: "https://www.uttarakhandtourtravels.com/wp-content/uploads/2025/04/kedarnath-temple-1024x683.webp",
      location: "Rudraprayag",
      rating: 4.9,
      type: "Religious",
      price: "₹1,500/night"
    },
    {
      name: "Madhmaheshwar",
      description: "Panch Kedar temple in Himalayan meadows",
      image: "https://www.nativeplanet.com/img/2017/10/5-27-1509095104.jpg",
      location: "Rudraprayag",
      rating: 4.7,
      type: "Trekking",
      price: "₹1,000/night"
    },
    {
      name: "Makkumath Temple",
      description: "Ancient temple with architectural beauty",
      image: "https://blogger.stayapart.in/wp-content/uploads/2023/07/Makkumath-A-Winter-Seat-of-Tungnath.jpg",
      location: "Rudraprayag",
      rating: 4.5,
      type: "Cultural",
      price: "₹900/night"
    }
  ];

  const features = [
    {
      title: "Authentic Homestays",
      description: "Experience local culture with comfortable accommodations",
      icon: <GiVillage className="text-blue-600 text-2xl" />
    },
    {
      title: "Community Tourism",
      description: "Directly support mountain communities",
      icon: <GiVillage className="text-blue-600 text-2xl" />
    },
    {
      title: "Adventure Guides",
      description: "Expert-led treks and experiences",
      icon: <GiCampfire className="text-blue-600 text-2xl" />
    },
    {
      title: "Sustainable Stays",
      description: "Eco-friendly accommodations",
      icon: <GiCampfire className="text-blue-600 text-2xl" />
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pb-48 min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-teal-500 z-0">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent opacity-20"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Authentic Himalayan Stays
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Experience Uttarakhand's hidden gems through local homestays and community tourism
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto w-full mt-8"
          >
            <SearchBar />
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/10 backdrop-blur-sm"></div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Featured Destinations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated selection of Himalayan gems
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-gray-700 hover:text-red-500 transition-colors">
                    <FaHeart />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-white">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span className="font-medium">{destination.rating}</span>
                      </div>
                      <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                        {destination.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{destination.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{destination.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{destination.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-medium">{destination.price}</span>
                    <Link
                      to={'/search'}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      View <FaArrowRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Why Choose StayPahad?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're redefining Himalayan travel experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="flex justify-center text-4xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for Your Himalayan Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who've experienced authentic mountain stays
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/search"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300 inline-block"
            >
              Browse Homestays
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3 rounded-full transition duration-300 inline-block"
            >
              Contact Our Experts
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  );
};

export default Home;
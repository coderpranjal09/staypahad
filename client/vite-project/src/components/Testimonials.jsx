import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Amit Sharma",
    location: "Delhi",
    text: "The best homestay experience in Uttarakhand! The hospitality was amazing and the views were breathtaking.",
    rating: 5,
    avatar: "AS"
  },
  {
    id: 2,
    name: "Priya Patel",
    location: "Mumbai",
    text: "Authentic local experience with all modern comforts. Will definitely come back to Stay Pahad for my next trip.",
    rating: 4,
    avatar: "PP"
  },
  {
    id: 3,
    name: "Rahul Verma",
    location: "Bangalore",
    text: "The perfect blend of nature and comfort. The hosts were so welcoming and the food was delicious!",
    rating: 5,
    avatar: "RV"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
            Guest Experiences
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from travelers who've discovered the magic of Himalayan hospitality
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={`text-lg ${i < testimonial.rating ? "text-yellow-400" : "text-gray-200"}`} 
                  />
                ))}
              </div>
              
              <div className="relative mb-6">
                <FaQuoteLeft className="absolute -top-1 left-0 text-blue-100 text-4xl" />
                <p className="text-gray-600 relative z-10 pl-8">
                  {testimonial.text}
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm flex items-center">
                    <svg className="w-3 h-3 mr-1 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all">
            Share Your Experience
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
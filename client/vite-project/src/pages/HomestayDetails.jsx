import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaRupeeSign, 
  FaPhone, 
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaTimes
} from 'react-icons/fa';
import homestaysData from '../homestays.json';
import AmenitiesIcons from '../components/AmenitiesIcons';
import BookingForm from '../components/BookingForm';
import { motion, AnimatePresence } from 'framer-motion';

const HomestayDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState({
    checkIn: null,
    checkOut: null
  });

  // Fixed: Remove parseInt since IDs are strings in the JSON
  const homestay = homestaysData.find(h => h.id === id);

  if (!homestay) {
    return <div className="container mx-auto px-4 py-8">Homestay not found</div>;
  }

  const handleBookNow = (checkIn, checkOut) => {
    setSelectedDates({ checkIn, checkOut });
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (bookingData) => {
    console.log('Booking submitted:', bookingData);
    setShowBookingForm(false);
    navigate('/');
  };

  const openGallery = (index = 0) => {
    setCurrentImageIndex(index);
    setShowGallery(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setShowGallery(false);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentImageIndex === 0 ? homestay.images.length - 1 : currentImageIndex - 1;
    } else {
      newIndex = currentImageIndex === homestay.images.length - 1 ? 0 : currentImageIndex + 1;
    }
    setCurrentImageIndex(newIndex);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Back to results
          </button>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Image Gallery Preview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            <div 
              className="md:col-span-3 h-64 md:h-96 relative cursor-pointer"
              onClick={() => openGallery(0)}
            >
              <img 
                src={homestay.images[0] || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
                alt={homestay.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                View Gallery ({homestay.images.length} photos)
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-0">
              {homestay.images.slice(1, 3).map((img, index) => (
                <div 
                  key={index} 
                  className="h-32 md:h-48 relative cursor-pointer"
                  onClick={() => openGallery(index + 1)}
                >
                  <img 
                    src={img || "https://images.unsplash.com/photo-1517840901100-8179e982acb7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"} 
                    alt={homestay.name} 
                    className="w-full h-full object-cover"
                  />
                  {index === 1 && homestay.images.length > 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                      +{homestay.images.length - 3} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
              <div className="flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">{homestay.name}</h1>
                <p className="text-gray-600 mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" />
                  {homestay.location}
                </p>
                
                <div className="flex items-center mb-6">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`text-lg ${i < 4.8 ? "text-yellow-400" : "text-gray-300"}`} 
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-gray-800">4.8</span>
                  <span className="text-gray-500 text-sm ml-1">(24 reviews)</span>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">About this homestay</h3>
                  <p className="text-gray-700 leading-relaxed">{homestay.description}</p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Amenities</h3>
                  <AmenitiesIcons amenities={homestay.amenities} />
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Host Information</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="font-semibold text-gray-800">Host: {homestay.owner}</p>
                    <p className="flex items-center mt-2 text-gray-700">
                      <FaPhone className="mr-2 text-blue-600" />
                      <a href={`tel:${homestay.ownerMob}`} className="hover:underline">{homestay.ownerMob}</a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="md:w-96 bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24">
                <div className="mb-6">
                  <h3 className="text-xl font-bold flex items-center text-gray-800">
                    <FaRupeeSign className="mr-1" /> {homestay.price}
                    <span className="text-gray-600 text-base font-normal ml-1">per night</span>
                  </h3>
                </div>
                
                <button
                  onClick={() => handleBookNow(null, null)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg mb-4"
                >
                  Book Now
                </button>
                
                <div className="text-center text-gray-500 text-sm mb-4">or</div>
                
                <button
                  onClick={() => navigate(`/search?location=${homestay.location}`)}
                  className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 px-4 rounded-lg font-semibold transition-all"
                >
                  Check Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm 
          homestay={homestay} 
          checkInDate={selectedDates.checkIn}
          checkOutDate={selectedDates.checkOut}
          onClose={() => setShowBookingForm(false)}
          onSubmit={handleBookingSubmit}
        />
      )}
      
      {/* Image Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          >
            <button 
              onClick={closeGallery}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            >
              <FaTimes className="text-2xl" />
            </button>
            
            <div className="relative w-full max-w-5xl">
              <button 
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full z-10"
              >
                <FaChevronLeft className="text-xl" />
              </button>
              
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-[70vh]"
              >
                <img 
                  src={homestay.images[currentImageIndex]} 
                  alt={`${homestay.name} - ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              </motion.div>
              
              <button 
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-3 rounded-full z-10"
              >
                <FaChevronRight className="text-xl" />
              </button>
              
              <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                {currentImageIndex + 1} / {homestay.images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomestayDetails;
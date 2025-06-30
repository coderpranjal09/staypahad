import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, 
  FaStar, 
  FaRupeeSign,
  FaHeart,
  FaBed,
  FaUserFriends,
  FaRegStar,
  FaStarHalfAlt
} from 'react-icons/fa';
import { GiMountainRoad, GiWoodCabin } from 'react-icons/gi';
import { IoIosArrowForward } from 'react-icons/io';
import AmenitiesIcons from './AmenitiesIcons';

const HomestayCard = ({ homestay, searchParams }) => {
  // Calculate total guests if searchParams available
  const totalGuests = searchParams?.guests || 1;
  const totalNights = searchParams?.checkIn && searchParams?.checkOut ? 
    Math.round((new Date(searchParams.checkOut) - new Date(searchParams.checkIn))) / (1000 * 60 * 60 * 24) : 1;

  // Render star ratings with half-star support
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
      {/* Image with price and favorite button */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={homestay.images[0] || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"} 
          alt={homestay.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        
        {/* Price badge */}
        <div className="absolute top-4 left-4 bg-white/90 text-green-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
          <FaRupeeSign className="inline mr-1" />
          {homestay.price}/night
        </div>
        
        {/* Favorite button */}
        <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm text-gray-500 hover:text-red-500 transition-colors">
          <FaHeart />
        </button>
        
        {/* Quick info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <h3 className="font-bold text-lg">{homestay.name}</h3>
              <p className="text-sm flex items-center">
                <FaMapMarkerAlt className="mr-1 text-green-300" />
                {homestay.location}
              </p>
            </div>
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              <div className="flex mr-1">
                {renderStars(homestay.rating || 4.5)}
              </div>
              <span className="text-white text-sm font-medium">{homestay.rating || 4.5}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card body */}
      <div className="p-5">
        {/* Amenities quick view */}
        <AmenitiesIcons amenities={homestay.amenities} />
        
        {/* Description with read more */}
        <p className="text-gray-600 my-4 line-clamp-2">
          {homestay.description || "Experience authentic Himalayan hospitality with breathtaking mountain views and comfortable accommodations."}
        </p>
        
        {/* Price calculation if dates are selected */}
        {searchParams?.checkIn && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between text-sm text-gray-700">
              <span>₹{homestay.price} × {totalNights} nights</span>
              <span>₹{homestay.price * totalNights}</span>
            </div>
            <div className="flex justify-between font-semibold mt-1">
              <span>Total</span>
              <span className="text-green-600">₹{homestay.price * totalNights}</span>
            </div>
          </div>
        )}
        
        {/* Footer with CTA */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <FaUserFriends className="mr-1" />
            <span>Up to {homestay.capacity || 4} guests</span>
          </div>
          
          <Link 
            to={`/homestay/${homestay.id}`}
            className="flex items-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
          >
            View Details <IoIosArrowForward className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomestayCard;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchBar = () => {
  const [location, setLocation] = useState('');
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!location) return;
    
    const queryParams = new URLSearchParams({
      location,
      checkIn: checkInDate ? checkInDate.toISOString() : '',
      checkOut: checkOutDate ? checkOutDate.toISOString() : '',
      guests
    }).toString();
    
    navigate(`/search?${queryParams}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Location */}
        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaMapMarkerAlt className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Where to?"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onClick={() => setIsExpanded(true)}
              required
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="text-gray-400" />
            </div>
            <DatePicker
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={new Date()}
              placeholderText="Select date"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="text-gray-400" />
            </div>
            <DatePicker
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              minDate={checkInDate || new Date()}
              placeholderText="Select date"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Guests */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUsers className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6,7,8,9,"10+"].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="md:col-span-2 flex items-end">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg shadow-md transition duration-300"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
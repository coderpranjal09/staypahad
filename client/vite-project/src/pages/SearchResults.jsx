import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaFilter, 
  FaStar, 
  FaWifi, 
  FaCar, 
  FaMountain, 
  FaUtensils,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBed,
  FaUserFriends,
  FaRegStar,
  FaStarHalfAlt
} from 'react-icons/fa';
import { GiMountainRoad } from 'react-icons/gi';
import { IoIosArrowBack } from 'react-icons/io';
import HomestayCard from '../components/HomestayCard';
import homestaysData from '../homestays.json';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({});
  const [filteredHomestays, setFilteredHomestays] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOption, setSortOption] = useState('recommended');
  const [filters, setFilters] = useState({
    priceRange: [500, 5000],
    rating: 0,
    amenities: []
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchData = {
      location: params.get('location') || '',
      checkIn: params.get('checkIn') ? new Date(params.get('checkIn')) : null,
      checkOut: params.get('checkOut') ? new Date(params.get('checkOut')) : null,
      guests: parseInt(params.get('guests')) || 1
    };
    setSearchParams(searchData);

    let results = homestaysData.filter(homestay => 
      homestay.location.toLowerCase().includes(searchData.location.toLowerCase())
    );

    results = results.filter(homestay => 
      homestay.price >= filters.priceRange[0] && 
      homestay.price <= filters.priceRange[1]
    );

    if (filters.rating > 0) {
      results = results.filter(homestay => homestay.rating >= filters.rating);
    }

    if (filters.amenities.length > 0) {
      results = results.filter(homestay => 
        filters.amenities.every(amenity => homestay.amenities.includes(amenity)))
    }

    switch(sortOption) {
      case 'priceLowToHigh':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighToLow':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        results.sort((a, b) => (b.rating * 2) - (a.rating * 2) + (b.reviews - a.reviews));
    }

    setFilteredHomestays(results);
  }, [location.search, filters, sortOption]);

  const handleFilterChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'amenities') {
      setFilters(prev => ({
        ...prev,
        amenities: checked 
          ? [...prev.amenities, value] 
          : prev.amenities.filter(a => a !== value)
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePriceRangeChange = (e, index) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(e.target.value);
    setFilters(prev => ({
      ...prev,
      priceRange: newPriceRange
    }));
  };

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <IoIosArrowBack className="mr-1" /> Back
            </button>
            
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchParams.location}
                  readOnly
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full bg-gray-100"
                />
                <FaSearch className="absolute left-3 top-3 text-gray-500" />
              </div>
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              <FaFilter className="mr-2" /> Filters
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-72 bg-white p-5 rounded-lg shadow-md h-fit sticky top-20`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center">
                <FaRupeeSign className="mr-2 text-gray-600" /> Price Range
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{filters.priceRange[0]}</span>
                  <span>₹{filters.priceRange[1]}</span>
                </div>
                <div className="px-2">
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, 0)}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, 1)}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer mt-4"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center">
                <FaStar className="mr-2 text-yellow-400" /> Ratings
              </h4>
              <div className="space-y-2">
                {[4.5, 4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      rating: prev.rating === rating ? 0 : rating 
                    }))}
                    className={`flex items-center w-full p-2 rounded ${filters.rating === rating ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex mr-2">
                      {renderStars(rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {rating}+ ({rating === 4.5 ? 'Excellent' : rating === 4 ? 'Very Good' : 'Good'})
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <FaBed className="mr-2 text-gray-600" /> Amenities
              </h4>
              <div className="space-y-3">
                {[
                  { value: 'wifi', label: 'Free WiFi', icon: <FaWifi className="mr-2" /> },
                  { value: 'parking', label: 'Parking', icon: <FaCar className="mr-2" /> },
                  { value: 'mountainView', label: 'Mountain View', icon: <FaMountain className="mr-2" /> },
                  { value: 'breakfast', label: 'Breakfast', icon: <FaUtensils className="mr-2" /> },
                  { value: 'trekking', label: 'Trekking Guide', icon: <GiMountainRoad className="mr-2" /> }
                ].map(amenity => (
                  <label key={amenity.value} className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity.value}
                      checked={filters.amenities.includes(amenity.value)}
                      onChange={handleFilterChange}
                      className="mr-3 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="flex items-center text-gray-700">
                      {amenity.icon} {amenity.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {filteredHomestays.length} Homestays in {searchParams.location || 'Uttarakhand'}
                  </h2>
                  {searchParams.checkIn && (
                    <p className="text-gray-600 flex items-center mt-1">
                      <FaCalendarAlt className="mr-2" />
                      {searchParams.checkIn.toLocaleDateString('en-IN')} - {searchParams.checkOut?.toLocaleDateString('en-IN')} • 
                      <FaUserFriends className="mx-2" />
                      {searchParams.guests} {searchParams.guests > 1 ? 'Guests' : 'Guest'}
                    </p>
                  )}
                </div>
                
                <div className="mt-3 md:mt-0">
                  <label htmlFor="sort" className="sr-only">Sort by</label>
                  <select
                    id="sort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="priceLowToHigh">Price: Low to High</option>
                    <option value="priceHighToLow">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>
            
            {filteredHomestays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHomestays.map(homestay => (
                  <HomestayCard 
                    key={homestay.id} 
                    homestay={homestay} 
                    searchParams={searchParams}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="mx-auto mb-6 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaSearch className="text-2xl text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">No homestays found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any homestays matching your criteria. Try adjusting your filters or search in a different location.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      priceRange: [500, 5000],
                      rating: 0,
                      amenities: []
                    });
                    setShowFilters(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-full transition duration-300 inline-flex items-center"
                >
                  <FaFilter className="mr-2" /> Adjust Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchResults;

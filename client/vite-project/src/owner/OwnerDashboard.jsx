import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaRupeeSign, 
  FaUsers,
  FaChartLine,
  FaSignOutAlt,
  FaBell,
  FaUtensils,
  FaBed,
  FaWifi,
  FaCar
} from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';

const OwnerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [homestayData, setHomestayData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const homestayid = location.state?.homestayid;

  useEffect(() => {
    if (!homestayid) {
      navigate('/owner/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [homestayRes, bookingsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/homestays/by-homestayid/${homestayid}`),
          fetch(`http://localhost:5000/api/booking/property?homestayId=${homestayid}`)
        ]);

        if (!homestayRes.ok) throw new Error('Failed to fetch homestay data');
        if (!bookingsRes.ok) throw new Error('Failed to fetch bookings data');

        const homestay = await homestayRes.json();
        const bookingsData = await bookingsRes.json();

        setHomestayData(homestay);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [homestayid, navigate]);

  // Calculate metrics
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
  const monthlyRevenue = calculateMonthlyRevenue(bookings);
  const upcomingBookings = bookings.filter(b => new Date(b.checkIn) > new Date()).slice(0, 5);
  const currentGuests = bookings.filter(b => 
    new Date(b.checkIn) <= new Date() && new Date(b.checkOut) >= new Date()
  ).length;

  // Calculate revenue sources (assuming some breakdown)
  const revenueSources = {
    room: totalRevenue * 0.7,
    food: totalRevenue * 0.2,
    other: totalRevenue * 0.1
  };

  function calculateMonthlyRevenue(bookings) {
    // Create data for all months, initialized to 0
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.reduce((acc, month) => {
      acc[month] = 0;
      return acc;
    }, {});

    // Fill with actual data
    bookings.forEach(booking => {
      const monthIndex = new Date(booking.checkIn).getMonth();
      const month = months[monthIndex];
      monthlyData[month] += booking.totalPrice;
    });

    // Convert to array for chart
    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue
    }));
  }

  const getBookingStatus = (checkIn, checkOut) => {
    const now = new Date();
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (now < checkInDate) return 'Upcoming';
    if (now >= checkInDate && now <= checkOutDate) return 'Ongoing';
    return 'Completed';
  };

  const handleLogout = () => {
    navigate('/owner/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!homestayData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Homestay not found</h2>
          <p className="text-gray-600 mb-6">The homestay ID you provided doesn't exist in our records.</p>
          <button
            onClick={() => navigate('/owner/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <FaHome className="text-blue-600 text-2xl mr-2" />
            <h1 className="text-xl font-bold text-gray-800">{homestayData.name} Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <FaBell className="text-xl" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-blue-600"
            >
              <FaSignOutAlt className="mr-1" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-64 bg-white rounded-xl shadow-sm p-4 h-fit md:sticky  top-4">
            <div className="mb-6">
              <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl mx-auto mb-3">
                {homestayData.name.substring(0, 2)}
              </div>
              <h3 className="text-center font-semibold">{homestayData.name}</h3>
              <p className="text-center text-gray-500 text-sm">{homestayData.location}</p>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaChartLine className="mr-2" /> Overview
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaCalendarAlt className="mr-2" /> Bookings
              </button>
              <button
                onClick={() => setActiveTab('revenue')}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'revenue' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <GiMoneyStack className="mr-2" /> Revenue
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaUsers className="mr-2" /> Profile
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-lg mr-4">
                        <FaCalendarAlt className="text-xl" />
                      </div>
                      <div>
                        <p className="text-gray-500">Upcoming Bookings</p>
                        <h3 className="text-2xl font-bold">{upcomingBookings.length}</h3>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="bg-green-100 text-green-600 p-3 rounded-lg mr-4">
                        <FaUsers className="text-xl" />
                      </div>
                      <div>
                        <p className="text-gray-500">Current Guests</p>
                        <h3 className="text-2xl font-bold">{currentGuests}</h3>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="bg-purple-100 text-purple-600 p-3 rounded-lg mr-4">
                        <FaRupeeSign className="text-xl" />
                      </div>
                      <div>
                        <p className="text-gray-500">Total Revenue</p>
                        <h3 className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</h3>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
                  <Chart
                    options={{
                      chart: {
                        type: 'area',
                        height: 350,
                        toolbar: {
                          show: false
                        }
                      },
                      colors: ['#3B82F6'],
                      dataLabels: {
                        enabled: false
                      },
                      stroke: {
                        curve: 'smooth'
                      },
                      xaxis: {
                        categories: monthlyRevenue.map(item => item.month)
                      },
                      tooltip: {
                        y: {
                          formatter: function (val) {
                            return "₹" + val.toLocaleString();
                          }
                        }
                      }
                    }}
                    series={[{
                      name: 'Revenue',
                      data: monthlyRevenue.map(item => item.revenue)
                    }]}
                    type="area"
                    height={350}
                  />
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.slice(0, 5).map((booking, index) => {
                          const status = getBookingStatus(booking.checkIn, booking.checkOut);
                          const statusColors = {
                            'Upcoming': 'bg-blue-100 text-blue-800',
                            'Ongoing': 'bg-green-100 text-green-800',
                            'Completed': 'bg-gray-100 text-gray-800'
                          };
                          
                          return (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-medium">
                                      {booking.name ? booking.name.charAt(0) : 'G'}
                                    </span>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{booking.customerName || 'Guest'}</div>
                                    <div className="text-sm text-gray-500">{booking.customerPhone || 'No phone provided'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))} nights
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₹{booking.totalPrice?.toLocaleString() || '0'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
                                  {status}
                                </span>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">All Bookings</h3>
                  <div className="text-sm text-gray-500">
                    Showing {bookings.length} bookings
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking, index) => {
                        const status = getBookingStatus(booking.checkIn, booking.checkOut);
                        const statusColors = {
                          'Upcoming': 'bg-blue-100 text-blue-800',
                          'Ongoing': 'bg-green-100 text-green-800',
                          'Completed': 'bg-gray-100 text-gray-800'
                        };
                        
                        return (
                          <motion.tr
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{booking._id?.substring(0, 8) || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{booking.customerName || 'Guest'}</div>
                              <div className="text-sm text-gray-500">{booking.customerPhone || 'No phone'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))} nights
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {booking.adults || 0} adults, {booking.children || 0} children
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{booking.totalPrice?.toLocaleString() || '0'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
                                {status}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'revenue' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Revenue Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-medium mb-2">Monthly Breakdown</h4>
                      <Chart
                        options={{
                          chart: {
                            type: 'bar',
                            height: 350,
                            toolbar: {
                              show: false
                            }
                          },
                          colors: ['#3B82F6'],
                          plotOptions: {
                            bar: {
                              borderRadius: 4,
                              horizontal: false,
                            }
                          },
                          dataLabels: {
                            enabled: false
                          },
                          xaxis: {
                            categories: monthlyRevenue.map(item => item.month)
                          },
                          tooltip: {
                            y: {
                              formatter: function (val) {
                                return "₹" + val.toLocaleString();
                              }
                            }
                          }
                        }}
                        series={[{
                          name: 'Revenue',
                          data: monthlyRevenue.map(item => item.revenue)
                        }]}
                        type="bar"
                        height={350}
                      />
                    </div>
                    <div>
                      <h4 className="text-md font-medium mb-2">Revenue Sources</h4>
                      <Chart
                        options={{
                          chart: {
                            type: 'donut',
                          },
                          labels: ['Room Charges', 'Food & Beverages', 'Other Services'],
                          colors: ['#3B82F6', '#10B981', '#6366F1'],
                          legend: {
                            position: 'bottom'
                          },
                          dataLabels: {
                            formatter: function (val) {
                              return "₹" + Math.round(val * totalRevenue / 100).toLocaleString();
                            }
                          }
                        }}
                        series={[revenueSources.room, revenueSources.food, revenueSources.other]}
                        type="donut"
                        height={350}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Revenue Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">This Month</p>
                      <p className="text-2xl font-bold">
                        ₹{monthlyRevenue[new Date().getMonth()]?.revenue.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">Last Month</p>
                      <p className="text-2xl font-bold">
                        ₹{monthlyRevenue[new Date().getMonth() - 1]?.revenue.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">Projected Next Month</p>
                      <p className="text-2xl font-bold">
                        ₹{Math.round((monthlyRevenue[new Date().getMonth()]?.revenue || 0) * 1.1).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Revenue Sources Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border-l-4 border-blue-500 p-4 bg-blue-50 rounded-r-lg">
                      <div className="flex items-center mb-2">
                        <FaBed className="text-blue-500 mr-2" />
                        <h4 className="font-medium">Room Charges</h4>
                      </div>
                      <p className="text-2xl font-bold">₹{revenueSources.room.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(revenueSources.room / totalRevenue * 100).toFixed(1)}% of total
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 p-4 bg-green-50 rounded-r-lg">
                      <div className="flex items-center mb-2">
                        <FaUtensils className="text-green-500 mr-2" />
                        <h4 className="font-medium">Food & Beverages</h4>
                      </div>
                      <p className="text-2xl font-bold">₹{revenueSources.food.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(revenueSources.food / totalRevenue * 100).toFixed(1)}% of total
                      </p>
                    </div>
                    <div className="border-l-4 border-purple-500 p-4 bg-purple-50 rounded-r-lg">
                      <div className="flex items-center mb-2">
                        <FaCar className="text-purple-500 mr-2" />
                        <h4 className="font-medium">Other Services</h4>
                      </div>
                      <p className="text-2xl font-bold">₹{revenueSources.other.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(revenueSources.other / totalRevenue * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <h3 className="text-lg font-semibold mb-6">Homestay Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-md font-medium mb-4 text-gray-800">Basic Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Homestay Name</label>
                        <p className="mt-1 text-gray-900">{homestayData.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Location</label>
                        <p className="mt-1 text-gray-900">{homestayData.location}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Owner Name</label>
                        <p className="mt-1 text-gray-900">{homestayData.owner}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Contact Number</label>
                        <p className="mt-1 text-gray-900">{homestayData.ownerMob}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium mb-4 text-gray-800">Pricing</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Base Price (per night)</label>
                        <p className="mt-1 text-gray-900">₹{homestayData.price}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Breakfast Option</label>
                        <p className="mt-1 text-gray-900">₹200 per adult</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">All Meals Option</label>
                        <p className="mt-1 text-gray-900">₹500 per adult</p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
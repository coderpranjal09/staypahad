import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiHome, 
  FiDollarSign, 
  FiUsers, 
  FiPlusCircle, 
  FiSearch, 
  FiTrash2, 
  FiEdit, 
  FiArrowLeft,
  FiLogOut,
  FiPieChart,
  FiBarChart2,
  FiCalendar,
  FiMapPin,
  FiBook,
  FiTrendingUp,
  FiList
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chart from 'react-apexcharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [homestays, setHomestays] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedHomestay, setSelectedHomestay] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    homestayId: '',
    name: '',
    owner: '',
    ownerMob: '',
    location: '',
    price: ''
  });

  // Calculate monthly stats from bookings data
  const calculateMonthlyStats = (allBookings) => {
    const monthlyRevenue = Array(12).fill(0);
    const monthlyBookings = Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    
    allBookings.forEach(booking => {
      const bookingDate = new Date(booking.createdAt || booking.checkIn);
      if (bookingDate.getFullYear() === currentYear) {
        const month = bookingDate.getMonth();
        monthlyRevenue[month] += booking.totalPrice || 0;
        monthlyBookings[month]++;
      }
    });
    
    return { monthlyRevenue, monthlyBookings };
  };

  // Calculate dashboard stats
  const calculateDashboardStats = (allBookings, allHomestays) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const totalIncome = allBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    
    const currentMonthIncome = allBookings.reduce((sum, booking) => {
      const bookingDate = new Date(booking.createdAt || booking.checkIn);
      if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
        return sum + (booking.totalPrice || 0);
      }
      return sum;
    }, 0);
    
    const totalHomestays = allHomestays.length;
    const totalBookings = allBookings.length;
    
    // Get recent bookings (last 5)
    const recentBookings = [...allBookings]
      .sort((a, b) => new Date(b.createdAt || b.checkIn) - new Date(a.createdAt || a.checkIn))
      .slice(0, 5);
    
    return {
      totalIncome,
      currentMonthIncome,
      totalHomestays,
      totalBookings,
      recentBookings
    };
  };

  // Chart options
  const revenueChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false
      }
    },
    colors: ['#4F46E5'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "₹" + val.toLocaleString();
        }
      }
    }
  };

  const [revenueChartSeries, setRevenueChartSeries] = useState([{
    name: 'Revenue',
    data: Array(12).fill(0)
  }]);

  // Booking chart options
  const bookingChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    colors: ['#10B981'],
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    }
  };

  const [bookingChartSeries, setBookingChartSeries] = useState([{
    name: 'Bookings',
    data: Array(12).fill(0)
  }]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const [homestaysResponse, bookingsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/master/homestays', {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }),
          axios.get('http://localhost:5000/api/booking', {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          })
        ]);

        const allBookings = bookingsResponse.data;
        const allHomestays = homestaysResponse.data;
        
        // Calculate monthly stats
        const { monthlyRevenue, monthlyBookings } = calculateMonthlyStats(allBookings);
        
        // Calculate dashboard stats
        const dashboardStats = calculateDashboardStats(allBookings, allHomestays);
        
        setStats(dashboardStats);
        setHomestays(allHomestays);
        setBookings(allBookings);
        
        // Set chart data
        setRevenueChartSeries([{
          name: 'Revenue',
          data: monthlyRevenue
        }]);

        setBookingChartSeries([{
          name: 'Bookings',
          data: monthlyBookings
        }]);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/login');
          toast.error('Session expired. Please login again.');
        } else {
          toast.error('Failed to fetch data');
          console.error('API Error:', err.response?.data || err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleViewHomestayDetails = async (homestayId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `http://localhost:5000/api/master/homestays/${homestayId}`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      // Calculate homestay-specific stats
      const homestayBookings = response.data.bookings || [];
      const totalBookings = homestayBookings.length;
      const totalRevenue = homestayBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
      
      const thisMonthBookings = homestayBookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt || booking.checkIn);
        return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
      }).length;
      
      const thisMonthRevenue = homestayBookings.reduce((sum, booking) => {
        const bookingDate = new Date(booking.createdAt || booking.checkIn);
        if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
          return sum + (booking.totalPrice || 0);
        }
        return sum;
      }, 0);

      setSelectedHomestay({
        ...response.data.homestay,
        totalBookings,
        totalRevenue,
        latestBooking: homestayBookings[0]?.checkIn || null,
        thisMonthBookings,
        thisMonthRevenue
      });
      setActiveTab('homestays');
    } catch (err) {
      toast.error('Failed to fetch homestay details');
      console.error('API Error:', err.response?.data || err.message);
    }
  };

  const handleViewBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setActiveTab('bookings');
  };

  const handleAddHomestay = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        'http://localhost:5000/api/master/homestays', 
        {
          ...formData,
          price: Number(formData.price)
        }, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      setHomestays([...homestays, response.data]);
      setShowAddForm(false);
      setFormData({
        homestayId: '',
        name: '',
        owner: '',
        ownerMob: '',
        location: '',
        price: ''
      });
      toast.success('Homestay added successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add homestay';
      toast.error(errorMessage);
      console.error('API Error:', err.response?.data || err.message);
    }
  };

  const handleDeleteHomestay = async (homestayId) => {
    if (window.confirm('Are you sure you want to delete this homestay?')) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.delete(
          `http://localhost:5000/api/master/homestays/${homestayId}`,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }
        );

        setHomestays(homestays.filter(h => h.homestayId !== homestayId));
        if (selectedHomestay?.homestayId === homestayId) {
          setSelectedHomestay(null);
        }
        toast.success('Homestay deleted successfully!');
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to delete homestay';
        toast.error(errorMessage);
        console.error('API Error:', err.response?.data || err.message);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  const filteredHomestays = homestays.filter(homestay =>
    homestay.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    homestay.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    homestay.homestayId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookings.filter(booking =>
    booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.homestayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-dotted rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="w-6"></div> {/* Spacer for balance */}
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 lg:z-auto`}>
        <div className="flex items-center justify-center h-16 bg-indigo-600">
          <h1 className="text-white font-bold text-xl">Admin Panel</h1>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center px-6 py-3 ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}
          >
            <FiHome className="h-5 w-5" />
            <span className="mx-3 font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => { setActiveTab('homestays'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center px-6 py-3 ${activeTab === 'homestays' ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}
          >
            <FiUsers className="h-5 w-5" />
            <span className="mx-3 font-medium">Homestays</span>
          </button>
          <button
            onClick={() => { setActiveTab('bookings'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center px-6 py-3 ${activeTab === 'bookings' ? 'bg-indigo-50 text-indigo-700 border-r-4 border-indigo-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}
          >
            <FiList className="h-5 w-5" />
            <span className="mx-3 font-medium">Bookings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 mt-4 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <FiLogOut className="h-5 w-5" />
            <span className="mx-3 font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow hidden lg:block">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Admin</span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && stats && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                      <FiDollarSign className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        ₹{stats.totalIncome?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <FiPieChart className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">This Month Revenue</h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        ₹{stats.currentMonthIncome?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <FiUsers className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Homestays</h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {stats.totalHomestays || '0'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                      <FiBook className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
                      <p className="mt-1 text-2xl font-semibold text-gray-900">
                        {stats.totalBookings || '0'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Monthly Revenue</h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiTrendingUp className="mr-1" />
                      <span>Last 12 months</span>
                    </div>
                  </div>
                  <Chart
                    options={revenueChartOptions}
                    series={revenueChartSeries}
                    type="area"
                    height={350}
                  />
                </div>

                {/* Bookings Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Monthly Bookings</h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiBarChart2 className="mr-1" />
                      <span>Last 12 months</span>
                    </div>
                  </div>
                  <Chart
                    options={bookingChartOptions}
                    series={bookingChartSeries}
                    type="bar"
                    height={350}
                  />
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white shadow rounded-lg mb-8">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Homestay</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.recentBookings?.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No recent bookings
                          </td>
                        </tr>
                      ) : (
                        stats.recentBookings?.map((booking) => (
                          <tr key={`booking-${booking._id}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking._id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{booking.homestay?.name || booking.homestayName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{booking.customerName}</div>
                              <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{booking.totalPrice?.toLocaleString() || '0'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleViewBookingDetails(booking)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Homestays Tab */}
          {activeTab === 'homestays' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <h2 className="text-lg font-semibold text-gray-900">Homestays Management</h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search homestays..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FiPlusCircle className="mr-2 h-5 w-5" />
                    Add Homestay
                  </button>
                </div>
              </div>

              {showAddForm ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Add New Homestay</h3>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FiArrowLeft className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleAddHomestay} className="space-y-4">
                    <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="homestayId" className="block text-sm font-medium text-gray-700">
                          Homestay ID
                        </label>
                        <input
                          type="text"
                          name="homestayId"
                          id="homestayId"
                          value={formData.homestayId}
                          onChange={(e) => setFormData({...formData, homestayId: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                          placeholder="e.g. rk01"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                          placeholder="e.g. Riverside Retreat"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
                          Owner
                        </label>
                        <input
                          type="text"
                          name="owner"
                          id="owner"
                          value={formData.owner}
                          onChange={(e) => setFormData({...formData, owner: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                          placeholder="e.g. Rakesh Rawat"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="ownerMob" className="block text-sm font-medium text-gray-700">
                          Owner Mobile
                        </label>
                        <input
                          type="tel"
                          name="ownerMob"
                          id="ownerMob"
                          value={formData.ownerMob}
                          onChange={(e) => setFormData({...formData, ownerMob: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                          pattern="[0-9]{10}"
                          placeholder="e.g. 9876543210"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                          placeholder="e.g. Kedarnath"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                          min="0"
                          placeholder="e.g. 1800"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Homestay
                      </button>
                    </div>
                  </form>
                </div>
              ) : selectedHomestay ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Homestay Details</h3>
                    <button
                      onClick={() => setSelectedHomestay(null)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FiArrowLeft className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Homestay ID</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedHomestay.homestayId}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Name</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedHomestay.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Owner</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedHomestay.owner}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Owner Mobile</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedHomestay.ownerMob}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Location</p>
                            <p className="mt-1 text-sm text-gray-900 flex items-center">
                              <FiMapPin className="mr-1" /> {selectedHomestay.location}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Price</p>
                            <p className="mt-1 text-sm text-gray-900">₹{selectedHomestay.price}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">Booking Statistics</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedHomestay.totalBookings || '0'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="mt-1 text-sm text-gray-900">₹{(selectedHomestay.totalRevenue || '0').toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">This Month Bookings</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedHomestay.thisMonthBookings || '0'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">This Month Revenue</p>
                            <p className="mt-1 text-sm text-gray-900">₹{(selectedHomestay.thisMonthRevenue || '0').toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Latest Booking</p>
                            <p className="mt-1 text-sm text-gray-900 flex items-center">
                              <FiCalendar className="mr-1" />
                              {selectedHomestay.latestBooking ? 
                                new Date(selectedHomestay.latestBooking).toLocaleDateString() : 'No bookings yet'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleDeleteHomestay(selectedHomestay.homestayId)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <FiTrash2 className="mr-2 h-5 w-5" />
                            Delete Homestay
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredHomestays.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            No homestays found
                          </td>
                        </tr>
                      ) : (
                        filteredHomestays.map((homestay) => (
                          <tr key={`homestay-${homestay.homestayId}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {homestay.homestayId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {homestay.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {homestay.location}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{homestay.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleViewHomestayDetails(homestay.homestayId)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                              >
                                View
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleDeleteHomestay(homestay.homestayId)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <h2 className="text-lg font-semibold text-gray-900">Bookings Management</h2>
                <div className="relative w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {selectedBooking ? (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Booking Details</h3>
                    <button
                      onClick={() => setSelectedBooking(null)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FiArrowLeft className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">Booking Information</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Booking ID</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedBooking._id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Homestay</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedBooking.homestayName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Dates</p>
                            <p className="mt-1 text-sm text-gray-900">
                              {new Date(selectedBooking.checkIn).toLocaleDateString()} - {new Date(selectedBooking.checkOut).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Total Price</p>
                            <p className="mt-1 text-sm text-gray-900">₹{selectedBooking.totalPrice?.toLocaleString() || '0'}</p>
                          </div>
                          <div>
  <p className="text-sm font-medium text-gray-500">Booking Date</p>
  <p className="mt-1 text-sm text-gray-900">
    {selectedBooking.bookingDate ? new Date(selectedBooking.bookingDate).toLocaleDateString() : 'N/A'}
  </p>
</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">Customer Information</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Customer Name</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedBooking.customerName}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Customer Phone</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedBooking.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Customer Email</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedBooking.email || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Number of Guests</p>
                            <p className="mt-1 text-sm text-gray-900">{selectedBooking.adults + (selectedBooking.children || 0) || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <p className="mt-1 text-sm text-gray-900 capitalize">{selectedBooking.status || 'confirmed'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Homestay</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No bookings found
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map((booking) => (
                          <tr key={`booking-${booking._id}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking._id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{booking.homestay?.name || booking.homestayName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{booking.customerName}</div>
                              <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{booking.totalPrice?.toLocaleString() || '0'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleViewBookingDetails(booking)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
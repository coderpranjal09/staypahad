import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaPhone, 
  FaCalendarAlt, 
  FaRupeeSign,
  FaHome,
  FaCheckCircle,
  FaRegCheckCircle,
  FaTimes,
  FaPlus,
  FaMinus,
  FaFilePdf
} from 'react-icons/fa';
import { GiMeal } from 'react-icons/gi';
import { IoMdMail } from 'react-icons/io';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jsPDF } from 'jspdf';

const BookingForm = ({ homestay, checkInDate, checkOutDate, guests, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    checkIn: checkInDate || new Date(),
    checkOut: checkOutDate || new Date(new Date().setDate(new Date().getDate() + 1)),
    adults: guests || 1,
    children: 0,
    rooms: 1
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [foodOption, setFoodOption] = useState('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  
  useEffect(() => {
    if (homestay) {
      calculateTotal();
    }
  }, [formData, foodOption]);

  const calculateTotal = () => {
    const nights = Math.ceil((formData.checkOut - formData.checkIn) / (1000 * 60 * 60 * 24));
    let basePrice = homestay.price * formData.rooms * nights;
    
    let foodPrice = 0;
    if (foodOption === 'breakfast') foodPrice = 200 * formData.adults * nights;
    if (foodOption === 'all') foodPrice = 500 * formData.adults * nights;
    
    const subtotal = basePrice + foodPrice;
    const gst = subtotal * 0.05; // 5% GST
    const total = subtotal + gst;
    
    setTotalPrice(total);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleNumberChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }));
  };

  const generateTicket = (booking) => {
    const doc = new jsPDF();
    
    // Add logo or title
    doc.setFontSize(20);
    doc.setTextColor(40, 53, 147);
    doc.text('Homestay Booking Confirmation', 105, 20, null, null, 'center');
    
    // Add booking details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Booking ID: ${booking.bookingId}`, 20, 40);
    doc.text(`Booking Date: ${new Date(booking.bookingDate).toLocaleDateString()}`, 20, 50);
    
    doc.text(`Homestay: ${booking.homestayName}`, 20, 60);
    doc.text(`Guest Name: ${booking.customerName}`, 20, 70);
    doc.text(`Phone: ${booking.customerPhone}`, 20, 80);
    doc.text(`Email: ${booking.email}`, 20, 90);
    
    doc.text(`Check-in: ${new Date(booking.checkIn).toLocaleDateString()}`, 20, 100);
    doc.text(`Check-out: ${new Date(booking.checkOut).toLocaleDateString()}`, 20, 110);
    
    doc.text(`Guests: ${booking.adults} Adults, ${booking.children} Children`, 20, 120);
    doc.text(`Rooms: ${booking.rooms}`, 20, 130);
    doc.text(`Food Option: ${booking.foodOption === 'none' ? 'No meals' : booking.foodOption === 'breakfast' ? 'Breakfast only' : 'All meals'}`, 20, 140);
    
    // Price breakdown
    doc.text('Payment Details:', 20, 150);
    const nights = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24));
    
    doc.text(`Room Charges: ₹${homestay.price} x ${booking.rooms} room x ${nights} nights = ₹${homestay.price * booking.rooms * nights}`, 25, 160);
    
    if (booking.foodOption !== 'none') {
      const foodRate = booking.foodOption === 'breakfast' ? 200 : 500;
      doc.text(`Food Charges: ₹${foodRate} x ${booking.adults} adults x ${nights} days = ₹${foodRate * booking.adults * nights}`, 25, 170);
    }
    
    doc.text(`Taxes (5% GST): ₹${(booking.totalPrice * 0.05).toFixed(2)}`, 25, booking.foodOption === 'none' ? 170 : 180);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Amount: ₹${booking.totalPrice.toFixed(2)}`, 25, booking.foodOption === 'none' ? 190 : 200);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your booking!', 105, 280, null, null, 'center');
    doc.text('For any queries, please contact: +919258902271', 105, 285, null, null, 'center');
    
    // Save the PDF
    doc.save(`booking-ticket-${booking.bookingId}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const bookingData = {
      homestayId: homestay.id,
      homestayName: homestay.name,
      customerName: formData.name,
      customerPhone: formData.phone,
      email: formData.email,
      checkIn: formData.checkIn.toISOString(),
      checkOut: formData.checkOut.toISOString(),
      adults: formData.adults,
      children: formData.children,
      rooms: formData.rooms,
      foodOption,
      totalPrice,
      bookingDate: new Date().toISOString()
    };

    try {
      const response = await fetch('https://staypahad.vercel.app/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      const data = await response.json();
      const bookingId = data.bookingId || `HS-${Date.now()}`;
      
      // Create complete booking data with ID
      const completeBookingData = {
        ...bookingData,
        bookingId
      };
      
      setBookingData(completeBookingData);
      
      toast.success(
        <div>
          <h3 className="font-bold">Booking Confirmed!</h3>
          <p>Your reservation at {homestay.name} is confirmed.</p>
          <p>Your booking ID: {bookingId}</p>
          <button 
            onClick={() => generateTicket(completeBookingData)}
            className="mt-2 flex items-center justify-center bg-blue-600 text-white py-1 px-3 rounded text-sm"
          >
            <FaFilePdf className="mr-1" /> Download Ticket
          </button>
        </div>,
        {
          position: "top-center",
          autoClose: 8000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );

      setBookingSuccess(true);
      generateTicket(completeBookingData);
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(
        <div>
          <h3 className="font-bold">Booking Failed</h3>
          <p>There was an error processing your booking. Please try again.</p>
        </div>,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto border border-gray-200"
        >
          <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaHome className="text-blue-600 mr-2" />
              Book Your Stay
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          
          <div className="p-6 md:p-8">
            {bookingSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="text-green-500 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-6">Your reservation at {homestay.name} has been successfully booked.</p>
                
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 max-w-md mx-auto mb-6 text-left">
                  <h4 className="font-bold mb-3 text-blue-800">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Booking ID:</span>
                      <span className="font-medium">{bookingData.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guest Name:</span>
                      <span className="font-medium">{bookingData.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dates:</span>
                      <span className="font-medium">
                        {new Date(bookingData.checkIn).toLocaleDateString()} - {new Date(bookingData.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-blue-600">₹{bookingData.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => generateTicket(bookingData)}
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    <FaFilePdf className="mr-2" /> Download Ticket
                  </button>
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-bold mb-4 text-blue-800">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Full Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                          <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Phone Number</label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                          <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                          <IoMdMail className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dates and Guests */}
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-bold mb-4 text-blue-800">Stay Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Check-in</label>
                        <div className="relative">
                          <DatePicker
                            selected={formData.checkIn}
                            onChange={(date) => handleDateChange(date, 'checkIn')}
                            minDate={new Date()}
                            className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                          <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Check-out</label>
                        <div className="relative">
                          <DatePicker
                            selected={formData.checkOut}
                            onChange={(date) => handleDateChange(date, 'checkOut')}
                            minDate={formData.checkIn || new Date()}
                            className="w-full p-3 border border-gray-300 rounded-lg pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                          <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Rooms</label>
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => handleNumberChange('rooms', formData.rooms - 1)}
                            className="bg-gray-100 hover:bg-gray-200 p-3 text-gray-600 transition disabled:opacity-50"
                            disabled={formData.rooms <= 1}
                          >
                            <FaMinus />
                          </button>
                          <span className="flex-1 text-center px-2 font-medium">
                            {formData.rooms} {formData.rooms === 1 ? 'Room' : 'Rooms'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleNumberChange('rooms', formData.rooms + 1)}
                            className="bg-gray-100 hover:bg-gray-200 p-3 text-gray-600 transition disabled:opacity-50"
                            disabled={formData.rooms >= 4}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Adults</label>
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => handleNumberChange('adults', formData.adults - 1)}
                            className="bg-gray-100 hover:bg-gray-200 p-3 text-gray-600 transition disabled:opacity-50"
                            disabled={formData.adults <= 1}
                          >
                            <FaMinus />
                          </button>
                          <span className="flex-1 text-center px-2 font-medium">
                            {formData.adults}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleNumberChange('adults', formData.adults + 1)}
                            className="bg-gray-100 hover:bg-gray-200 p-3 text-gray-600 transition disabled:opacity-50"
                            disabled={formData.adults >= 6}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Children</label>
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                          <button
                            type="button"
                            onClick={() => handleNumberChange('children', formData.children - 1)}
                            className="bg-gray-100 hover:bg-gray-200 p-3 text-gray-600 transition disabled:opacity-50"
                            disabled={formData.children <= 0}
                          >
                            <FaMinus />
                          </button>
                          <span className="flex-1 text-center px-2 font-medium">
                            {formData.children}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleNumberChange('children', formData.children + 1)}
                            className="bg-gray-100 hover:bg-gray-200 p-3 text-gray-600 transition disabled:opacity-50"
                            disabled={formData.children >= 4}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Food Options */}
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                    <h3 className="font-bold mb-4 text-blue-800 flex items-center">
                      <GiMeal className="text-blue-600 mr-2" />
                      Food Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setFoodOption('none')}
                        className={`p-4 border rounded-lg text-left transition-all ${foodOption === 'none' ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white hover:border-blue-300'}`}
                      >
                        <div className="flex items-center mb-2">
                          {foodOption === 'none' ? (
                            <FaCheckCircle className="text-blue-500 mr-2" />
                          ) : (
                            <FaRegCheckCircle className="text-gray-400 mr-2" />
                          )}
                          <span className="font-medium">No Meals</span>
                        </div>
                        <p className="text-sm text-gray-600">Enjoy local restaurants</p>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setFoodOption('breakfast')}
                        className={`p-4 border rounded-lg text-left transition-all ${foodOption === 'breakfast' ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white hover:border-blue-300'}`}
                      >
                        <div className="flex items-center mb-2">
                          {foodOption === 'breakfast' ? (
                            <FaCheckCircle className="text-blue-500 mr-2" />
                          ) : (
                            <FaRegCheckCircle className="text-gray-400 mr-2" />
                          )}
                          <span className="font-medium">Breakfast Only</span>
                        </div>
                        <p className="text-sm text-gray-600">₹200 per adult per day</p>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setFoodOption('all')}
                        className={`p-4 border rounded-lg text-left transition-all ${foodOption === 'all' ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white hover:border-blue-300'}`}
                      >
                        <div className="flex items-center mb-2">
                          {foodOption === 'all' ? (
                            <FaCheckCircle className="text-blue-500 mr-2" />
                          ) : (
                            <FaRegCheckCircle className="text-gray-400 mr-2" />
                          )}
                          <span className="font-medium">All Meals</span>
                        </div>
                        <p className="text-sm text-gray-600">₹500 per adult per day</p>
                      </button>
                    </div>
                  </div>
                  
                  {/* Price Summary */}
                  <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100">
                    <h3 className="font-bold mb-4 text-blue-800">Price Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          ₹{homestay.price} × {formData.rooms} room × {Math.ceil((formData.checkOut - formData.checkIn) / (1000 * 60 * 60 * 24))} nights
                        </span>
                        <span className="font-medium">
                          ₹{homestay.price * formData.rooms * Math.ceil((formData.checkOut - formData.checkIn) / (1000 * 60 * 60 * 24))}
                        </span>
                      </div>
                      
                      {foodOption !== 'none' && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            {foodOption === 'breakfast' ? 'Breakfast' : 'All meals'} ({formData.adults} adults)
                          </span>
                          <span className="font-medium">
                            ₹{foodOption === 'breakfast' ? 
                              200 * formData.adults * Math.ceil((formData.checkOut - formData.checkIn) / (1000 * 60 * 60 * 24)) : 
                              500 * formData.adults * Math.ceil((formData.checkOut - formData.checkIn) / (1000 * 60 * 60 * 24))}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxes & Fees (5% GST)</span>
                        <span className="font-medium">₹{(totalPrice * 0.05).toFixed(2)}</span>
                      </div>
                      
                      <div className="border-t border-blue-200 pt-3 mt-2 flex justify-between">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-blue-600 text-lg">₹{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Terms and Submit */}
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the terms and conditions and privacy policy
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-6 rounded-lg font-bold text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center ${isSubmitting ? 'opacity-75' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingForm;
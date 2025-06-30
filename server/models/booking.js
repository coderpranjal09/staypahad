const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  homestayId: { type: String, required: true }, 
  homestayName: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
   email: { type: String , require:true},
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  adults: { type: Number, required: true },
  children: { type: Number, default: 0 },
  rooms: { type: Number, required: true },
  foodOption: { type: String, enum: ['none', 'breakfast', 'all'], default: 'none' },
  totalPrice: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);

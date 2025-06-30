const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const { verifyToken, isSuperAdmin } = require('../middleware/verifyToken');
// Create a new booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).send(booking);
  } catch (error) {
    res.status(400).send(error);
  }
});


router.get('/',verifyToken,isSuperAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    res.status(500).send(error);
  }
});
// ✅ Get bookings by homestayId using query param
router.get('/property', async (req, res) => {
  try {
    const { homestayId } = req.query;

    if (!homestayId) {
      return res.status(400).json({ message: 'homestayId query parameter is required' });
    }

    const bookings = await Booking.find({ homestayId });

    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for this homestay' });
    }

    res.send(bookings);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;

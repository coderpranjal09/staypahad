const Homestay = require('../models/homestay');
const Booking = require('../models/booking');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalIncome = await Booking.aggregate([
      { $match: {} },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const totalHomestays = await Homestay.countDocuments();
    const totalBookings = await Booking.countDocuments();

    let recentBookings = await Booking.find()
      .sort({ bookingDate: -1 })
      .limit(5)
      .lean();

    // Manually attach homestay name (already available in booking), so we skip populate
    recentBookings = recentBookings.map(booking => ({
      ...booking,
      homestay: {
        name: booking.homestayName,
        id: booking.homestayId
      }
    }));

    res.json({
      totalIncome: totalIncome.length > 0 ? totalIncome[0].total : 0,
      totalHomestays,
      totalBookings,
      recentBookings
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllHomestays = async (req, res) => {
  try {
    const { location } = req.query;
    let query = {};
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const homestays = await Homestay.find(query).sort({ createdAt: -1 });
    res.json(homestays);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getHomestayDetails = async (req, res) => {
  try {
    const homestay = await Homestay.findOne({ homestayId: req.params.id });
    if (!homestay) {
      return res.status(404).json({ message: 'Homestay not found' });
    }

    const bookings = await Booking.find({ homestayId: req.params.id })
      .sort({ checkIn: -1 });

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    res.json({
      homestay,
      bookings,
      totalBookings: bookings.length,
      totalRevenue
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.addHomestay = async (req, res) => {
  try {
    const { homestayId, name, owner, ownerMob, location, price } = req.body;

    const existing = await Homestay.findOne({ homestayId });
    if (existing) {
      return res.status(400).json({ message: 'Homestay with this ID already exists' });
    }

    const homestay = new Homestay({
      homestayId,
      name,
      owner,
      ownerMob,
      location,
      price
    });

    await homestay.save();
    res.status(201).json(homestay);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteHomestay = async (req, res) => {
  try {
    const homestay = await Homestay.findOne({ homestayId: req.params.id });
    if (!homestay) {
      return res.status(404).json({ message: 'Homestay not found' });
    }

    const bookingsExist = await Booking.exists({ homestayId: req.params.id });
    if (bookingsExist) {
      return res.status(400).json({ message: 'Cannot delete homestay with existing bookings' });
    }

    await homestay.deleteOne();
    res.json({ message: 'Homestay removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Admin already exists with this email' });
    }

    const newAdmin = await Admin.create({
      name,
      email,
      password,
      role: role || 'admin'
    });

    const token = jwt.sign({ id: newAdmin._id, role: newAdmin.role }, process.env.JWT, { expiresIn: '8h' });

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

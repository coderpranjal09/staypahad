const express = require('express');
const router = express.Router();
const Homestay = require('../models/homestay');
const { verifyToken, isSuperAdmin } = require('../middleware/verifyToken');

// @route   POST /api/homestays
// @desc    Create a new homestay
// @access  Public
router.post('/', verifyToken,isSuperAdmin,async (req, res) => {
  try {
    const { homestayId, name, owner, ownerMob, location, price } = req.body;

    // Simple validation
    if (!homestayId || !name || !owner || !ownerMob || !location || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if homestay with same ID already exists
    const existing = await Homestay.findOne({ homestayId });
    if (existing) {
      return res.status(409).json({ message: 'Homestay ID already exists' });
    }

    // Save to DB
    const newHomestay = new Homestay({
      homestayId,
      name,
      owner,
      ownerMob,
      location,
      price
    });

    const savedHomestay = await newHomestay.save();
    res.status(201).json(savedHomestay);

  } catch (error) {
    console.error('Error creating homestay:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;

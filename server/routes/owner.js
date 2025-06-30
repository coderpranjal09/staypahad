const express = require('express');
const router = express.Router();
const Owner = require('../models/homestay');

// Login API
router.post('/login', async (req, res) => {
  const { homestayid, ownerMob } = req.body;

  try {
  
    const owner = await Owner.findOne({ homestayId: homestayid, ownerMob });

    if (!owner) {
      return res.status(401).json({ message: 'Invalid ID or Mobile Number', success: false });
    }

    res.status(200).json({ message: 'Login successful', success: true, owner });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;

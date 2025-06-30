const express = require('express');
const router = express.Router();
const Homestay = require('../models/homestay');

// Get all homestays
router.get('/', async (req, res) => {
  try {
    const homestays = await Homestay.find();
    res.send(homestays);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get homestay by ID
router.get('/:id', async (req, res) => {
  try {
    const homestay = await Homestay.findById(req.params.id);
    if (!homestay) {
      return res.status(404).send();
    }
    res.send(homestay);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get homestay by custom homestayid
router.get('/by-homestayid/:homestayid', async (req, res) => {
  try {
    const homestay = await Homestay.findOne({ homestayId: req.params.homestayid });
    if (!homestay) {
      return res.status(404).send({ message: 'Homestay not found' });
    }
    res.send(homestay);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Search homestays by location
router.get('/search/location', async (req, res) => {
  const location = req.query.location;
  try {
    const homestays = await Homestay.find({ 
      location: { $regex: location, $options: 'i' } 
    });
    res.send(homestays);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
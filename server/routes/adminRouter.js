const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, isSuperAdmin } = require('../middleware/verifyToken');


// Admin dashboard stats
router.get('/dashboard/stats', verifyToken, isSuperAdmin, adminController.getDashboardStats);

// Get all homestays with search/filter
router.get('/homestays', verifyToken, isSuperAdmin, adminController.getAllHomestays);

// Get specific homestay details
router.get('/homestays/:id', verifyToken, isSuperAdmin, adminController.getHomestayDetails);

// Add new homestay
router.post('/homestays', verifyToken, isSuperAdmin, adminController.addHomestay);

// Delete homestay
router.delete('/homestays/:id', verifyToken, isSuperAdmin, adminController.deleteHomestay);

module.exports = router;
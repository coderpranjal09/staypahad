const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControler');
const { registerAdmin } = require('../controllers/adminController');
// Admin login route
router.post('/admin/login',  authController.adminLogin);
router.post(
    '/register',registerAdmin
);
module.exports = router;
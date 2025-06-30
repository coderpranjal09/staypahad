const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'Please provide both email and password' 
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ 
            success: false,
            message: 'Please provide a valid email address' 
        });
    }

    try {
        // Check if admin exists (including password which is normally select: false)
        const admin = await Admin.findOne({ email }).select('+password +isActive');
        
        if (!admin) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check if account is active
        if (!admin.isActive) {
            return res.status(403).json({ 
                success: false,
                message: 'Account deactivated. Please contact support.' 
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Create JWT token
        const payload = {
            id: admin.id,
            role: admin.role
        };

        const token = jwt.sign(
            payload, 
            process.env.JWT_SECRET || process.env.JWT, 
            { expiresIn: process.env.JWT_EXPIRE || '8h' }
        );

        // Set token in secure HTTP-only cookie
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 8 * 60 * 60 * 1000, // 8 hours
            path: '/'
        };

        res.cookie('adminToken', token, cookieOptions);

        // Respond with admin info (excluding sensitive data)
        res.status(200).json({
            success: true,
            token, // Also send token in response for clients that need it
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                isActive: admin.isActive
            }
        });

    } catch (err) {
        console.error('Login error:', err.message);
        
        // Specific error messages for different scenarios
        let message = 'Login failed';
        if (err.name === 'ValidationError') {
            message = 'Validation error';
        } else if (err.name === 'MongoError') {
            message = 'Database error';
        }

        res.status(500).json({ 
            success: false,
            message: message,
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

// Admin logout controller
exports.adminLogout = (req, res) => {
    res.clearCookie('adminToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        path: '/'
    });
    
    res.status(200).json({
        success: true,
        message: 'Successfully logged out'
    });
};
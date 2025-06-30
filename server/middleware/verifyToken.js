const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const verifyToken = async (req, res, next) => {
    // Check multiple possible token locations
    const token = req.cookies?.adminToken || 
                 req.headers?.authorization?.replace('Bearer ', '') || 
                 req.headers?.Authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Authorization denied. No token provided.' 
        });
    }

    try {
        // Verify token with environment variable
        const decoded = jwt.verify(token, process.env.JWT);
        
        // Find admin and exclude sensitive fields
        const admin = await Admin.findById(decoded.id)
            .select('-password -__v -resetPasswordToken -resetPasswordExpire');

        if (!admin) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token. Admin not found.' 
            });
        }

        // Check if admin account is active
        if (admin.isActive === false) {
            return res.status(403).json({
                success: false,
                message: 'Account deactivated. Please contact support.'
            });
        }

        // Attach admin and token to request
        req.admin = admin;
        req.token = token;
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        
        // Specific error messages for different JWT errors
        let message = 'Invalid token';
        if (err.name === 'TokenExpiredError') {
            message = 'Token expired. Please login again.';
        } else if (err.name === 'JsonWebTokenError') {
            message = 'Malformed token';
        }

        return res.status(401).json({ 
            success: false,
            message 
        });
    }
};

const isSuperAdmin = (req, res, next) => {
    
    if (req.admin && req.admin.role === 'admin') {
        return next();
    }
    return res.status(403).json({ 
        success: false,
        message: 'Access denied. Super admin privileges required.' 
    });
};

module.exports = { 
    verifyToken, 
    isSuperAdmin 
};
const express = require('express');
const Admin = require('../models/Admin');
const { auth, isAdmin, isSuperAdmin } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/admin/register
// @desc    Register a new admin (superadmin only)
// @access  Private/Superadmin
router.post('/register', auth, isSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role = 'admin' } = req.body;
    
    // Check if admin already exists
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Create new admin
    admin = new Admin({
      name,
      email,
      password,
      role
    });

    await admin.save();
    
    // Generate token
    const token = admin.generateAuthToken();
    
    res.status(201).json({ 
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      token 
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/admin/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = Date.now();
    await admin.save();

    // Generate token
    const token = admin.generateAuthToken();

    res.json({ 
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/me
// @desc    Get current admin profile
// @access  Private/Admin
router.get('/me', auth, isAdmin, async (req, res) => {
  try {
    // Admin is already available in req from auth middleware
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/admin/admins
// @desc    Get all admins (superadmin only)
// @access  Private/Superadmin
router.get('/admins', auth, isSuperAdmin, async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (error) {
    console.error('Get all admins error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

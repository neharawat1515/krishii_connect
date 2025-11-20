const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, phone, password, userType, location, businessType, language } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ phone });

    if (userExists) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Create user
    const user = await User.create({
      name,
      phone,
      password,
      userType,
      location,
      businessType,
      language
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        userType: user.userType,
        location: user.location,
        businessType: user.businessType,
        language: user.language,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { phone, password, userType } = req.body;

    // Check for user
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // Check user type
    if (user.userType !== userType) {
      return res.status(403).json({ 
        message: `Account registered as ${user.userType}, trying to login as ${userType}` 
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      userType: user.userType,
      location: user.location,
      businessType: user.businessType,
      language: user.language,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

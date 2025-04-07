// ===== routes/auth.js =====
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({
      username,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    
    // Create session
    req.session.userId = user._id;
    return res.status(201).json({ msg: 'User registered successfully', userId: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user._id;
    
    return res.json({ 
      msg: 'Login successful',
      userId: user._id,
      coreSubjects: user.coreSubjects,
      electives: user.electives,
      registrationComplete: user.registrationComplete
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Check auth status
router.get('/check', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ isAuthenticated: false });
  }
  
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({ isAuthenticated: false });
    }
    
    return res.json({ 
      isAuthenticated: true,
      userId: user._id,
      coreSubjects: user.coreSubjects,
      electives: user.electives,
      registrationComplete: user.registrationComplete
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ msg: 'Error logging out' });
    }
    res.clearCookie('connect.sid');
    return res.json({ msg: 'Logged out successfully' });
  });
});

module.exports = router;

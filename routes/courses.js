// ===== routes/courses.js =====
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
const authMiddleware = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: 'Not authorized' });
  }
  next();
};

// Update core subjects
router.post('/core', authMiddleware, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { computerNetwork, cloudComputing, nlp, cnLab, minorProject, palr } = req.body;
    
    // Check if all core subjects are selected
    const allCoresSelected = 
      computerNetwork && 
      cloudComputing && 
      nlp && 
      cnLab && 
      minorProject && 
      palr;
    
    if (!allCoresSelected) {
      return res.status(400).json({ msg: 'All core subjects must be selected' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        'coreSubjects.computerNetwork': computerNetwork,
        'coreSubjects.cloudComputing': cloudComputing,
        'coreSubjects.nlp': nlp,
        'coreSubjects.cnLab': cnLab,
        'coreSubjects.minorProject': minorProject,
        'coreSubjects.palr': palr
      },
      { new: true }
    );
    
    res.json({ msg: 'Core subjects updated', coreSubjects: user.coreSubjects });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update electives
router.post('/electives', authMiddleware, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { 
      embeddedSystem, 
      blockchainLedgers, 
      computationalMedicine, 
      edgeComputing, 
      securityOperations 
    } = req.body;
    
    // Count selected electives
    const electiveCount = 
      (embeddedSystem ? 1 : 0) + 
      (blockchainLedgers ? 1 : 0) + 
      (computationalMedicine ? 1 : 0) + 
      (edgeComputing ? 1 : 0) + 
      (securityOperations ? 1 : 0);
    
    if (electiveCount !== 2) {
      return res.status(400).json({ msg: 'Exactly 2 electives must be selected' });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        'electives.embeddedSystem': embeddedSystem,
        'electives.blockchainLedgers': blockchainLedgers,
        'electives.computationalMedicine': computationalMedicine,
        'electives.edgeComputing': edgeComputing,
        'electives.securityOperations': securityOperations,
        'electiveCount': electiveCount
      },
      { new: true }
    );
    
    res.json({ msg: 'Electives updated', electives: user.electives });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Complete registration
router.post('/complete', authMiddleware, async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    
    // Check if all core subjects are selected
    const coreSubjects = user.coreSubjects;
    const allCoresSelected = 
      coreSubjects.computerNetwork && 
      coreSubjects.cloudComputing && 
      coreSubjects.nlp && 
      coreSubjects.cnLab && 
      coreSubjects.minorProject && 
      coreSubjects.palr;
    
    if (!allCoresSelected) {
      return res.status(400).json({ msg: 'All core subjects must be selected' });
    }
    
    // Check if exactly 2 electives are selected
    if (user.electiveCount !== 2) {
      return res.status(400).json({ msg: 'Exactly 2 electives must be selected' });
    }
    
    // Update registration status
    await User.findByIdAndUpdate(
      userId,
      { registrationComplete: true },
      { new: true }
    );
    
    res.json({ msg: 'Registration completed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get current course selections
router.get('/selections', authMiddleware, async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json({
      coreSubjects: user.coreSubjects,
      electives: user.electives,
      registrationComplete: user.registrationComplete
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

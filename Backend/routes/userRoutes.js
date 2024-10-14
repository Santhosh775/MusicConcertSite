const express = require('express');
const User = require('../models/userModel');
const router = express.Router();
const bcrypt = require('bcrypt');


// Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    // Check if the passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user and save it to the database
    user = new User({
      username,
      email,
      password,
    });

    await user.save();
    res.status(201).json({ message: 'Signup successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all users Route
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users); // Return users as JSON
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.deleteOne({ _id: req.params.id }); // Delete the user
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Password reset route
router.post('/reset-password', async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  // Validate new password and confirm password
  if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update the user's password in the database
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

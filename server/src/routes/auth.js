import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    // Set all session-related fields explicitly
    const user = await User.create({
      name,
      email,
      password: hash,
      avatar: '',
      phone: null,
      subscription: { active: false, plan: null, activatedAt: null, checkoutId: null, phone: null },
      usage: 0,
      usageResetAt: new Date(),
      createdAt: new Date()
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, phone: user.phone, subscription: user.subscription } });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Return all session-related fields
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, phone: user.phone, subscription: user.subscription } });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

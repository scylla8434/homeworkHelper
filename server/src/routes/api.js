import express from 'express';
import Question from '../models/Question.js';
import User from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

const router = express.Router();

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer for image uploads
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Helper: Get M-Pesa access token
async function getMpesaToken() {
  const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = process.env;
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const res = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: { Authorization: `Basic ${auth}` }
  });
  return res.data.access_token;
}

// Helper: Format timestamp and password
function getTimestamp() {
  const date = new Date();
  return date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, '0') +
    String(date.getDate()).padStart(2, '0') +
    String(date.getHours()).padStart(2, '0') +
    String(date.getMinutes()).padStart(2, '0') +
    String(date.getSeconds()).padStart(2, '0');
}

// Image upload endpoint
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' });
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ message: 'Image upload error', error: err.message });
  }
});

// Cohere AI Chat endpoint (calls deployed Python Flask service)
const PYTHON_AI_URL = process.env.PYTHON_AI_URL || 'http://localhost:5001';

router.post('/chat', async (req, res) => {
  try {
    const { question, userId } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required' });

    // Call deployed Python service
    const pyRes = await axios.post(`${PYTHON_AI_URL}/chat`, { question });
    const answer = pyRes.data.answer;

    let questionData = { question, answer };
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      questionData.user = userId;
    }
    const q = await Question.create(questionData);
    res.json({ answer, question: q });
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

// M-Pesa STK Push subscription endpoint
router.post('/subscribe', async (req, res) => {
  try {
    const { userId, phone, plan } = req.body;
    const amount = plan === 'yearly' ? 4999 : 499; // Ksh
    const token = await getMpesaToken();
    const timestamp = getTimestamp();
    const password = Buffer.from(
      process.env.MPESA_SHORTCODE + process.env.MPESA_PASSKEY + timestamp
    ).toString('base64');

    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: userId, // Use userId for easy matching
      TransactionDesc: `Subscription (${plan})`
    };

    const stkRes = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Save pending subscription in DB for this user
    await User.findByIdAndUpdate(userId, {
      $set: {
        'subscription.active': false,
        'subscription.plan': plan,
        'subscription.checkoutId': stkRes.data.CheckoutRequestID,
        'subscription.phone': phone
      }
    });

    res.json({ success: true, message: 'STK Push sent. Complete payment on your phone.', CheckoutRequestID: stkRes.data.CheckoutRequestID });
  } catch (err) {
    console.error('[M-Pesa /subscribe] Error:', err);
    res.status(500).json({ success: false, message: 'M-Pesa error', error: err.message });
  }
});

// M-Pesa callback endpoint (update user subscription on payment success)
router.post('/mpesa/callback', async (req, res) => {
  try {
    const body = req.body;
    const result = body.Body?.stkCallback;
    if (result && result.ResultCode === 0) {
      const checkoutId = result.CheckoutRequestID;
      // Find user by checkoutId and activate subscription
      await User.findOneAndUpdate(
        { 'subscription.checkoutId': checkoutId },
        { $set: { 'subscription.active': true, 'subscription.activatedAt': new Date() } }
      );
    }
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    res.status(500).json({ ResultCode: 1, ResultDesc: 'Error processing callback' });
  }
});

// Get subscription status for a user
router.get('/subscription/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ active: false, message: 'User not found' });
    res.json({ active: !!(user.subscription && user.subscription.active), plan: user.subscription?.plan || null, activatedAt: user.subscription?.activatedAt || null });
  } catch (err) {
    res.status(500).json({ active: false, message: 'Error fetching subscription' });
  }
});

// --- USER PROFILE ROUTES ---
// Get user profile
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email phone');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile (name, phone)
router.put('/user/:id', async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { name, phone } },
      { new: true, runValidators: true, context: 'query' }
    ).select('name email phone');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

// Change password
router.put('/user/:id/password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating password', error: err.message });
  }
});

export default router;

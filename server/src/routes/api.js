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

// Enhanced logging middleware for debugging
router.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  // Add CORS headers explicitly for debugging
  res.header('Access-Control-Allow-Origin', req.get('origin'));
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  next();
});

// Set up multer for image uploads
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Helper: Get M-Pesa access token
const MPESA_BASE_URL = process.env.MPESA_ENV === 'live'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

async function getMpesaToken() {
  const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = process.env;
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
  const res = await axios.get(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
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

// Helper: Check and reset usage monthly
async function checkAndResetUsage(user) {
  if (!user.usageResetAt) return user; // fallback
  const now = new Date();
  const lastReset = new Date(user.usageResetAt);
  if (now.getFullYear() !== lastReset.getFullYear() || now.getMonth() !== lastReset.getMonth()) {
    user.usage = 0;
    user.usageResetAt = now;
    await user.save();
  }
  return user;
}

// DEBUG: Test endpoint to verify API is working
router.get('/test', (req, res) => {
  console.log('🧪 [TEST ENDPOINT] Called successfully');
  res.json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    pythonAiUrl: process.env.PYTHON_AI_URL || 'not_set'
  });
});

// DEBUG: Database connection test
router.get('/db-test', async (req, res) => {
  try {
    console.log('🧪 [DB TEST] Testing database connection...');
    const userCount = await User.countDocuments();
    const questionCount = await Question.countDocuments();
    console.log(`✅ [DB TEST] Found ${userCount} users, ${questionCount} questions`);
    
    res.json({
      success: true,
      mongodb: {
        connected: mongoose.connection.readyState === 1,
        userCount,
        questionCount,
        dbName: mongoose.connection.name
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ [DB TEST] Database error:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      mongodb: {
        connected: false
      }
    });
  }
});

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
const FREE_USER_LIMIT = 10; // e.g., 10 free chats per month

router.post('/chat', async (req, res) => {
  try {
    const { question, userId } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required' });

    let user = null;
    let canChat = true;
    let userType = 'guest';

    // Check if userId is provided and valid
    if (userId && userId !== 'demo' && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        user = await User.findById(userId);
        if (user) {
          userType = 'registered';
          user = await checkAndResetUsage(user); // Reset usage if new month
          const isSubscribed = user.subscription && user.subscription.active;
          
          // Only check limits for registered users
          if (!isSubscribed && user.usage >= FREE_USER_LIMIT) {
            canChat = false;
            return res.status(403).json({ 
              message: 'Free usage limit reached. Please subscribe to continue.',
              usage: user.usage,
              limit: FREE_USER_LIMIT
            });
          }
        }
      } catch (userError) {
        console.log('User lookup failed, continuing as guest:', userError.message);
        // Continue as guest if user lookup fails
      }
    }

    if (!canChat) {
      return res.status(403).json({ message: 'Usage limit reached' });
    }

    // Call deployed Python service
    try {
      const pyRes = await axios.post(`${PYTHON_AI_URL}/chat`, { question }, {
        timeout: 30000 // 30 second timeout
      });
      const answer = pyRes.data.answer;

      // Save question and answer
      let questionData = { 
        question, 
        answer,
        userType, // Track if it was a guest or registered user
        createdAt: new Date()
      };

      // Only add user reference if we have a valid user
      if (user) {
        questionData.user = userId;
        // Increment usage for registered users only
        try {
          await User.findByIdAndUpdate(userId, { $inc: { usage: 1 } });
        } catch (updateError) {
          console.log('Failed to update user usage, but continuing:', updateError.message);
        }
      }

      const q = await Question.create(questionData);
      res.json({ 
        answer, 
        question: q,
        userType,
        usage: user ? user.usage + 1 : null // Return updated usage for registered users
      });

    } catch (pythonError) {
      console.error('Python AI service error:', pythonError.message);
      throw new Error('AI service temporarily unavailable. Please try again.');
    }

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ 
      message: err.message || 'AI error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
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
      AccountReference: String(userId), // Always a string, never null
      TransactionDesc: `Subscription (${plan})`
    };

    const stkRes = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
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
    console.log(`🔍 [USER PROFILE] Fetching profile for user: ${req.params.id}`);
    const user = await User.findById(req.params.id).select('name email phone');
    if (!user) {
      console.log(`❌ [USER PROFILE] User not found: ${req.params.id}`);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(`✅ [USER PROFILE] Found user: ${user.name} (${user.email})`);
    res.json(user);
  } catch (err) {
    console.error(`❌ [USER PROFILE] Error:`, err);
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

// Avatar upload endpoint
router.post('/user/:id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // Save avatar path (relative URL)
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ avatarUrl: user.avatar });
  } catch (err) {
    res.status(500).json({ message: 'Avatar upload error', error: err.message });
  }
});

// Get usage data for a user (modified to handle guest users)
router.get('/user/:id/usage', async (req, res) => {
  const startTime = Date.now();
  const userId = req.params.id;
  
  try {
    console.log(`🔍 [USAGE REQUEST] Starting usage fetch for user: ${userId}`);
    
    // Handle guest/demo users
    if (!userId || userId === 'demo' || userId === 'guest') {
      return res.json({ 
        usage: 0, 
        isSubscribed: false,
        userType: 'guest',
        message: 'Guest user - unlimited usage',
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      });
    }
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log(`❌ [USAGE REQUEST] Invalid ObjectId format: ${userId}`);
      return res.json({ 
        usage: 0, 
        isSubscribed: false,
        userType: 'guest',
        message: 'Invalid user ID, treating as guest',
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      });
    }
    
    // Find user with detailed logging
    console.log(`🔍 [USAGE REQUEST] Querying database for user...`);
    const user = await User.findById(userId).select('usage subscription usageResetAt name email');
    
    if (!user) {
      console.log(`❌ [USAGE REQUEST] User not found in database: ${userId}`);
      // Return guest usage instead of error
      return res.json({ 
        usage: 0, 
        isSubscribed: false,
        userType: 'guest',
        message: 'User not found, treating as guest',
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      });
    }
    
    console.log(`✅ [USAGE REQUEST] Found user: ${user.name} (${user.email})`);
    
    // Check and reset usage if needed
    const updatedUser = await checkAndResetUsage(user);
    const isSubscribed = !!(updatedUser.subscription && updatedUser.subscription.active);
    
    const responseData = { 
      usage: updatedUser.usage || 0, 
      isSubscribed: isSubscribed,
      subscription: updatedUser.subscription,
      usageResetAt: updatedUser.usageResetAt,
      userName: updatedUser.name,
      userType: 'registered',
      timestamp: new Date().toISOString(),
      processingTime: Date.now() - startTime
    };
    
    console.log(`✅ [USAGE REQUEST] Sending response:`, responseData);
    res.json(responseData);
    
  } catch (err) {
    const processingTime = Date.now() - startTime;
    console.error(`❌ [USAGE REQUEST] Error after ${processingTime}ms:`, err);
    
    // Return guest usage on error instead of failing
    res.json({ 
      usage: 0, 
      isSubscribed: false,
      userType: 'guest',
      message: 'Error fetching user data, treating as guest',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Database error',
      processingTime: processingTime,
      timestamp: new Date().toISOString()
    });
  }
});

// DEBUG: List all users (for debugging only - remove in production)
router.get('/debug/users', async (req, res) => {
  try {
    console.log('🧪 [DEBUG] Fetching all users...');
    const users = await User.find({}).select('_id name email usage subscription').limit(10);
    console.log(`🧪 [DEBUG] Found ${users.length} users`);
    
    res.json({
      success: true,
      userCount: users.length,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        usage: user.usage || 0,
        isSubscribed: !!(user.subscription && user.subscription.active)
      })),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('❌ [DEBUG] Error fetching users:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// DEBUG: Check specific user by email (for debugging)
router.get('/debug/user-by-email/:email', async (req, res) => {
  try {
    const email = req.params.email;
    console.log(`🧪 [DEBUG] Looking for user with email: ${email}`);
    
    const user = await User.findOne({ email }).select('_id name email usage subscription');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found by email',
        email: email
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        usage: user.usage || 0,
        isSubscribed: !!(user.subscription && user.subscription.active),
        subscription: user.subscription
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

export default router;
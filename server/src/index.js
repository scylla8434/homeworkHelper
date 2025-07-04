import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

const app = express();

// Enhanced CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://eduedge.netlify.app', // Production client URL
    process.env.CLIENT_URL
  ].filter(Boolean), // Remove any undefined values
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.path.includes('/api/user/') && req.path.includes('/usage')) {
    console.log(`🔍 Usage request from origin: ${req.get('origin')}`);
    console.log(`🔍 User ID: ${req.params.id}`);
  }
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoints
app.get('/', (req, res) => {
  res.json({
    message: 'Homework Helper API running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    corsOrigins: corsOptions.origin
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'homework-helper-backend',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Debug endpoint to test environment variables
app.get('/debug', (req, res) => {
  res.json({
    CLIENT_URL: process.env.CLIENT_URL,
    NODE_ENV: process.env.NODE_ENV,
    MONGO_CONNECTED: mongoose.connection.readyState === 1,
    PYTHON_AI_URL: process.env.PYTHON_AI_URL,
    CORS_ORIGINS: corsOptions.origin,
    timestamp: new Date().toISOString()
  });
});

// Import routes
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';
import ocrRoutes from './routes/ocr.js';

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/ocr', ocrRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /debug',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/chat',
      'GET /api/user/:id/usage'
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for origins:`, corsOptions.origin);
  console.log(`📊 MongoDB status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎯 Client URL: ${process.env.CLIENT_URL}`);
});
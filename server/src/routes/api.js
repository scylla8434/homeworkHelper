import express from 'express';
import Question from '../models/Question.js';
import User from '../models/User.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import mongoose from 'mongoose';

const router = express.Router();

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scriptPath = path.join(__dirname, 'gemini_chat.py');

// Set up multer for image uploads
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

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

// Cohere AI Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { question, userId } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required' });

    // Call Python script for Cohere using absolute path
    const py = spawn('python', [scriptPath, question, process.env.COHERE_API_KEY]);
    let answer = '';
    py.stdout.on('data', (data) => {
      console.log('PYTHON STDOUT:', data.toString());
      answer += data.toString();
    });
    py.stderr.on('data', (data) => {
      console.error('PYTHON STDERR:', data.toString());
    });
    py.on('close', async (code) => {
      console.log('PYTHON PROCESS CLOSED WITH CODE:', code);
      answer = answer.trim();
      // Only set user if userId is a valid ObjectId
      let questionData = { question, answer };
      if (mongoose.Types.ObjectId.isValid(userId)) {
        questionData.user = userId;
      }
      const q = await Question.create(questionData);
      res.json({ answer, question: q });
    });
  } catch (err) {
    res.status(500).json({ message: 'AI error', error: err.message });
  }
});

export default router;

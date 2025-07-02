// OCR endpoint using Tesseract.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createWorker } from 'tesseract.js';

const router = express.Router(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ message: 'No image URL provided' });
    const imagePath = path.join(__dirname, '../../uploads', path.basename(imageUrl));
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(imagePath);
    await worker.terminate();
    res.json({ text });
  } catch (err) {
    res.status(500).json({ message: 'OCR error', error: err.message });
  }
});

export default router;

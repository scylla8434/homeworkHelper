import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  question: String,
  imageUrl: String,
  answer: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Question', questionSchema);

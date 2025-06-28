import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  subscription: { type: String, enum: ['none', 'monthly'], default: 'none' },
  questionsUsed: { type: Number, default: 0 }
});

export default mongoose.model('User', userSchema);

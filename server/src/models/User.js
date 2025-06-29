import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: null }, // <-- add top-level phone
  subscription: {
    active: { type: Boolean, default: false },
    plan: { type: String, enum: ['monthly', 'yearly', null], default: null },
    activatedAt: { type: Date, default: null },
    checkoutId: { type: String, default: null },
    phone: { type: String, default: null }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);

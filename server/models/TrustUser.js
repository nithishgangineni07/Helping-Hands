import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const trustUserSchema = new mongoose.Schema(
  {
    trustId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trust',
      required: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      default: null
    },
    googleId: {
      type: String,
      default: null
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
    role: {
      type: String,
      enum: ['trust'],
      default: 'trust'
    }
  },
  {
    timestamps: true
  }
);

trustUserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.passwordHash) return false;
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

const TrustUser = mongoose.model('TrustUser', trustUserSchema);
export default TrustUser;

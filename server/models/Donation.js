import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    trust: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trust',
      required: true
    },
    donorName: {
      type: String,
      required: [true, 'Donor name is required'],
      trim: true
    },
    donorEmail: {
      type: String,
      required: [true, 'Donor email is required'],
      trim: true
    },
    donorPhone: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Minimum donation amount is ₹1']
    },
    anonymous: {
      type: Boolean,
      default: false
    },
    paymentStatus: {
      type: String,
      enum: ['Success', 'Pending', 'Failed'],
      default: 'Success'
    },
    transactionId: {
      type: String,
      default: function () {
        return 'TXN_' + Math.random().toString(36).substring(2, 11).toUpperCase();
      }
    }
  },
  {
    timestamps: true
  }
);

// High performance indexes
donationSchema.index({ campaign: 1 });
donationSchema.index({ trust: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ paymentStatus: 1 });
donationSchema.index({ donorEmail: 1 });
donationSchema.index({ amount: -1 });

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;

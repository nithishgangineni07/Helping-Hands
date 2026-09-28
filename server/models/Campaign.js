import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    trust: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trust',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Education',
        'Healthcare',
        'Food & Nutrition',
        'Children',
        'Elderly Care',
        'Women Empowerment',
        'Disaster Relief',
        'Animal Welfare',
        'Community Development',
        'General'
      ]
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    detailedNeed: {
      type: String,
      default: ''
    },
    expectedFundsUse: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      required: [true, 'Campaign image URL is required']
    },
    galleryImages: [String],
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [1, 'Target amount must be greater than 0']
    },
    raisedAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    donorCount: {
      type: Number,
      default: 0,
      min: 0
    },
    shareCount: {
      type: Number,
      default: 0,
      min: 0
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required']
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'pending_review', 'rejected', 'suspended', 'draft'],
      default: 'pending_review'
    },
    impactStatus: {
      type: String,
      enum: ['not_required', 'required', 'submitted', 'pending_review', 'approved', 'rejected'],
      default: 'not_required'
    },
    whyNeeded: {
      type: String,
      default: ''
    },
    howDonationHelps: [
      {
        amount: Number,
        impact: String
      }
    ],
    // Compliance & Additional legal verification details
    gstNumber: {
      type: String,
      default: ''
    },
    panNumber: {
      type: String,
      default: ''
    },
    eightyGDetails: {
      type: String,
      default: ''
    },
    twelveADetails: {
      type: String,
      default: ''
    },
    fcraStatus: {
      type: String,
      default: 'Not Applicable'
    },
    bankDetails: {
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      bankName: { type: String, default: '' }
    },
    documents: [
      {
        name: String,
        url: String,
        docType: String
      }
    ],
    completedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Performance Indexes
campaignSchema.index({ trust: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ category: 1 });
campaignSchema.index({ createdAt: -1 });
campaignSchema.index({ deadline: 1 });
campaignSchema.index({ impactStatus: 1 });

// Dynamic calculation virtual field for percentage (capped at 100%)
campaignSchema.virtual('fundingPercentage').get(function () {
  if (!this.targetAmount || this.targetAmount === 0) return 0;
  const pct = (this.raisedAmount / this.targetAmount) * 100;
  return Math.min(Math.round(pct), 100);
});

campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

const Campaign = mongoose.model('Campaign', campaignSchema);
export default Campaign;

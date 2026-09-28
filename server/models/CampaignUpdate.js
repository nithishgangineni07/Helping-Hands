import mongoose from 'mongoose';

const campaignUpdateSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: true
    },
    trust: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trust'
    },
    title: {
      type: String,
      required: [true, 'Update title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Update details are required']
    },
    image: {
      type: String,
      default: ''
    },
    photos: [
      {
        type: String
      }
    ],
    documents: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        docType: { type: String, default: 'pdf' }
      }
    ],
    invoices: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
        docType: { type: String, default: 'pdf' }
      }
    ],
    whatWasAchieved: {
      type: String,
      default: ''
    },
    howFundsWereUsed: {
      type: String,
      default: ''
    },
    beneficiariesReached: {
      type: Number,
      default: 0
    },
    completionDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending_review', 'approved', 'rejected'],
      default: 'pending_review'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const CampaignUpdate = mongoose.model('CampaignUpdate', campaignUpdateSchema);
export default CampaignUpdate;

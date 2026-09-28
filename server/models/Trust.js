import mongoose from 'mongoose';

const trustSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Trust name is required'],
      trim: true
    },
    organizerName: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: 'Dedicated to impactful community service and social welfare.'
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80'
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    contact: {
      email: { type: String, required: [true, 'Email is required'], trim: true },
      phone: { type: String, required: [true, 'Phone number is required'], trim: true },
      website: { type: String, default: '' }
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected', 'Suspended'],
      default: 'Pending'
    },
    verifiedAt: {
      type: Date,
      default: null
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null
    },
    verificationNotes: {
      type: String,
      default: ''
    },
    // Compliance: GST Information
    gstStatus: {
      type: String,
      enum: ['registered', 'not_applicable', 'pending_verification'],
      default: 'not_applicable'
    },
    gstNumber: {
      type: String,
      default: ''
    },
    // Compliance: Tax Exemption Information (80G, 12A, etc.)
    taxExemptionStatus: {
      type: String,
      enum: ['applicable', 'not_applicable', 'pending_verification'],
      default: 'not_applicable'
    },
    taxExemptionType: {
      type: String,
      default: ''
    },
    taxExemptionNumber: {
      type: String,
      default: ''
    },
    taxExemptionDocuments: [
      {
        name: { type: String },
        url: { type: String },
        docType: { type: String, default: 'pdf' },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    // Compliance: FCRA Information
    fcraStatus: {
      type: String,
      enum: [
        'not_applicable',
        'eligible',
        'registered',
        'prior_permission',
        'not_eligible',
        'pending_verification'
      ],
      default: 'not_applicable'
    },
    fcraRegistrationNumber: {
      type: String,
      default: ''
    },
    fcraDocuments: [
      {
        name: { type: String },
        url: { type: String },
        docType: { type: String, default: 'pdf' },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    internationalDonationsEnabled: {
      type: Boolean,
      default: false
    },
    // Administrative & Registration Supporting Documents
    verificationDocuments: [
      {
        name: { type: String },
        url: { type: String },
        docType: { type: String, default: 'pdf' },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    yearsOfService: {
      type: Number,
      default: 3
    },
    peopleHelpedCount: {
      type: Number,
      default: 500
    }
  },
  {
    timestamps: true
  }
);

// Virtual for trustName alias
trustSchema.virtual('trustName').get(function () {
  return this.name;
});

trustSchema.set('toJSON', { virtuals: true });
trustSchema.set('toObject', { virtuals: true });

const Trust = mongoose.model('Trust', trustSchema);
export default Trust;

import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'TRUST_REGISTERED',
        'TRUST_VERIFIED',
        'TRUST_REJECTED',
        'TRUST_SUSPENDED',
        'TRUST_PROFILE_UPDATED',
        'COMPLIANCE_UPDATED',
        'CAMPAIGN_CREATED',
        'CAMPAIGN_SUBMITTED',
        'CAMPAIGN_APPROVED',
        'CAMPAIGN_REJECTED',
        'CAMPAIGN_SUSPENDED',
        'CAMPAIGN_COMPLETED',
        'DONATION_RECEIVED',
        'DONATION_REFUNDED',
        'IMPACT_UPDATE_SUBMITTED',
        'IMPACT_UPDATE_APPROVED',
        'IMPACT_UPDATE_REJECTED'
      ]
    },
    entityType: {
      type: String,
      required: true,
      enum: ['Trust', 'Campaign', 'Donation', 'CampaignUpdate', 'Admin', 'User']
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    actorType: {
      type: String,
      required: true,
      enum: ['Admin', 'Trust', 'Donor', 'System']
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
    actorName: {
      type: String,
      default: 'System'
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Indexes for high performance querying & sorting
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ actorType: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;

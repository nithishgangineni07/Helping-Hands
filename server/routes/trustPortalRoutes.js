import express from 'express';
import {
  getComplianceStatus,
  getTrustProfile,
  updateTrustProfile,
  getTrustDashboard,
  getTrustCampaigns,
  createTrustCampaign,
  uploadImpactUpdate,
  getTrustDonations
} from '../controllers/trustPortalController.js';
import { authenticateUser, requireTrust } from '../middleware/authMiddleware.js';
import { uploadLogo, uploadCampaignImage, uploadImpactMedia } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// All trust portal routes require authentication and trust role
router.use(authenticateUser, requireTrust);

// Compliance check
router.get('/compliance-status', getComplianceStatus);

// Profile & Compliance settings
router.route('/profile')
  .get(getTrustProfile)
  .put(uploadLogo.single('logoFile'), updateTrustProfile);

// Dashboard
router.get('/dashboard', getTrustDashboard);

// Causes / Campaigns
router.route('/campaigns')
  .get(getTrustCampaigns)
  .post(uploadCampaignImage.single('imageFile'), createTrustCampaign);

// Impact Reports for completed causes
router.post('/campaigns/:id/impact', uploadImpactMedia.array('mediaFiles', 6), uploadImpactUpdate);

// Donations ledger scoped to authenticated trust
router.get('/donations', getTrustDonations);

export default router;

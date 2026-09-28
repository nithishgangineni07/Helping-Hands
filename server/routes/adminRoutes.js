import express from 'express';
import { authenticateUser, requireAdmin } from '../middleware/authMiddleware.js';
import {
  getAdminStats,
  getAdminTrusts,
  getAdminTrustById,
  verifyTrust,
  rejectTrust,
  suspendTrust,
  getAdminCampaigns,
  approveCampaign,
  rejectCampaign,
  suspendCampaign,
  getAdminDonations,
  getAdminAuditLogs,
  getAdminReports,
  getAdminImpactUpdates,
  approveImpactUpdate,
  rejectImpactUpdate
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require admin authentication
router.use(authenticateUser, requireAdmin);

// Overview / Stats
router.get('/stats', getAdminStats);

// Trust moderation
router.get('/trusts', getAdminTrusts);
router.get('/trusts/:id', getAdminTrustById);
router.patch('/trusts/:id/verify', verifyTrust);
router.patch('/trusts/:id/reject', rejectTrust);
router.patch('/trusts/:id/suspend', suspendTrust);

// Campaign moderation
router.get('/campaigns', getAdminCampaigns);
router.patch('/campaigns/:id/approve', approveCampaign);
router.patch('/campaigns/:id/reject', rejectCampaign);
router.patch('/campaigns/:id/suspend', suspendCampaign);

// Donations audit & ledger
router.get('/donations', getAdminDonations);

// Audit logs (append-only)
router.get('/audit-logs', getAdminAuditLogs);

// Reports & Analytics
router.get('/reports', getAdminReports);

// Impact Update moderation
router.get('/impact-updates', getAdminImpactUpdates);
router.patch('/impact-updates/:id/approve', approveImpactUpdate);
router.patch('/impact-updates/:id/reject', rejectImpactUpdate);

export default router;

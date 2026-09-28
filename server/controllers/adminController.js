import mongoose from 'mongoose';
import Trust from '../models/Trust.js';
import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';
import CampaignUpdate from '../models/CampaignUpdate.js';
import AuditLog from '../models/AuditLog.js';
import { logAuditEvent } from '../utils/auditLogger.js';

// @desc    Get admin overview statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getAdminStats = async (req, res) => {
  try {
    // 1. Trust counts
    const totalTrusts = await Trust.countDocuments();
    const pendingTrusts = await Trust.countDocuments({ verificationStatus: 'Pending' });
    const verifiedTrusts = await Trust.countDocuments({ verificationStatus: 'Verified' });
    const rejectedTrusts = await Trust.countDocuments({ verificationStatus: 'Rejected' });
    const suspendedTrusts = await Trust.countDocuments({ verificationStatus: 'Suspended' });

    // 2. Campaign counts
    const totalCampaigns = await Campaign.countDocuments();
    const activeCampaigns = await Campaign.countDocuments({ status: 'active' });
    const completedCampaigns = await Campaign.countDocuments({ status: 'completed' });
    const pendingCampaigns = await Campaign.countDocuments({ status: 'pending_review' });
    const suspendedCampaigns = await Campaign.countDocuments({ status: 'suspended' });
    const draftCampaigns = await Campaign.countDocuments({ status: 'draft' });
    const rejectedCampaigns = await Campaign.countDocuments({ status: 'rejected' });

    // 3. Impact Updates
    const pendingImpactUpdates = await CampaignUpdate.countDocuments({ status: 'pending_review' });
    const approvedImpactUpdates = await CampaignUpdate.countDocuments({ status: 'approved' });

    // 4. Donation Metrics
    const totalDonationsCount = await Donation.countDocuments({ paymentStatus: 'Success' });

    // Sum total raised amount
    const donationSum = await Donation.aggregate([
      { $match: { paymentStatus: 'Success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalAmountRaised = donationSum.length > 0 ? donationSum[0].total : 0;

    // Distinct donors count
    const distinctDonors = await Donation.distinct('donorEmail', { paymentStatus: 'Success' });
    const totalDonors = distinctDonors.length;

    // Sum total shares across all campaigns
    const shareSum = await Campaign.aggregate([
      { $group: { _id: null, totalShares: { $sum: '$shareCount' } } }
    ]);
    const totalShares = shareSum.length > 0 ? shareSum[0].totalShares : 0;

    // Total Pending Reviews across the platform
    const pendingReviews = pendingTrusts + pendingCampaigns + pendingImpactUpdates;

    // Recent donations for live feed
    const recentDonations = await Donation.find()
      .populate('campaign', 'title')
      .populate('trust', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    // Recent campaigns
    const recentCampaigns = await Campaign.find()
      .populate('trust', 'name logo verificationStatus')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        totalTrusts,
        verifiedTrusts,
        pendingTrusts,
        rejectedTrusts,
        suspendedTrusts,
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        pendingCampaigns,
        suspendedCampaigns,
        draftCampaigns,
        rejectedCampaigns,
        pendingImpactUpdates,
        approvedImpactUpdates,
        totalDonationsCount,
        totalAmountRaised,
        totalDonors,
        totalShares,
        pendingReviews,
        recentDonations,
        recentCampaigns
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all trusts with search, filter, sort & pagination
// @route   GET /api/admin/trusts
// @access  Private (Admin)
export const getAdminTrusts = async (req, res) => {
  try {
    const {
      search = '',
      status = 'all',
      location = '',
      hasActiveCampaigns = '',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    // Verification status filter
    if (status && status !== 'all') {
      // Case insensitive match for Pending, Verified, Rejected, Suspended
      query.verificationStatus = new RegExp(`^${status}$`, 'i');
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Server-side search by name, organizer, email, registrationNumber, location
    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: 'i' } },
        { organizerName: { $regex: term, $options: 'i' } },
        { 'contact.email': { $regex: term, $options: 'i' } },
        { registrationNumber: { $regex: term, $options: 'i' } },
        { location: { $regex: term, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const total = await Trust.countDocuments(query);
    const trusts = await Trust.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Enhance trusts with campaign count & active campaign count
    const enhanced = await Promise.all(
      trusts.map(async (t) => {
        const totalCampaigns = await Campaign.countDocuments({ trust: t._id });
        const activeCampaigns = await Campaign.countDocuments({ trust: t._id, status: 'active' });
        const raisedSum = await Campaign.aggregate([
          { $match: { trust: t._id } },
          { $group: { _id: null, total: { $sum: '$raisedAmount' } } }
        ]);
        const totalRaised = raisedSum.length > 0 ? raisedSum[0].total : 0;

        return {
          ...t.toObject(),
          campaignsCount: totalCampaigns,
          activeCampaignsCount: activeCampaigns,
          totalRaised
        };
      })
    );

    // Apply hasActiveCampaigns filter in memory if specified
    let finalData = enhanced;
    if (hasActiveCampaigns === 'true') {
      finalData = enhanced.filter((t) => t.activeCampaignsCount > 0);
    } else if (hasActiveCampaigns === 'false') {
      finalData = enhanced.filter((t) => t.activeCampaignsCount === 0);
    }

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: finalData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single trust complete administrative details
// @route   GET /api/admin/trusts/:id
// @access  Private (Admin)
export const getAdminTrustById = async (req, res) => {
  try {
    const trust = await Trust.findById(req.params.id);
    if (!trust) {
      return res.status(404).json({ success: false, message: 'Trust not found.' });
    }

    // Campaigns breakdown
    const campaigns = await Campaign.find({ trust: trust._id }).sort({ createdAt: -1 });
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;
    const completedCampaigns = campaigns.filter((c) => c.status === 'completed').length;
    const suspendedCampaigns = campaigns.filter((c) => c.status === 'suspended').length;
    const pendingCampaigns = campaigns.filter((c) => c.status === 'pending_review').length;

    // Donations metrics
    const donations = await Donation.find({ trust: trust._id, paymentStatus: 'Success' });
    const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);
    const donationCount = donations.length;
    const uniqueDonors = new Set(donations.map((d) => d.donorEmail)).size;

    // Recent audit logs for this trust
    const auditLogs = await AuditLog.find({
      entityId: trust._id
    })
      .sort({ timestamp: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        trust,
        metrics: {
          totalCampaigns,
          activeCampaigns,
          completedCampaigns,
          suspendedCampaigns,
          pendingCampaigns,
          totalRaised,
          donationCount,
          uniqueDonors
        },
        campaigns,
        recentAuditLogs: auditLogs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify Trust
// @route   PATCH /api/admin/trusts/:id/verify
// @access  Private (Admin)
export const verifyTrust = async (req, res) => {
  try {
    const { notes } = req.body;
    const trust = await Trust.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: 'Verified',
        verifiedAt: new Date(),
        verifiedBy: req.user.id,
        verificationNotes: notes || 'Verified by administrator'
      },
      { new: true }
    );

    if (!trust) {
      return res.status(404).json({ success: false, message: 'Trust not found.' });
    }

    // Record audit event
    await logAuditEvent({
      action: 'TRUST_VERIFIED',
      entityType: 'Trust',
      entityId: trust._id,
      actorType: 'Admin',
      actorId: req.user.id,
      actorName: req.user.name || 'Admin',
      metadata: { trustName: trust.name, notes: notes || '' }
    });

    res.json({
      success: true,
      message: `Trust "${trust.name}" verified successfully!`,
      data: trust
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject Trust
// @route   PATCH /api/admin/trusts/:id/reject
// @access  Private (Admin)
export const rejectTrust = async (req, res) => {
  try {
    const { notes } = req.body;
    const trust = await Trust.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: 'Rejected',
        verificationNotes: notes || 'Rejected by administrator'
      },
      { new: true }
    );

    if (!trust) {
      return res.status(404).json({ success: false, message: 'Trust not found.' });
    }

    await logAuditEvent({
      action: 'TRUST_REJECTED',
      entityType: 'Trust',
      entityId: trust._id,
      actorType: 'Admin',
      actorId: req.user.id,
      actorName: req.user.name || 'Admin',
      metadata: { trustName: trust.name, notes: notes || '' }
    });

    res.json({
      success: true,
      message: `Trust "${trust.name}" marked as Rejected.`,
      data: trust
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Suspend Trust
// @route   PATCH /api/admin/trusts/:id/suspend
// @access  Private (Admin)
export const suspendTrust = async (req, res) => {
  try {
    const { notes } = req.body;
    const trust = await Trust.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: 'Suspended',
        verificationNotes: notes || 'Suspended by administrator'
      },
      { new: true }
    );

    if (!trust) {
      return res.status(404).json({ success: false, message: 'Trust not found.' });
    }

    // Also suspend all currently active campaigns
    await Campaign.updateMany({ trust: trust._id, status: 'active' }, { status: 'suspended' });

    await logAuditEvent({
      action: 'TRUST_SUSPENDED',
      entityType: 'Trust',
      entityId: trust._id,
      actorType: 'Admin',
      actorId: req.user.id,
      actorName: req.user.name || 'Admin',
      metadata: { trustName: trust.name, notes: notes || '' }
    });

    res.json({
      success: true,
      message: `Trust "${trust.name}" has been suspended. Associated active causes were automatically paused.`,
      data: trust
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all campaigns for admin moderation with search & filter
// @route   GET /api/admin/campaigns
// @access  Private (Admin)
export const getAdminCampaigns = async (req, res) => {
  try {
    const {
      search = '',
      status = 'all',
      category = 'all',
      trust = '',
      funding = 'all',
      sort = 'newest',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Trust filter
    if (trust && mongoose.Types.ObjectId.isValid(trust)) {
      query.trust = trust;
    }

    // Funding filter
    if (funding === 'fully') {
      query.$expr = { $gte: ['$raisedAmount', '$targetAmount'] };
    } else if (funding === 'partially') {
      query.$expr = {
        $and: [{ $gt: ['$raisedAmount', 0] }, { $lt: ['$raisedAmount', '$targetAmount'] }]
      };
    } else if (funding === 'not') {
      query.raisedAmount = 0;
    }

    // Search query
    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } }
      ];
    }

    // Sort order
    let sortObj = { createdAt: -1 };
    if (sort === 'shares') {
      sortObj = { shareCount: -1 };
    } else if (sort === 'oldest') {
      sortObj = { createdAt: 1 };
    } else if (sort === 'target_desc') {
      sortObj = { targetAmount: -1 };
    } else if (sort === 'target_asc') {
      sortObj = { targetAmount: 1 };
    } else if (sort === 'raised_desc') {
      sortObj = { raisedAmount: -1 };
    } else if (sort === 'raised_asc') {
      sortObj = { raisedAmount: 1 };
    } else if (sort === 'donors_desc') {
      sortObj = { donorCount: -1 };
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const total = await Campaign.countDocuments(query);
    const campaigns = await Campaign.find(query)
      .populate('trust', 'name logo verificationStatus location')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: campaigns
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve Campaign
// @route   PATCH /api/admin/campaigns/:id/approve
// @access  Private (Admin)
export const approveCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: 'active' },
      { new: true }
    ).populate('trust', 'name logo');

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    await logAuditEvent({
      action: 'CAMPAIGN_APPROVED',
      entityType: 'Campaign',
      entityId: campaign._id,
      actorType: 'Admin',
      actorId: req.user.id,
      actorName: req.user.name || 'Admin',
      metadata: { campaignTitle: campaign.title, trustName: campaign.trust?.name }
    });

    res.json({
      success: true,
      message: `Campaign "${campaign.title}" approved and published live!`,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject Campaign
// @route   PATCH /api/admin/campaigns/:id/reject
// @access  Private (Admin)
export const rejectCampaign = async (req, res) => {
  try {
    const { notes } = req.body;
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    ).populate('trust', 'name logo');

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    await logAuditEvent({
      action: 'CAMPAIGN_REJECTED',
      entityType: 'Campaign',
      entityId: campaign._id,
      actorType: 'Admin',
      actorId: req.user.id,
      actorName: req.user.name || 'Admin',
      metadata: { campaignTitle: campaign.title, notes: notes || '' }
    });

    res.json({
      success: true,
      message: `Campaign "${campaign.title}" rejected.`,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Suspend Campaign
// @route   PATCH /api/admin/campaigns/:id/suspend
// @access  Private (Admin)
export const suspendCampaign = async (req, res) => {
  try {
    const { notes } = req.body;
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: 'suspended' },
      { new: true }
    ).populate('trust', 'name logo');

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    await logAuditEvent({
      action: 'CAMPAIGN_SUSPENDED',
      entityType: 'Campaign',
      entityId: campaign._id,
      actorType: 'Admin',
      actorId: req.user.id,
      actorName: req.user.name || 'Admin',
      metadata: { campaignTitle: campaign.title, notes: notes || '' }
    });

    res.json({
      success: true,
      message: `Campaign "${campaign.title}" suspended.`,
      data: campaign
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all donations for admin with 8 sorting modes, search & filtering
// @route   GET /api/admin/donations
// @access  Private (Admin)
export const getAdminDonations = async (req, res) => {
  try {
    const {
      search = '',
      status = 'all',
      anonymous = 'all',
      campaignId = '',
      trustId = '',
      minAmount = '',
      maxAmount = '',
      startDate = '',
      endDate = '',
      sort = 'date_desc',
      page = 1,
      limit = 20
    } = req.query;

    const query = {};

    // Payment status
    if (status && status !== 'all') {
      query.paymentStatus = status;
    }

    // Anonymous filter
    if (anonymous === 'anonymous') {
      query.anonymous = true;
    } else if (anonymous === 'named') {
      query.anonymous = false;
    }

    // Campaign filter
    if (campaignId && mongoose.Types.ObjectId.isValid(campaignId)) {
      query.campaign = campaignId;
    }

    // Trust filter
    if (trustId && mongoose.Types.ObjectId.isValid(trustId)) {
      query.trust = trustId;
    }

    // Amount range
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    // Date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Search query
    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { donorName: { $regex: term, $options: 'i' } },
        { donorEmail: { $regex: term, $options: 'i' } },
        { transactionId: { $regex: term, $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));

    // Handle frequent donor aggregation sorting
    if (sort === 'most_frequent' || sort === 'least_frequent') {
      // Calculate donation frequency for non-anonymous/identifiable donors
      const frequencyAgg = await Donation.aggregate([
        { $match: { ...query, anonymous: false } },
        { $group: { _id: '$donorEmail', count: { $sum: 1 } } }
      ]);
      const freqMap = {};
      frequencyAgg.forEach((item) => {
        freqMap[item._id] = item.count;
      });

      const allDonations = await Donation.find(query)
        .populate('campaign', 'title category')
        .populate('trust', 'name')
        .lean();

      // Annotate with donationCount
      const annotated = allDonations.map((d) => ({
        ...d,
        donorFrequency: d.anonymous ? 1 : freqMap[d.donorEmail] || 1
      }));

      // Sort
      annotated.sort((a, b) => {
        if (sort === 'most_frequent') {
          return b.donorFrequency - a.donorFrequency || b.createdAt - a.createdAt;
        } else {
          return a.donorFrequency - b.donorFrequency || b.createdAt - a.createdAt;
        }
      });

      const total = annotated.length;
      const paginated = annotated.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      return res.json({
        success: true,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
        data: paginated
      });
    }

    // Standard sorts:
    // 1. donor_asc (Name A-Z)
    // 2. donor_desc (Name Z-A)
    // 3. date_desc (Newest first)
    // 4. date_asc (Oldest first)
    // 5. amount_desc (Highest first)
    // 6. amount_asc (Lowest first)
    let sortObj = { createdAt: -1 };
    if (sort === 'donor_asc') {
      sortObj = { donorName: 1 };
    } else if (sort === 'donor_desc') {
      sortObj = { donorName: -1 };
    } else if (sort === 'date_asc') {
      sortObj = { createdAt: 1 };
    } else if (sort === 'amount_desc') {
      sortObj = { amount: -1 };
    } else if (sort === 'amount_asc') {
      sortObj = { amount: 1 };
    }

    const total = await Donation.countDocuments(query);
    const donations = await Donation.find(query)
      .populate('campaign', 'title category')
      .populate('trust', 'name')
      .sort(sortObj)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: donations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get audit trail logs (append-only ledger)
// @route   GET /api/admin/audit-logs
// @access  Private (Admin)
export const getAdminAuditLogs = async (req, res) => {
  try {
    const {
      search = '',
      action = 'all',
      entityType = 'all',
      actorType = 'all',
      sort = 'date_desc',
      page = 1,
      limit = 25
    } = req.query;

    const query = {};

    if (action && action !== 'all') {
      query.action = action;
    }
    if (entityType && entityType !== 'all') {
      query.entityType = entityType;
    }
    if (actorType && actorType !== 'all') {
      query.actorType = actorType;
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { action: { $regex: term, $options: 'i' } },
        { actorName: { $regex: term, $options: 'i' } }
      ];
    }

    const sortOrder = sort === 'date_asc' ? { timestamp: 1 } : { timestamp: -1 };
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 25));
    const skip = (pageNum - 1) * limitNum;

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .sort(sortOrder)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get comprehensive reports and analytics
// @route   GET /api/admin/reports
// @access  Private (Admin)
export const getAdminReports = async (req, res) => {
  try {
    // 1. Monthly donations for the last 6 months
    const monthlyDonations = await Donation.aggregate([
      { $match: { paymentStatus: 'Success' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // 2. Donations by Category
    const donationsByCategory = await Campaign.aggregate([
      {
        $group: {
          _id: '$category',
          totalRaised: { $sum: '$raisedAmount' },
          campaignCount: { $sum: 1 }
        }
      },
      { $sort: { totalRaised: -1 } }
    ]);

    // 3. Top Funded Campaigns
    const topCampaigns = await Campaign.find()
      .populate('trust', 'name')
      .sort({ raisedAmount: -1 })
      .limit(5)
      .select('title category raisedAmount targetAmount donorCount shareCount');

    // 4. Most Shared Campaigns
    const mostShared = await Campaign.find()
      .populate('trust', 'name')
      .sort({ shareCount: -1 })
      .limit(5)
      .select('title category raisedAmount targetAmount donorCount shareCount');

    // 5. Campaign Completion Rate
    const totalCamp = await Campaign.countDocuments();
    const completedCamp = await Campaign.countDocuments({ status: 'completed' });
    const completionRate = totalCamp > 0 ? Math.round((completedCamp / totalCamp) * 100) : 0;

    // 6. Trust Verification Rate
    const totalTr = await Trust.countDocuments();
    const verifiedTr = await Trust.countDocuments({ verificationStatus: 'Verified' });
    const verificationRate = totalTr > 0 ? Math.round((verifiedTr / totalTr) * 100) : 0;

    // 7. Donor Frequency Distribution
    const donorFreq = await Donation.aggregate([
      { $match: { paymentStatus: 'Success', anonymous: false } },
      { $group: { _id: '$donorEmail', count: { $sum: 1 } } },
      {
        $bucket: {
          groupBy: '$count',
          boundaries: [1, 2, 5, 10, 50],
          default: '50+',
          output: {
            donorCount: { $sum: 1 }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        monthlyDonations,
        donationsByCategory,
        topCampaigns,
        mostShared,
        completionRate,
        verificationRate,
        donorFrequency: donorFreq,
        summary: {
          totalCampaigns: totalCamp,
          completedCampaigns: completedCamp,
          totalTrusts: totalTr,
          verifiedTrusts: verifiedTr
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all impact updates
// @route   GET /api/admin/impact-updates
// @access  Private (Admin)
export const getAdminImpactUpdates = async (req, res) => {
  try {
    const { status = 'all' } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const updates = await CampaignUpdate.find(query)
      .populate('campaign', 'title category raisedAmount targetAmount image status impactStatus')
      .populate('trust', 'name logo location contact')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: updates.length, data: updates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve Impact Update
// @route   PATCH /api/admin/impact-updates/:id/approve
// @access  Private (Admin)
export const approveImpactUpdate = async (req, res) => {
  try {
    const update = await CampaignUpdate.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('campaign', 'title');

    if (!update) {
      return res.status(404).json({ success: false, message: 'Impact update not found.' });
    }

    // Also mark campaign impactStatus as approved
    if (update.campaign) {
      await Campaign.findByIdAndUpdate(update.campaign._id, {
        impactStatus: 'approved'
      });
    }

    await logAuditEvent({
      action: 'IMPACT_UPDATE_APPROVED',
      entityType: 'CampaignUpdate',
      entityId: update._id,
      actorType: 'Admin',
      actorId: req.user.id,
      actorName: req.user.name || 'Admin',
      metadata: { updateTitle: update.title, campaignTitle: update.campaign?.title }
    });

    res.json({
      success: true,
      message: 'Impact update approved! It is now verified and visible on the public campaign page.',
      data: update
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject Impact Update
// @route   PATCH /api/admin/impact-updates/:id/reject
// @access  Private (Admin)
export const rejectImpactUpdate = async (req, res) => {
  try {
    const { notes } = req.body;
    const update = await CampaignUpdate.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', adminNotes: notes || 'Rejected by administrator' },
      { new: true }
    ).populate('campaign', 'title');

    if (!update) {
      return res.status(404).json({ success: false, message: 'Impact update not found.' });
    }

    if (update.campaign) {
      await Campaign.findByIdAndUpdate(update.campaign._id, {
        impactStatus: 'rejected'
      });
    }

    await logAuditEvent({
      action: 'IMPACT_UPDATE_REJECTED',
      entityType: 'CampaignUpdate',
      entityId: update._id,
      actorType: 'Admin',
      actorId: req.user.id,
      actorName: req.user.name || 'Admin',
      metadata: { updateTitle: update.title, notes: notes || '' }
    });

    res.json({ success: true, message: 'Impact update rejected.', data: update });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

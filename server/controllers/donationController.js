import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';
import { logAuditEvent } from '../utils/auditLogger.js';

// @desc    Process a mock donation (Guest checkout - no login required)
// @route   POST /api/donations
// @access  Public
export const createDonation = async (req, res) => {
  try {
    const { campaignId, donorName, donorEmail, donorPhone, amount, anonymous } = req.body;

    // Validation
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid donation amount greater than 0.' });
    }

    if (!donorName || !donorEmail) {
      return res.status(400).json({ success: false, message: 'Donor name and email are required for receipt generation.' });
    }

    const campaign = await Campaign.findById(campaignId).populate('trust', 'name');
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    // Create donation record
    const donation = await Donation.create({
      campaign: campaignId,
      trust: campaign.trust._id || campaign.trust,
      donorName: donorName.trim(),
      donorEmail: donorEmail.trim(),
      donorPhone: donorPhone ? donorPhone.trim() : '',
      amount: parsedAmount,
      anonymous: Boolean(anonymous),
      paymentStatus: 'Success'
    });

    // Update campaign metrics
    campaign.raisedAmount = (campaign.raisedAmount || 0) + parsedAmount;
    campaign.donorCount = (campaign.donorCount || 0) + 1;

    // Check if target achieved
    let completedNow = false;
    if (campaign.raisedAmount >= campaign.targetAmount && campaign.status !== 'completed') {
      campaign.status = 'completed';
      campaign.completedAt = new Date();
      campaign.impactStatus = 'required';
      completedNow = true;
    }

    await campaign.save();

    // Log donation audit event
    await logAuditEvent({
      action: 'DONATION_RECEIVED',
      entityType: 'Donation',
      entityId: donation._id,
      actorType: 'Donor',
      actorName: anonymous ? 'Anonymous Donor' : donorName,
      metadata: {
        amount: parsedAmount,
        campaignId: campaign._id,
        campaignTitle: campaign.title,
        trustName: campaign.trust?.name,
        anonymous: Boolean(anonymous)
      }
    });

    if (completedNow) {
      await logAuditEvent({
        action: 'CAMPAIGN_COMPLETED',
        entityType: 'Campaign',
        entityId: campaign._id,
        actorType: 'System',
        actorName: 'System Trigger',
        metadata: {
          campaignTitle: campaign.title,
          targetAmount: campaign.targetAmount,
          raisedAmount: campaign.raisedAmount
        }
      });
    }

    const populatedDonation = await Donation.findById(donation._id)
      .populate('campaign', 'title image category targetAmount raisedAmount fundingPercentage')
      .populate('trust', 'name logo location');

    res.status(201).json({
      success: true,
      message: 'Donation processed successfully!',
      data: populatedDonation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all donations (Audit log)
// @route   GET /api/donations
// @access  Public / Admin
export const getDonations = async (req, res) => {
  try {
    const { campaignId, limit } = req.query;
    let query = {};

    if (campaignId) {
      query.campaign = campaignId;
    }

    let queryObj = Donation.find(query)
      .populate('campaign', 'title category')
      .populate('trust', 'name')
      .sort({ createdAt: -1 });

    if (limit) {
      queryObj = queryObj.limit(parseInt(limit));
    }

    const donations = await queryObj;

    res.json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get donation receipt by ID
// @route   GET /api/donations/:id
// @access  Public
export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('campaign', 'title category targetAmount raisedAmount image')
      .populate('trust', 'name logo location registrationNumber');

    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation record not found.' });
    }

    res.json({ success: true, data: donation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

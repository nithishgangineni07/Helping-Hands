import mongoose from 'mongoose';
import Trust from '../models/Trust.js';
import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';
import CampaignUpdate from '../models/CampaignUpdate.js';
import { logAuditEvent } from '../utils/auditLogger.js';

// @desc    Get trust compliance status (checks whether organization data is complete)
// @route   GET /api/trust/compliance-status
// @access  Private (Trust only)
export const getComplianceStatus = async (req, res) => {
  try {
    const trust = await Trust.findById(req.user.trustId);
    if (!trust) {
      return res.status(404).json({ success: false, message: 'Trust profile not found.' });
    }

    const missingFields = [];
    if (!trust.contact?.email) missingFields.push('Email');
    if (!trust.contact?.phone) missingFields.push('Phone');
    if (!trust.organizerName) missingFields.push('Organizer / Contact Person');
    if (!trust.location) missingFields.push('Location');
    if (!trust.gstStatus) missingFields.push('GST Status');
    if (trust.gstStatus === 'registered' && !trust.gstNumber) missingFields.push('GST Number');
    if (!trust.taxExemptionStatus) missingFields.push('Tax Exemption Status');
    if (!trust.fcraStatus) missingFields.push('FCRA Status');

    const hasCompletedCompliance = missingFields.length === 0;

    res.json({
      success: true,
      data: {
        hasCompletedCompliance,
        missingFields,
        trust
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trust profile for currently logged in trust
// @route   GET /api/trust/profile
// @access  Private (Trust only)
export const getTrustProfile = async (req, res) => {
  try {
    const trust = await Trust.findById(req.user.trustId);
    if (!trust) {
      return res.status(404).json({ success: false, message: 'Trust profile not found.' });
    }

    res.json({ success: true, data: trust });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update trust profile & compliance information
// @route   PUT /api/trust/profile
// @access  Private (Trust only)
export const updateTrustProfile = async (req, res) => {
  try {
    const trust = await Trust.findById(req.user.trustId);
    if (!trust) {
      return res.status(404).json({ success: false, message: 'Trust profile not found.' });
    }

    const {
      description,
      organizerName,
      phone,
      email,
      website,
      location,
      yearsOfService,
      peopleHelpedCount,
      logo,
      // Compliance fields
      gstStatus,
      gstNumber,
      taxExemptionStatus,
      taxExemptionType,
      taxExemptionNumber,
      fcraStatus,
      fcraRegistrationNumber
    } = req.body;

    let complianceChanged = false;

    if (description !== undefined) trust.description = description;
    if (organizerName !== undefined) trust.organizerName = organizerName;
    if (phone !== undefined) trust.contact.phone = phone;
    if (email !== undefined) trust.contact.email = email;
    if (website !== undefined) trust.contact.website = website;
    if (location !== undefined) trust.location = location;
    if (yearsOfService !== undefined) trust.yearsOfService = Number(yearsOfService);
    if (peopleHelpedCount !== undefined) trust.peopleHelpedCount = Number(peopleHelpedCount);
    if (logo) trust.logo = logo;

    if (req.file) {
      trust.logo = `/uploads/trust-logos/${req.file.filename}`;
    }

    // Compliance field updates
    if (gstStatus !== undefined && gstStatus !== trust.gstStatus) {
      trust.gstStatus = gstStatus;
      complianceChanged = true;
    }
    if (gstNumber !== undefined && gstNumber !== trust.gstNumber) {
      trust.gstNumber = gstNumber;
      complianceChanged = true;
    }
    if (taxExemptionStatus !== undefined && taxExemptionStatus !== trust.taxExemptionStatus) {
      trust.taxExemptionStatus = taxExemptionStatus;
      complianceChanged = true;
    }
    if (taxExemptionType !== undefined) trust.taxExemptionType = taxExemptionType;
    if (taxExemptionNumber !== undefined) trust.taxExemptionNumber = taxExemptionNumber;

    if (fcraStatus !== undefined && fcraStatus !== trust.fcraStatus) {
      trust.fcraStatus = fcraStatus;
      // International donations cannot be enabled without administrative verification
      trust.internationalDonationsEnabled = false;
      complianceChanged = true;
    }
    if (fcraRegistrationNumber !== undefined) {
      trust.fcraRegistrationNumber = fcraRegistrationNumber;
    }

    await trust.save();

    await logAuditEvent({
      action: complianceChanged ? 'COMPLIANCE_UPDATED' : 'TRUST_PROFILE_UPDATED',
      entityType: 'Trust',
      entityId: trust._id,
      actorType: 'Trust',
      actorId: req.user.id,
      actorName: trust.name,
      metadata: { complianceChanged }
    });

    res.json({
      success: true,
      message: complianceChanged
        ? 'Profile and compliance information updated successfully! Changes logged for review.'
        : 'Profile updated successfully!',
      data: trust
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trust dashboard metrics with real MongoDB aggregation
// @route   GET /api/trust/dashboard
// @access  Private (Trust only)
export const getTrustDashboard = async (req, res) => {
  try {
    const trustId = req.user.trustId;
    const trust = await Trust.findById(trustId);
    if (!trust) {
      return res.status(404).json({ success: false, message: 'Trust profile not found.' });
    }

    // Real aggregation queries
    const totalCampaigns = await Campaign.countDocuments({ trust: trustId });
    const activeCauses = await Campaign.countDocuments({ trust: trustId, status: 'active' });
    const completedCauses = await Campaign.countDocuments({ trust: trustId, status: 'completed' });
    const pendingReviewCount = await Campaign.countDocuments({
      trust: trustId,
      status: 'pending_review'
    });

    // Sum total funds raised
    const raisedAgg = await Campaign.aggregate([
      { $match: { trust: new mongoose.Types.ObjectId(trustId) } },
      { $group: { _id: null, totalRaised: { $sum: '$raisedAmount' } } }
    ]);
    const totalRaised = raisedAgg.length > 0 ? raisedAgg[0].totalRaised : 0;

    // Distinct supporters count
    const supportersCount = await Donation.countDocuments({
      trust: trustId,
      paymentStatus: 'Success'
    });

    // Completed causes needing impact update
    const pendingImpactCount = await Campaign.countDocuments({
      trust: trustId,
      status: 'completed',
      $or: [{ impactStatus: 'required' }, { impactStatus: 'not_required' }]
    });

    // Recent 5 campaigns
    const recentCampaigns = await Campaign.find({ trust: trustId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent 5 donations
    const recentDonations = await Donation.find({ trust: trustId, paymentStatus: 'Success' })
      .populate('campaign', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        trust,
        stats: {
          totalCampaigns,
          activeCauses,
          totalRaised,
          supportersCount,
          completedCauses,
          pendingReviewCount,
          pendingImpactCount
        },
        recentCampaigns,
        recentDonations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all campaigns owned by logged in trust (with multi-filtering & 12 sorting options)
// @route   GET /api/trust/campaigns
// @access  Private (Trust only)
export const getTrustCampaigns = async (req, res) => {
  try {
    const trustId = req.user.trustId;
    const {
      search = '',
      status = 'all',
      category = 'all',
      funding = 'all',
      impactStatus = 'all',
      deadline = 'all',
      sort = 'newest'
    } = req.query;

    const query = { trust: trustId };

    // Status filter (all, draft, pending_review, active, completed, suspended, rejected)
    if (status && status !== 'all') {
      query.status = status;
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Impact status filter
    if (impactStatus && impactStatus !== 'all') {
      query.impactStatus = impactStatus;
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

    // Deadline filter
    if (deadline === 'upcoming') {
      query.deadline = { $gte: new Date() };
    } else if (deadline === 'passed') {
      query.deadline = { $lt: new Date() };
    }

    // Search term
    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    // 12 Sorting modes
    let sortObj = { createdAt: -1 };
    switch (sort) {
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'highest_target':
        sortObj = { targetAmount: -1 };
        break;
      case 'lowest_target':
        sortObj = { targetAmount: 1 };
        break;
      case 'highest_raised':
        sortObj = { raisedAmount: -1 };
        break;
      case 'lowest_raised':
        sortObj = { raisedAmount: 1 };
        break;
      case 'highest_progress':
        // Capped percentage or ratio handled by raisedAmount/targetAmount
        sortObj = { raisedAmount: -1 };
        break;
      case 'most_donors':
        sortObj = { donorCount: -1 };
        break;
      case 'most_shares':
        sortObj = { shareCount: -1 };
        break;
      case 'deadline_soonest':
        sortObj = { deadline: 1 };
        break;
      case 'deadline_latest':
        sortObj = { deadline: -1 };
        break;
      case 'status':
        sortObj = { status: 1 };
        break;
      case 'newest':
      default:
        sortObj = { createdAt: -1 };
        break;
    }

    const campaigns = await Campaign.find(query)
      .populate('trust', 'name logo verificationStatus')
      .sort(sortObj);

    // Ensure completed campaigns have appropriate impactStatus assigned
    const mapped = campaigns.map((camp) => {
      const obj = camp.toObject();
      if (obj.status === 'completed' && (!obj.impactStatus || obj.impactStatus === 'not_required')) {
        obj.impactStatus = 'required';
      }
      return obj;
    });

    res.json({ success: true, count: mapped.length, data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit new donation request/campaign (with strict compliance validation)
// @route   POST /api/trust/campaigns
// @access  Private (Trust only)
export const createTrustCampaign = async (req, res) => {
  try {
    const trust = await Trust.findById(req.user.trustId);
    if (!trust) {
      return res.status(404).json({ success: false, message: 'Trust profile not found.' });
    }

    // Check verification status
    if (trust.verificationStatus !== 'Verified') {
      return res.status(403).json({
        success: false,
        message: `Your organization is currently ${trust.verificationStatus.toLowerCase()}. Only verified trusts can submit active causes for fundraising.`
      });
    }

    const {
      title,
      category,
      description,
      detailedNeed,
      expectedFundsUse,
      targetAmount,
      deadline,
      image,
      whyNeeded,
      // Organization / Compliance submitted or confirmed with cause
      gstStatus,
      gstNumber,
      taxExemptionStatus,
      taxExemptionType,
      taxExemptionNumber,
      fcraStatus,
      contactName,
      contactEmail,
      contactPhone,
      location
    } = req.body;

    // MANDATORY BACKEND VALIDATION:
    // 1. Campaign basic fields
    if (!title || !category || !description || !targetAmount || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Title, Category, Description, Target Amount, and Deadline.'
      });
    }

    // 2. Compliance fields: Trust must either already have them or provide them now
    const effectiveGstStatus = gstStatus || trust.gstStatus;
    const effectiveGstNumber = gstNumber !== undefined ? gstNumber : trust.gstNumber;
    const effectiveTaxStatus = taxExemptionStatus || trust.taxExemptionStatus;
    const effectiveFcraStatus = fcraStatus || trust.fcraStatus;
    const effectiveEmail = contactEmail || trust.contact?.email;
    const effectivePhone = contactPhone || trust.contact?.phone;

    if (!effectiveEmail) {
      return res.status(400).json({
        success: false,
        message: 'Contact Email is required before submitting a fundraising cause.'
      });
    }

    if (!effectivePhone) {
      return res.status(400).json({
        success: false,
        message: 'Contact Phone number is required before submitting a fundraising cause.'
      });
    }

    if (!effectiveGstStatus) {
      return res.status(400).json({
        success: false,
        message: 'GST Status is required (Registered, Not Applicable, or Pending Verification).'
      });
    }

    if (effectiveGstStatus === 'registered' && !effectiveGstNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your organization GST number.'
      });
    }

    if (!effectiveTaxStatus) {
      return res.status(400).json({
        success: false,
        message: 'Tax Exemption status (80G / 12A) is required before submitting a cause.'
      });
    }

    if (!effectiveFcraStatus) {
      return res.status(400).json({
        success: false,
        message: 'FCRA Status must be declared before submitting a cause.'
      });
    }

    // Persist/Update trust organization compliance if newly provided
    let trustUpdated = false;
    if (gstStatus && trust.gstStatus !== gstStatus) {
      trust.gstStatus = gstStatus;
      trustUpdated = true;
    }
    if (gstNumber !== undefined && trust.gstNumber !== gstNumber) {
      trust.gstNumber = gstNumber;
      trustUpdated = true;
    }
    if (taxExemptionStatus && trust.taxExemptionStatus !== taxExemptionStatus) {
      trust.taxExemptionStatus = taxExemptionStatus;
      trustUpdated = true;
    }
    if (taxExemptionType) trust.taxExemptionType = taxExemptionType;
    if (taxExemptionNumber) trust.taxExemptionNumber = taxExemptionNumber;
    if (fcraStatus && trust.fcraStatus !== fcraStatus) {
      trust.fcraStatus = fcraStatus;
      trustUpdated = true;
    }
    if (contactEmail && trust.contact.email !== contactEmail) {
      trust.contact.email = contactEmail;
      trustUpdated = true;
    }
    if (contactPhone && trust.contact.phone !== contactPhone) {
      trust.contact.phone = contactPhone;
      trustUpdated = true;
    }
    if (contactName && trust.organizerName !== contactName) {
      trust.organizerName = contactName;
      trustUpdated = true;
    }
    if (location && trust.location !== location) {
      trust.location = location;
      trustUpdated = true;
    }

    if (trustUpdated) {
      await trust.save();
      await logAuditEvent({
        action: 'COMPLIANCE_UPDATED',
        entityType: 'Trust',
        entityId: trust._id,
        actorType: 'Trust',
        actorId: req.user.id,
        actorName: trust.name,
        metadata: { source: 'Cause Creation' }
      });
    }

    let resolvedImage =
      image || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80';
    if (req.file) {
      resolvedImage = `/uploads/campaign-images/${req.file.filename}`;
    }

    const campaign = await Campaign.create({
      trust: trust._id,
      title: title.trim(),
      category,
      description: description.trim(),
      detailedNeed: detailedNeed || '',
      expectedFundsUse: expectedFundsUse || '',
      image: resolvedImage,
      galleryImages: [resolvedImage],
      targetAmount: Number(targetAmount),
      raisedAmount: 0,
      donorCount: 0,
      shareCount: 0,
      deadline: new Date(deadline),
      status: 'pending_review',
      impactStatus: 'not_required',
      whyNeeded: whyNeeded || description,
      howDonationHelps: [
        {
          amount: Math.round(Number(targetAmount) * 0.1),
          impact: 'Covers initial survey, logistical setup, and procurement of supplies.'
        },
        {
          amount: Math.round(Number(targetAmount) * 0.5),
          impact: 'Direct community deployment and milestone distribution.'
        }
      ]
    });

    await logAuditEvent({
      action: 'CAMPAIGN_SUBMITTED',
      entityType: 'Campaign',
      entityId: campaign._id,
      actorType: 'Trust',
      actorId: req.user.id,
      actorName: trust.name,
      metadata: { campaignTitle: campaign.title, targetAmount: campaign.targetAmount }
    });

    res.status(201).json({
      success: true,
      message:
        'Donation cause submitted successfully! Your campaign is now queued for administrative verification.',
      data: campaign
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Upload comprehensive impact update for completed campaign
// @route   POST /api/trust/campaigns/:id/impact
// @access  Private (Trust only)
export const uploadImpactUpdate = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    // Ownership check
    if (campaign.trust.toString() !== req.user.trustId.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'Unauthorized. You can only update your own campaigns.' });
    }

    const {
      title,
      description,
      whatWasAchieved,
      howFundsWereUsed,
      beneficiariesReached,
      completionDate,
      photos,
      documentUrls,
      documentNames
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Title and Description for the impact report.'
      });
    }

    let parsedPhotos = Array.isArray(photos) ? photos : photos ? [photos] : [];
    let parsedDocs = [];

    // Handle files if uploaded via multipart
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        if (file.mimetype.startsWith('image/')) {
          parsedPhotos.push(`/uploads/impact-media/${file.filename}`);
        } else if (file.mimetype === 'application/pdf') {
          parsedDocs.push({
            name: file.originalname,
            url: `/uploads/impact-media/${file.filename}`,
            docType: 'pdf'
          });
        }
      });
    }

    // Handle custom document URLs if passed
    if (documentUrls) {
      const docUrlList = Array.isArray(documentUrls) ? documentUrls : [documentUrls];
      const docNameList = Array.isArray(documentNames)
        ? documentNames
        : [documentNames || 'Impact Documentation'];
      docUrlList.forEach((url, i) => {
        if (url) {
          parsedDocs.push({
            name: docNameList[i] || 'Supporting Impact Document',
            url,
            docType: 'pdf'
          });
        }
      });
    }

    const update = await CampaignUpdate.create({
      campaign: campaign._id,
      trust: campaign.trust,
      title: title.trim(),
      description: description.trim(),
      whatWasAchieved: whatWasAchieved || '',
      howFundsWereUsed: howFundsWereUsed || '',
      beneficiariesReached: Number(beneficiariesReached) || 0,
      completionDate: completionDate ? new Date(completionDate) : new Date(),
      image: parsedPhotos[0] || campaign.image,
      photos: parsedPhotos,
      documents: parsedDocs,
      status: 'pending_review'
    });

    // Update campaign status
    campaign.impactStatus = 'pending_review';
    await campaign.save();

    await logAuditEvent({
      action: 'IMPACT_UPDATE_SUBMITTED',
      entityType: 'CampaignUpdate',
      entityId: update._id,
      actorType: 'Trust',
      actorId: req.user.id,
      actorName: req.user.trustName || 'Trust',
      metadata: { campaignId: campaign._id, campaignTitle: campaign.title }
    });

    res.status(201).json({
      success: true,
      message:
        'Impact report submitted successfully! Once approved by admin, it will be published to the public campaign page.',
      data: update
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get donations for campaigns owned by logged in trust (with privacy protection)
// @route   GET /api/trust/donations
// @access  Private (Trust only)
export const getTrustDonations = async (req, res) => {
  try {
    const trustId = req.user.trustId;
    const {
      search = '',
      campaignId = '',
      status = 'all',
      sort = 'newest',
      page = 1,
      limit = 20
    } = req.query;

    const query = { trust: trustId };

    if (campaignId && mongoose.Types.ObjectId.isValid(campaignId)) {
      query.campaign = campaignId;
    }

    if (status && status !== 'all') {
      query.paymentStatus = status;
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { donorName: { $regex: term, $options: 'i' } },
        { transactionId: { $regex: term, $options: 'i' } }
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === 'oldest') sortObj = { createdAt: 1 };
    else if (sort === 'amount_desc') sortObj = { amount: -1 };
    else if (sort === 'amount_asc') sortObj = { amount: 1 };

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const total = await Donation.countDocuments(query);
    const donations = await Donation.find(query)
      .populate('campaign', 'title category')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // PRIVACY SAFEGUARD:
    // Mask anonymous donor details and strip sensitive emails
    const sanitized = donations.map((d) => {
      if (d.anonymous) {
        return {
          ...d,
          donorName: 'Anonymous Supporter',
          donorEmail: 'Protected Donor Email',
          donorPhone: ''
        };
      }
      return {
        ...d,
        // Mask parts of email for privacy
        donorEmail: d.donorEmail ? d.donorEmail.replace(/^(.{2})(.*)(@.*)$/, '$1***$3') : ''
      };
    });

    res.json({
      success: true,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      data: sanitized
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import Campaign from '../models/Campaign.js';
import CampaignUpdate from '../models/CampaignUpdate.js';
import Trust from '../models/Trust.js';
import Donation from '../models/Donation.js';

// @desc    Get campaigns with filtering, search and sorting
// @route   GET /api/campaigns
// @access  Public
export const getCampaigns = async (req, res) => {
  try {
    const { category, search, sort, status, nearlyFunded, limit } = req.query;

    let query = {};

    // Default to active unless specified otherwise (or 'all' for admin)
    if (status && status !== 'all') {
      query.status = status;
    } else if (!status) {
      query.status = 'active';
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { whyNeeded: { $regex: search, $options: 'i' } }
      ];
    }

    let campaigns = await Campaign.find(query)
      .populate('trust', 'name logo location verificationStatus')
      .sort({ createdAt: -1 });

    // Filter nearly funded (75% to 99%) dynamically
    if (nearlyFunded === 'true' || sort === 'nearly_funded') {
      campaigns = campaigns.filter((c) => {
        const pct = c.fundingPercentage;
        return pct >= 75 && pct < 100;
      });
    }

    // Apply sorting logic
    if (sort === 'most_funded') {
      campaigns.sort((a, b) => b.fundingPercentage - a.fundingPercentage);
    } else if (sort === 'ending_soon') {
      campaigns.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sort === 'nearly_funded') {
      campaigns.sort((a, b) => b.fundingPercentage - a.fundingPercentage);
    } else {
      campaigns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (limit) {
      campaigns = campaigns.slice(0, parseInt(limit));
    }

    res.json({ success: true, count: campaigns.length, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single campaign by ID
// @route   GET /api/campaigns/:id
// @access  Public
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      'trust',
      'name description logo location contact registrationNumber verificationStatus yearsOfService organizerName'
    );

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const updates = await CampaignUpdate.find({
      campaign: campaign._id,
      status: 'approved'
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...campaign.toObject(),
        updates
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public sanitized donor list for campaign
// @route   GET /api/campaigns/:id/donors
// @access  Public
export const getCampaignDonors = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    const totalDonors = await Donation.countDocuments({
      campaign: id,
      paymentStatus: 'Success'
    });

    const donations = await Donation.find({
      campaign: id,
      paymentStatus: 'Success'
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Sanitize donors: NEVER expose email, phone or real name for anonymous donors
    const sanitizedDonors = donations.map((d) => ({
      _id: d._id,
      displayName: d.anonymous ? 'Anonymous Supporter' : d.donorName,
      anonymous: d.anonymous,
      amount: d.amount,
      createdAt: d.createdAt
    }));

    res.json({
      success: true,
      totalDonors,
      page,
      totalPages: Math.ceil(totalDonors / limit),
      hasMore: page * limit < totalDonors,
      data: sanitizedDonors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Record a share event and increment shareCount
// @route   POST /api/campaigns/:id/share
// @access  Public
export const shareCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $inc: { shareCount: 1 } },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found.' });
    }

    res.json({
      success: true,
      shareCount: campaign.shareCount,
      message: 'Thanks for spreading the word! 💚'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new campaign (Admin direct creation)
// @route   POST /api/campaigns
// @access  Private (Admin)
export const createCampaign = async (req, res) => {
  try {
    const {
      trust,
      title,
      category,
      description,
      image,
      targetAmount,
      deadline,
      whyNeeded,
      howDonationHelps,
      galleryImages,
      status
    } = req.body;

    const trustDoc = await Trust.findById(trust);
    if (!trustDoc) {
      return res.status(404).json({ success: false, message: 'Selected Trust not found' });
    }

    const campaign = await Campaign.create({
      trust,
      title,
      category,
      description,
      image,
      targetAmount: Number(targetAmount),
      raisedAmount: 0,
      donorCount: 0,
      shareCount: 0,
      deadline: new Date(deadline),
      status: status || 'active',
      whyNeeded: whyNeeded || description,
      howDonationHelps: howDonationHelps || [],
      galleryImages: galleryImages || [image]
    });

    const populated = await Campaign.findById(campaign._id).populate('trust', 'name logo verificationStatus');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update campaign
// @route   PUT /api/campaigns/:id
// @access  Private (Admin)
export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('trust', 'name logo verificationStatus');

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    res.json({ success: true, data: campaign });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private (Admin)
export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    await CampaignUpdate.deleteMany({ campaign: req.params.id });

    res.json({ success: true, message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add update to campaign
// @route   POST /api/campaigns/:id/updates
// @access  Public / Protected
export const addCampaignUpdate = async (req, res) => {
  try {
    const { title, description, image, photos, documents } = req.body;
    const campaignId = req.params.id;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const update = await CampaignUpdate.create({
      campaign: campaignId,
      trust: campaign.trust,
      title,
      description,
      image: image || (photos && photos[0]) || '',
      photos: photos || (image ? [image] : []),
      documents: documents || [],
      status: 'approved'
    });

    res.status(201).json({ success: true, data: update });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

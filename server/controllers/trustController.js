import Trust from '../models/Trust.js';
import Campaign from '../models/Campaign.js';

// @desc    Get all trusts
// @route   GET /api/trusts
// @access  Public
export const getTrusts = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.verificationStatus = status;
    } else if (!status) {
      // Default to Verified for public directory
      query.verificationStatus = 'Verified';
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const trusts = await Trust.find(query).sort({ createdAt: -1 });

    // Enhance trusts with campaign stats
    const enhancedTrusts = await Promise.all(
      trusts.map(async (trust) => {
        const activeCampaignsCount = await Campaign.countDocuments({ trust: trust._id, status: 'active' });
        const completedCampaignsCount = await Campaign.countDocuments({ trust: trust._id, status: 'completed' });
        const campaigns = await Campaign.find({ trust: trust._id });
        const totalRaised = campaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);

        return {
          ...trust.toObject(),
          activeCampaignsCount,
          completedCampaignsCount,
          totalRaised
        };
      })
    );

    res.json({ success: true, count: enhancedTrusts.length, data: enhancedTrusts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single trust details
// @route   GET /api/trusts/:id
// @access  Public
export const getTrustById = async (req, res) => {
  try {
    const trust = await Trust.findById(req.params.id);
    if (!trust) {
      return res.status(404).json({ success: false, message: 'Trust not found' });
    }

    const activeCampaigns = await Campaign.find({ trust: trust._id, status: 'active' })
      .populate('trust', 'name logo verificationStatus');
    const completedCampaigns = await Campaign.find({ trust: trust._id, status: 'completed' })
      .populate('trust', 'name logo verificationStatus');

    const allCampaigns = await Campaign.find({ trust: trust._id });
    const totalRaised = allCampaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0);
    const totalDonors = allCampaigns.reduce((sum, c) => sum + (c.donorCount || 0), 0);

    res.json({
      success: true,
      data: {
        ...trust.toObject(),
        activeCampaigns,
        completedCampaigns,
        totalRaised,
        totalDonors,
        campaignsCount: allCampaigns.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new trust
// @route   POST /api/trusts
// @access  Private (Admin)
export const createTrust = async (req, res) => {
  try {
    const { name, organizerName, description, logo, location, contact, registrationNumber, verificationStatus, yearsOfService } = req.body;

    const existingTrust = await Trust.findOne({ registrationNumber });
    if (existingTrust) {
      return res.status(400).json({ success: false, message: 'Registration number already registered' });
    }

    const trust = await Trust.create({
      name,
      organizerName: organizerName || '',
      description: description || 'Dedicated to transparent social impact and community support.',
      logo: logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80',
      location,
      contact: contact || {},
      registrationNumber,
      verificationStatus: verificationStatus || 'Verified',
      yearsOfService: yearsOfService || 3
    });

    res.status(201).json({ success: true, data: trust });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update trust
// @route   PUT /api/trusts/:id
// @access  Private (Admin)
export const updateTrust = async (req, res) => {
  try {
    const trust = await Trust.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!trust) {
      return res.status(404).json({ success: false, message: 'Trust not found' });
    }

    res.json({ success: true, data: trust });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete trust
// @route   DELETE /api/trusts/:id
// @access  Private (Admin)
export const deleteTrust = async (req, res) => {
  try {
    const trust = await Trust.findByIdAndDelete(req.params.id);
    if (!trust) {
      return res.status(404).json({ success: false, message: 'Trust not found' });
    }

    await Campaign.deleteMany({ trust: req.params.id });

    res.json({ success: true, message: 'Trust and associated campaigns deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

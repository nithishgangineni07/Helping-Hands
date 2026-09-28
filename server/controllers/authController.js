import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Trust from '../models/Trust.js';
import TrustUser from '../models/TrustUser.js';

const JWT_SECRET = process.env.JWT_SECRET || 'helping_hands_jwt_secret_super_secure_key_2026';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Admin Login
// @route   POST /api/auth/admin/login
// @access  Public (Secret admin login endpoint)
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.'
      });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.'
      });
    }

    const token = generateToken({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: 'admin'
    });

    res.json({
      success: true,
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trust Initial Registration (Only 7 basic fields required)
// @route   POST /api/auth/trust/register
// @access  Public
export const trustRegister = async (req, res) => {
  try {
    const {
      trustName,
      name,
      organizerName,
      phone,
      email,
      location,
      registrationNumber,
      logo,
      password
    } = req.body;

    const resolvedName = (trustName || name || '').trim();
    const resolvedEmail = (email || '').toLowerCase().trim();
    const resolvedRegNumber = (registrationNumber || '').trim();

    if (!resolvedName || !organizerName || !phone || !resolvedEmail || !location || !resolvedRegNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required registration fields (Trust Name, Organizer Name, Phone, Email, Location, Registration Number, and Password).'
      });
    }

    // Check if account already exists
    const existingUser = await TrustUser.findOne({ email: resolvedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const existingTrust = await Trust.findOne({ registrationNumber: resolvedRegNumber });
    if (existingTrust) {
      return res.status(400).json({
        success: false,
        message: 'A trust with this registration number has already been registered.'
      });
    }

    // Resolve uploaded logo or provided string or fallback
    let resolvedLogo = logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80';
    if (req.file) {
      resolvedLogo = `/uploads/trust-logos/${req.file.filename}`;
    }

    // Create Trust entity with verificationStatus 'Pending'
    const trust = await Trust.create({
      name: resolvedName,
      organizerName: organizerName.trim(),
      location: location.trim(),
      contact: {
        email: resolvedEmail,
        phone: phone.trim()
      },
      registrationNumber: resolvedRegNumber,
      logo: resolvedLogo,
      verificationStatus: 'Pending',
      description: `${resolvedName} is dedicated to social welfare and transparent community empowerment.`
    });

    // Hash password & create TrustUser
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const trustUser = await TrustUser.create({
      trustId: trust._id,
      email: resolvedEmail,
      passwordHash,
      authProvider: 'local',
      role: 'trust'
    });

    const token = generateToken({
      id: trustUser._id,
      trustId: trust._id,
      email: trustUser.email,
      role: 'trust'
    });

    res.status(201).json({
      success: true,
      message: 'Trust registration submitted successfully! Your organization profile is pending administrative review.',
      token,
      user: {
        id: trustUser._id,
        trustId: trust._id,
        email: trustUser.email,
        role: 'trust',
        trustName: trust.name,
        verificationStatus: trust.verificationStatus,
        logo: trust.logo
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trust Login (Email & Password)
// @route   POST /api/auth/trust/login
// @access  Public
export const trustLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const trustUser = await TrustUser.findOne({ email: email.toLowerCase().trim() });
    if (!trustUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await trustUser.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const trust = await Trust.findById(trustUser.trustId);
    if (!trust) {
      return res.status(404).json({
        success: false,
        message: 'Linked trust profile not found.'
      });
    }

    const token = generateToken({
      id: trustUser._id,
      trustId: trust._id,
      email: trustUser.email,
      role: 'trust'
    });

    res.json({
      success: true,
      token,
      user: {
        id: trustUser._id,
        trustId: trust._id,
        email: trustUser.email,
        role: 'trust',
        trustName: trust.name,
        verificationStatus: trust.verificationStatus,
        logo: trust.logo
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trust Google Auth (Sign in / Sign up with Google)
// @route   POST /api/auth/trust/google
// @access  Public
export const trustGoogleAuth = async (req, res) => {
  try {
    const { email, googleId, name, trustName, organizerName, location, registrationNumber, phone, logo } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for Google authentication.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    let trustUser = await TrustUser.findOne({ email: cleanEmail });

    if (trustUser) {
      const trust = await Trust.findById(trustUser.trustId);
      const token = generateToken({
        id: trustUser._id,
        trustId: trust._id,
        email: trustUser.email,
        role: 'trust'
      });

      return res.json({
        success: true,
        token,
        user: {
          id: trustUser._id,
          trustId: trust._id,
          email: trustUser.email,
          role: 'trust',
          trustName: trust.name,
          verificationStatus: trust.verificationStatus,
          logo: trust.logo
        }
      });
    }

    // New Google Signup for Trust
    const resolvedName = (trustName || name || 'New Community Trust').trim();
    const resolvedRegNumber = registrationNumber || `REG-GOOG-${Date.now().toString().slice(-6)}`;

    const trust = await Trust.create({
      name: resolvedName,
      organizerName: (organizerName || name || 'Trust Representative').trim(),
      location: location || 'India',
      contact: {
        email: cleanEmail,
        phone: phone || ''
      },
      registrationNumber: resolvedRegNumber,
      logo: logo || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80',
      verificationStatus: 'Pending',
      description: `${resolvedName} registered via Google Single Sign-On.`
    });

    trustUser = await TrustUser.create({
      trustId: trust._id,
      email: cleanEmail,
      googleId: googleId || `goog_${Date.now()}`,
      authProvider: 'google',
      role: 'trust'
    });

    const token = generateToken({
      id: trustUser._id,
      trustId: trust._id,
      email: trustUser.email,
      role: 'trust'
    });

    res.status(201).json({
      success: true,
      message: 'Account created via Google! Organization verification is pending.',
      token,
      user: {
        id: trustUser._id,
        trustId: trust._id,
        email: trustUser.email,
        role: 'trust',
        trustName: trust.name,
        verificationStatus: trust.verificationStatus,
        logo: trust.logo
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const admin = await Admin.findById(req.user.id).select('-passwordHash');
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin record not found.' });
      }
      return res.json({ success: true, user: admin });
    }

    if (req.user.role === 'trust') {
      const trustUser = await TrustUser.findById(req.user.id).select('-passwordHash');
      if (!trustUser) {
        return res.status(404).json({ success: false, message: 'Trust user account not found.' });
      }

      const trust = await Trust.findById(trustUser.trustId);
      return res.json({
        success: true,
        user: {
          id: trustUser._id,
          trustId: trust?._id,
          email: trustUser.email,
          role: 'trust',
          trustName: trust?.name,
          verificationStatus: trust?.verificationStatus,
          logo: trust?.logo,
          organizerName: trust?.organizerName,
          location: trust?.location,
          contact: trust?.contact,
          registrationNumber: trust?.registrationNumber
        }
      });
    }

    res.status(400).json({ success: false, message: 'Unknown role.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully.' });
};

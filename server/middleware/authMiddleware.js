import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'helping_hands_jwt_secret_super_secure_key_2026';

export const authenticateUser = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden. Administrator privileges required.'
    });
  }
  next();
};

export const requireTrust = (req, res, next) => {
  if (!req.user || req.user.role !== 'trust') {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden. Trust privileges required.'
    });
  }
  next();
};

import express from 'express';
import {
  adminLogin,
  trustRegister,
  trustLogin,
  trustGoogleAuth,
  getMe,
  logout
} from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { uploadLogo } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/admin/login', adminLogin);
router.post('/trust/register', uploadLogo.single('logoFile'), trustRegister);
router.post('/trust/login', trustLogin);
router.post('/trust/google', trustGoogleAuth);
router.get('/me', authenticateUser, getMe);
router.post('/logout', logout);

export default router;

import express from 'express';
import {
  createDonation,
  getDonations,
  getDonationById
} from '../controllers/donationController.js';

const router = express.Router();

router.route('/')
  .get(getDonations)
  .post(createDonation);

router.route('/:id')
  .get(getDonationById);

export default router;

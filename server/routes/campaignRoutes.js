import express from 'express';
import {
  getCampaigns,
  getCampaignById,
  getCampaignDonors,
  shareCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  addCampaignUpdate
} from '../controllers/campaignController.js';

const router = express.Router();

router.route('/')
  .get(getCampaigns)
  .post(createCampaign);

router.get('/:id/donors', getCampaignDonors);
router.post('/:id/share', shareCampaign);

router.route('/:id')
  .get(getCampaignById)
  .put(updateCampaign)
  .delete(deleteCampaign);

router.route('/:id/updates')
  .post(addCampaignUpdate);

export default router;

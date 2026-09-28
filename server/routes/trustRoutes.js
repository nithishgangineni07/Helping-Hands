import express from 'express';
import {
  getTrusts,
  getTrustById,
  createTrust,
  updateTrust,
  deleteTrust
} from '../controllers/trustController.js';

const router = express.Router();

router.route('/')
  .get(getTrusts)
  .post(createTrust);

router.route('/:id')
  .get(getTrustById)
  .put(updateTrust)
  .delete(deleteTrust);

export default router;

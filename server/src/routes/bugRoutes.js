import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createBug,
  getBugs,
  getBugById,
  updateBug,
  deleteBug
} from '../controllers/bugController.js';

const router = express.Router();

router.route('/')
  .get(protect, getBugs)
  .post(protect, createBug);

router.route('/:id')
  .get(protect, getBugById)
  .put(protect, updateBug)
  .delete(protect, deleteBug);

export default router;

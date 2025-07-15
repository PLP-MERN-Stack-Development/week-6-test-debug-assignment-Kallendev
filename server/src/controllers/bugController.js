import asyncHandler from 'express-async-handler';
import Bug from '../models/bugModel.js';
import logger from '../utils/logger.js';
import { validateBugInput } from '../utils/validators.js';

// Create bug
export const createBug = asyncHandler(async (req, res) => {
  const { title, description, status, priority } = req.body;

  const validation = validateBugInput({ title, description });
  if (!validation.isValid) {
    logger.warn(`Invalid bug input: ${validation.errors.join(', ')}`, { userId: req.user._id });
    res.status(400);
    throw new Error(validation.errors.join(', '));
  }

  const bug = await Bug.create({
    title,
    description,
    status: status || 'open',
    priority: priority || 'medium',
    createdBy: req.user._id,
  });

  logger.info(`Bug created: ${bug._id}`, { userId: req.user._id });
  res.status(201).json(bug);
});

// Get all bugs
export const getBugs = asyncHandler(async (req, res) => {
  const { status, priority } = req.query;
  const query = { createdBy: req.user._id };
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const bugs = await Bug.find(query).populate('createdBy', 'username');
  logger.info(`Retrieved ${bugs.length} bugs for user ${req.user._id}`);
  res.json(bugs);
});

// Get single bug
export const getBugById = asyncHandler(async (req, res) => {
  const bug = await Bug.findById(req.params.id);
  if (!bug) {
    res.status(404);
    throw new Error('Bug not found');
  }
  if (bug.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this bug');
  }
  res.json(bug);
});

// Update bug
export const updateBug = asyncHandler(async (req, res) => {
  const bug = await Bug.findById(req.params.id);
  if (!bug) {
    res.status(404);
    throw new Error('Bug not found');
  }
  if (bug.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this bug');
  }

  const updatedBug = await Bug.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedAt: Date.now() },
    { new: true }
  ).populate('createdBy', 'username');

  res.json(updatedBug);
});

// Delete bug
export const deleteBug = asyncHandler(async (req, res) => {
  const bug = await Bug.findById(req.params.id);
  if (!bug) {
    res.status(404);
    throw new Error('Bug not found');
  }
  if (bug.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this bug');
  }

  await Bug.deleteOne({ _id: req.params.id });
  res.json({ message: 'Bug removed' });
});

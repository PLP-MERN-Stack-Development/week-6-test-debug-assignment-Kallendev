import express from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400);
      throw new Error('Please provide username and password');
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, password: hashedPassword });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.status(201).json({ user: { id: user._id, username: user.username }, token });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  })
);

// POST /api/auth/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      res.status(200).json({ user: { id: user._id, username: user.username }, token });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  })
);

export default router;

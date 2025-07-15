// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import bugRoutes from './routes/bugRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes); // ✅ Fixed prefix
app.use('/api/bugs', bugRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));

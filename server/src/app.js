const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { errorHandler } = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/bugs', require('./routes/bugRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Error Handler
app.use(errorHandler);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('MongoDB connected'))
  .catch((err) => logger.error('MongoDB connection error', { error: err.message }));

module.exports = app;

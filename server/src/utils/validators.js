import logger from './logger.js';

export const validateBugInput = ({ title, description }) => {
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }

  if (title && title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }

  if (errors.length > 0) {
    logger.debug('Validation errors', { errors });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateUserInput = ({ username, password }) => {
  const errors = [];

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    logger.debug('User validation errors', { errors });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  const errorResponse = {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  logger.error(`Error occurred: ${err.message}`, {
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
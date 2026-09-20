/**
 * Centralized Express error handler.
 * Guarantees a consistent JSON shape across the entire API:
 * { success: false, message: string, errors?: Array }
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  const response = {
    success: false,
    message
  };

  if (err.errors && Array.isArray(err.errors)) {
    response.errors = err.errors;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./src/config/env');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// CORS configuration: restricted to frontend origin
const corsOptions = {
  origin: config.frontendUrl,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// HTTP request logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount all API endpoints
app.use('/api', routes);

// Friendly root route
app.get('/', (req, res) => {
  res.json({
    service: 'NER Landslide Early Warning API',
    status: 'online',
    version: '1.0.0',
    documentation: {
      health: '/api/health',
      weather: '/api/weather/Shillong',
      adminStats: '/api/admin/dashboard/stats',
      sendAlert: '/api/alerts/send (POST)',
      citizenNotify: '/api/citizen/reports/notify (POST)'
    },
    frontendApp: config.frontendUrl
  });
});

// 404 Handler for unmatched routes
app.use((req, res, next) => {
  const error = new Error(`Cannot ${req.method} ${req.originalUrl} - Endpoint not found`);
  error.statusCode = 404;
  next(error);
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;

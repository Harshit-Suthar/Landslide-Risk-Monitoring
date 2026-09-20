const app = require('./app');
const config = require('./src/config/env');

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` NER Landslide Early Warning - Node.js API`);
  console.log(` Server listening on port ${PORT}`);
  console.log(` Allowed Frontend Origin: ${config.frontendUrl}`);
  console.log(` ML Service URL: ${config.mlApiUrl}`);
  console.log(` Environment: ${config.nodeEnv}`);
  console.log(`====================================================`);
});

// Graceful shutdown handling
function handleShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

module.exports = server;

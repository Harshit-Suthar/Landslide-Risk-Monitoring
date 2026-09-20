const axios = require('axios');
const config = require('../config/env');

/**
 * ML Proxy Service
 * Forwards prediction requests to the Python FastAPI ML Service (ml-api).
 */
async function predict({ location_id, lat, lon, rainfall_mm }) {
  try {
    const baseUrl = process.env.ML_API_URL || config.mlApiUrl;
    const url = `${baseUrl}/predict`;
    const response = await axios.post(
      url,
      {
        location_id,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        rainfall_mm: parseFloat(rainfall_mm)
      },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const err = new Error(
        error.response.data?.detail || error.response.data?.message || 'ML service returned an error'
      );
      err.statusCode = error.response.status;
      throw err;
    } else if (error.request) {
      // The request was made but no response was received
      const err = new Error(`ML service unreachable at ${config.mlApiUrl}`);
      err.statusCode = 503;
      throw err;
    } else {
      throw error;
    }
  }
}

module.exports = {
  predict
};

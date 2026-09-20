const weatherProvider = require('../providers/weatherProvider');

/**
 * Weather Controller
 * Shared public/citizen/admin endpoint
 */

/**
 * GET /api/weather/:district
 * Returns current precipitation and 7-day forecast for the given district.
 */
async function getDistrictWeather(req, res, next) {
  try {
    const { district } = req.params;
    const weatherData = await weatherProvider.getWeather(district);
    res.json(weatherData);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDistrictWeather
};

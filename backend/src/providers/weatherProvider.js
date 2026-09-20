/**
 * ============================================================================
 * DATA PROVIDER MODULE: Weather
 * ============================================================================
 * REPLACE THIS FUNCTION BODY ONLY — return shape must stay identical.
 * 
 * When swapping in real meteorological API data (e.g., IMD / OpenWeather / ECMWF),
 * do not alter the exported function signature or returned property keys.
 * 
 * Required Return Shape:
 * {
 *   district: string,
 *   current_rainfall_mm: number,
 *   forecast_7day: Array<{
 *     date: string,        // Format: 'YYYY-MM-DD'
 *     rainfall_mm: number, // Forecasted 24-hr accumulation
 *     condition: string,   // e.g., 'Heavy Rain', 'Light Showers', 'Thunderstorm'
 *     temp_c: number       // Temperature in Celsius
 *   }>
 * }
 * ============================================================================
 */

const { seededRandom } = require('../utils/pseudoRandom');

// Baseline seasonal precipitation profiles for North Eastern Region districts (mm)
const DISTRICT_BASELINES = {
  Shillong: { baseRain: 85.0, baseTemp: 19.5, variance: 35.0 },
  Kohima: { baseRain: 70.0, baseTemp: 21.0, variance: 28.0 },
  Itanagar: { baseRain: 95.0, baseTemp: 24.5, variance: 40.0 },
  Guwahati: { baseRain: 55.0, baseTemp: 28.0, variance: 25.0 },
  Aizawl: { baseRain: 90.0, baseTemp: 22.0, variance: 35.0 },
  Agartala: { baseRain: 45.0, baseTemp: 29.0, variance: 20.0 },
  Imphal: { baseRain: 60.0, baseTemp: 23.0, variance: 24.0 },
  Gangtok: { baseRain: 80.0, baseTemp: 18.0, variance: 30.0 }
};

const DEFAULT_BASELINE = { baseRain: 50.0, baseTemp: 24.0, variance: 25.0 };

const CONDITIONS = [
  'Heavy Rain',
  'Continuous Downpour',
  'Thunderstorm with Rain',
  'Moderate Showers',
  'Light Drizzle',
  'Overcast with Showers'
];

/**
 * Fetches current rainfall and 7-day weather forecast for a given district.
 * @param {string} district - Name of the district (e.g. 'Shillong', 'Aizawl')
 * @returns {Promise<{ district: string, current_rainfall_mm: number, forecast_7day: Array }>}
 */
async function getWeather(district) {
  const normalizedDistrict = district ? district.trim() : 'Unknown';
  const profile = DISTRICT_BASELINES[normalizedDistrict] || DEFAULT_BASELINE;

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];

  // Seed with district name + today's date for realistic day-to-day variance
  const seed = `${normalizedDistrict}-${dateStr}`;
  const dayRnd = seededRandom(seed);

  const currentRainfall = parseFloat(
    Math.max(0, profile.baseRain + (dayRnd * 2 - 1) * profile.variance).toFixed(1)
  );

  const forecast7day = [];
  for (let i = 1; i <= 7; i++) {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i);
    const fDateStr = forecastDate.toISOString().split('T')[0];

    const fSeed = `${normalizedDistrict}-${fDateStr}-${i}`;
    const fRnd = seededRandom(fSeed);
    const condIdx = Math.floor(fRnd * CONDITIONS.length);

    const fRain = parseFloat(
      Math.max(0, profile.baseRain + (fRnd * 2 - 1) * profile.variance * 0.9).toFixed(1)
    );
    const fTemp = parseFloat(
      (profile.baseTemp + (seededRandom(fSeed + '-t') * 4 - 2)).toFixed(1)
    );

    forecast7day.push({
      date: fDateStr,
      rainfall_mm: fRain,
      condition: CONDITIONS[condIdx],
      temp_c: fTemp
    });
  }

  return {
    district: normalizedDistrict,
    current_rainfall_mm: currentRainfall,
    forecast_7day: forecast7day
  };
}

module.exports = {
  getWeather
};

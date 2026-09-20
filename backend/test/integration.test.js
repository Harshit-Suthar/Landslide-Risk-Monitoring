/**
 * End-to-End Integration Test: node-api <-> ml-api
 */
const assert = require('assert');
const { spawn } = require('child_process');
const path = require('path');
const mlProxyService = require('../src/services/mlProxyService');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runIntegration() {
  console.log('--- Starting Integration Test: node-api -> ml-api ---');

  const mlDir = path.resolve(__dirname, '../../ml-services');
  const testPort = 8001;

  process.env.ML_API_URL = `http://127.0.0.1:${testPort}`;

  console.log(`Starting ml-api on port ${testPort}...`);
  const mlProcess = spawn('python', ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', testPort.toString()], {
    cwd: mlDir,
    stdio: 'pipe'
  });

  let startupError = '';
  mlProcess.stderr.on('data', d => {
    startupError += d.toString();
  });
  mlProcess.stdout.on('data', d => {
    // console.log(`[ml-api stdout] ${d}`);
  });

  // Wait for server to boot
  await sleep(3500);

  try {
    console.log('Sending predict request through mlProxyService...');
    const result = await mlProxyService.predict({
      location_id: 'test-loc-shillong-01',
      lat: 25.5682,
      lon: 91.8933,
      rainfall_mm: 85.0
    });

    console.log('Received response from ml-api:', result);
    assert(result.risk_level, 'Response must contain risk_level');
    assert(['Low', 'Medium', 'High', 'Critical'].includes(result.risk_level));
    assert(typeof result.confidence === 'number');
    assert(Array.isArray(result.contributing_factors));
    assert.strictEqual(result.inputs_used.location_id, 'test-loc-shillong-01');
    assert.strictEqual(result.inputs_used.lat, 25.5682);
    assert.strictEqual(result.inputs_used.lon, 91.8933);
    assert.strictEqual(result.inputs_used.rainfall_mm, 85.0);
    assert(typeof result.inputs_used.soil_moisture === 'number');
    assert(typeof result.inputs_used.slope_angle === 'number');
    assert(typeof result.inputs_used.historical_incidents === 'number');

    console.log('--- Integration Test PASSED ---');
  } catch (err) {
    console.error('--- Integration Test FAILED ---', err);
    throw err;
  } finally {
    console.log('Stopping ml-api process...');
    mlProcess.kill();
  }
}

runIntegration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

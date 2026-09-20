/**
 * Automated Verification Test Suite for node-api
 */
const assert = require('assert');
const http = require('http');
const app = require('../app');
const weatherProvider = require('../src/providers/weatherProvider');
const smsProvider = require('../src/providers/smsProvider');
const notificationProvider = require('../src/providers/notificationProvider');

let server;
let baseUrl;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : null;
          resolve({ status: res.statusCode, body: parsed, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, body: data, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- Starting node-api Test Suite ---');
  let passed = 0;
  let failed = 0;

  // 1. Test Providers directly
  try {
    console.log('[Test 1] Testing weatherProvider.getWeather...');
    const weather = await weatherProvider.getWeather('Shillong');
    assert.strictEqual(weather.district, 'Shillong');
    assert.strictEqual(typeof weather.current_rainfall_mm, 'number');
    assert(Array.isArray(weather.forecast_7day));
    assert.strictEqual(weather.forecast_7day.length, 7);
    assert.strictEqual(typeof weather.forecast_7day[0].rainfall_mm, 'number');
    assert.strictEqual(typeof weather.forecast_7day[0].temp_c, 'number');
    console.log('✓ weatherProvider meets required contract');
    passed++;
  } catch (err) {
    console.error('✗ weatherProvider failed:', err.message);
    failed++;
  }

  try {
    console.log('[Test 2] Testing smsProvider.sendSms...');
    const sms = await smsProvider.sendSms('+919876543210', 'Test alert message');
    assert.strictEqual(sms.success, true);
    assert(typeof sms.messageId === 'string' && sms.messageId.startsWith('sms_'));
    console.log('✓ smsProvider meets required contract');
    passed++;
  } catch (err) {
    console.error('✗ smsProvider failed:', err.message);
    failed++;
  }

  try {
    console.log('[Test 3] Testing notificationProvider...');
    const push = await notificationProvider.sendPushNotification('user-123', { title: 'Test Alert' });
    assert.strictEqual(push.success, true);
    assert(typeof push.notificationId === 'string' && push.notificationId.startsWith('push_'));

    const email = await notificationProvider.sendEmail('officer@ner.gov.in', 'Alert', 'Body content');
    assert.strictEqual(email.success, true);
    assert(typeof email.messageId === 'string' && email.messageId.startsWith('email_'));
    console.log('✓ notificationProvider meets required contract');
    passed++;
  } catch (err) {
    console.error('✗ notificationProvider failed:', err.message);
    failed++;
  }

  // 2. Start HTTP server on random port for endpoint testing
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`Test server listening on ${baseUrl}`);
      resolve();
    });
  });

  try {
    console.log('[Test 4] GET /api/health');
    const res = await request('GET', '/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
    console.log('✓ GET /api/health returned status: ok');
    passed++;
  } catch (err) {
    console.error('✗ GET /api/health failed:', err.message);
    failed++;
  }

  try {
    console.log('[Test 5] GET /api/weather/Kohima');
    const res = await request('GET', '/api/weather/Kohima');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.district, 'Kohima');
    assert.strictEqual(typeof res.body.current_rainfall_mm, 'number');
    assert.strictEqual(res.body.forecast_7day.length, 7);
    console.log('✓ GET /api/weather/:district returned valid weather payload');
    passed++;
  } catch (err) {
    console.error('✗ GET /api/weather failed:', err.message);
    failed++;
  }

  try {
    console.log('[Test 6] POST /api/alerts/send (Validation test - missing required fields)');
    const res = await request('POST', '/api/alerts/send', {});
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert(res.body.message.includes('Validation failed'));
    console.log('✓ POST /api/alerts/send caught validation errors');
    passed++;
  } catch (err) {
    console.error('✗ Validation test failed:', err.message);
    failed++;
  }

  try {
    console.log('[Test 7] POST /api/alerts/send (Valid payload)');
    const res = await request('POST', '/api/alerts/send', {
      district: 'Shillong',
      message: 'High risk of landslide along Nongthymmai Ridge. Evacuate immediately.',
      severity: 'Critical'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert(res.body.data.smsResult.success);
    assert(res.body.data.notificationResult.success);
    console.log('✓ POST /api/alerts/send dispatched SMS & notifications');
    passed++;
  } catch (err) {
    console.error('✗ POST /api/alerts/send failed:', err.message);
    failed++;
  }

  try {
    console.log('[Test 8] GET /api/admin/dashboard/stats (Unauthenticated should be 401)');
    const res = await request('GET', '/api/admin/dashboard/stats');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    console.log('✓ Protected admin route correctly rejected unauthenticated request');
    passed++;
  } catch (err) {
    console.error('✗ Admin route auth check failed:', err.message);
    failed++;
  }

  try {
    console.log('[Test 9] POST /api/citizen/reports/notify (Unauthenticated should be 401)');
    const res = await request('POST', '/api/citizen/reports/notify', {
      report_id: 'test-report-uuid',
      district: 'Kohima'
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.body.success, false);
    console.log('✓ Protected citizen route correctly rejected unauthenticated request');
    passed++;
  } catch (err) {
    console.error('✗ Citizen route auth check failed:', err.message);
    failed++;
  }

  // Close server
  await new Promise((resolve) => server.close(resolve));

  console.log(`\n--- Test Summary: ${passed} passed, ${failed} failed ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during tests:', err);
  if (server) server.close();
  process.exit(1);
});

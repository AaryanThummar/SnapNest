// test-pwa.cjs
const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          text: () => buffer.toString('utf8'),
          buffer: () => buffer
        });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('========================================');
  console.log('   LUMABOOTH PWA VALIDATION SUITE');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, name, details = '') {
    if (condition) {
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${name} ${details ? `(${details})` : ''}`);
      failed++;
    }
  }

  try {
    // 1. Check HTML Page
    console.log('[1] Testing HTML Root (http://localhost:3000/)');
    const htmlRes = await fetchUrl('http://localhost:3000/');
    assert(htmlRes.statusCode === 200, 'HTML root returns 200 OK');
    const html = htmlRes.text();
    assert(html.includes('rel="manifest"'), 'HTML contains manifest link tag');
    assert(html.includes('href="/manifest.webmanifest"'), 'HTML references /manifest.webmanifest');
    assert(html.includes('viewport-fit=cover'), 'HTML contains viewport-fit=cover');
    assert(html.includes('theme-color'), 'HTML contains theme-color meta tag');
    assert(html.includes('apple-mobile-web-app-capable'), 'HTML contains apple-mobile-web-app-capable meta tag');
    assert(html.includes('apple-touch-icon'), 'HTML contains apple-touch-icon link');

    // 2. Check Web App Manifest
    console.log('\n[2] Testing Web App Manifest (http://localhost:3000/manifest.webmanifest)');
    const manifestRes = await fetchUrl('http://localhost:3000/manifest.webmanifest');
    assert(manifestRes.statusCode === 200, 'Manifest returns 200 OK');
    const manifest = JSON.parse(manifestRes.text());
    assert(manifest.name === 'LumaBooth', 'Manifest name is "LumaBooth"', `Got: ${manifest.name}`);
    assert(manifest.short_name === 'LumaBooth', 'Manifest short_name is "LumaBooth"');
    assert(manifest.display === 'standalone', 'Manifest display is "standalone"');
    assert(manifest.start_url === '/', 'Manifest start_url is "/"');
    assert(manifest.theme_color === '#090817', 'Manifest theme_color is "#090817"');
    assert(manifest.background_color === '#090817', 'Manifest background_color is "#090817"');
    assert(manifest.orientation === 'portrait-primary', 'Manifest orientation is "portrait-primary"');
    assert(Array.isArray(manifest.icons) && manifest.icons.length >= 4, 'Manifest contains all required icons');
    
    const has192 = manifest.icons.some(i => i.sizes === '192x192' && i.purpose === 'any');
    const has512 = manifest.icons.some(i => i.sizes === '512x512' && i.purpose === 'any');
    const hasMaskable192 = manifest.icons.some(i => i.sizes === '192x192' && i.purpose === 'maskable');
    const hasMaskable512 = manifest.icons.some(i => i.sizes === '512x512' && i.purpose === 'maskable');
    assert(has192, 'Manifest contains 192x192 standard icon');
    assert(has512, 'Manifest contains 512x512 standard icon');
    assert(hasMaskable192, 'Manifest contains 192x192 maskable icon');
    assert(hasMaskable512, 'Manifest contains 512x512 maskable icon');

    // 3. Check Service Worker Script
    console.log('\n[3] Testing Service Worker (http://localhost:3000/sw.js)');
    const swRes = await fetchUrl('http://localhost:3000/sw.js');
    assert(swRes.statusCode === 200, 'Service Worker file returns 200 OK');
    const sw = swRes.text();
    assert(sw.includes('lumabooth-pwa-'), 'Service worker has versioned cache name');
    assert(sw.includes('PRECACHE_ASSETS'), 'Service worker specifies precache assets');
    assert(sw.includes('BYPASS_PATTERNS'), 'Service worker contains explicit API/camera bypass rules');
    assert(sw.includes('skipWaiting'), 'Service worker handles skipWaiting');
    assert(sw.includes('clients.claim'), 'Service worker handles clients.claim');

    // 4. Check PWA Icons
    console.log('\n[4] Testing Icon Assets');
    const icon192 = await fetchUrl('http://localhost:3000/icons/icon-192x192.png');
    assert(icon192.statusCode === 200 && icon192.buffer().length > 1000, 'icon-192x192.png loads correctly');

    const icon512 = await fetchUrl('http://localhost:3000/icons/icon-512x512.png');
    assert(icon512.statusCode === 200 && icon512.buffer().length > 1000, 'icon-512x512.png loads correctly');

    const iconMask = await fetchUrl('http://localhost:3000/icons/icon-maskable-192x192.png');
    assert(iconMask.statusCode === 200 && iconMask.buffer().length > 1000, 'icon-maskable-192x192.png loads correctly');

    const appleIcon = await fetchUrl('http://localhost:3000/icons/apple-touch-icon.png');
    assert(appleIcon.statusCode === 200 && appleIcon.buffer().length > 1000, 'apple-touch-icon.png loads correctly');

    const favicon = await fetchUrl('http://localhost:3000/favicon.svg');
    assert(favicon.statusCode === 200 && favicon.text().includes('<svg'), 'favicon.svg loads correctly');

    console.log('\n========================================');
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log('========================================\n');

    if (failed === 0) {
      console.log('>>> ALL PWA REQUIREMENTS VALIDATED SUCCESSFULLY! <<<');
    }
  } catch (err) {
    console.error('Test Suite Encountered Error:', err);
  }
}

runTests();

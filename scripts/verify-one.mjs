/**
 * verify-one.mjs — Visual verification script for klp-ui components.
 * Usage: node scripts/verify-one.mjs <component> [brand]
 * Brand defaults to spec.captureBrand, then falls back to 'wireframe'.
 * Emits a JSON array to stdout: [{ variantId, passed, diffRatio, diffPath? }]
 */
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const component = process.argv[2];

if (!component) {
  console.error('Usage: node scripts/verify-one.mjs <component> [brand]');
  process.exit(1);
}

const specPath = join(ROOT, '.klp', 'figma-refs', component, 'spec.json');
const spec = JSON.parse(readFileSync(specPath, 'utf-8'));

// Brand resolution: CLI arg > spec.captureBrand > 'wireframe'
const brand = process.argv[3] || spec.captureBrand || 'wireframe';

const verifyJsonPath = join(ROOT, '.klp', 'figma-refs', component, 'verify.json');
let toleranceConfig = { maxDiffPixelRatio: 0.02, perVariant: {} };
if (existsSync(verifyJsonPath)) {
  toleranceConfig = { ...toleranceConfig, ...JSON.parse(readFileSync(verifyJsonPath, 'utf-8')) };
}

const reportsDir = join(ROOT, '.klp', 'verify-reports', component);
mkdirSync(reportsDir, { recursive: true });

// Dynamically import pixelmatch and pngjs
const { default: pixelmatch } = await import('pixelmatch');
const { PNG } = await import('pngjs');

const results = [];

const browser = await chromium.launch({ headless: true });
// deviceScaleFactor: 1 ensures screenshots are 1x CSS pixels, matching Figma 1x exports
const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1
});
const page = await context.newPage();

// Navigate to playground route
await page.goto(`http://localhost:5173/#/${component}`, { waitUntil: 'networkidle' });

// Force brand to match spec.captureBrand before every screenshot
await page.evaluate((b) => {
  document.documentElement.dataset.brand = b;
}, brand);

// Wait for fonts to finish loading (Inter and any other web fonts)
await page.evaluate(() => document.fonts.ready);

// Wait for styles to settle
await page.waitForTimeout(300);

for (const variant of spec.variants) {
  const { id, screenshot } = variant;
  const refPath = join(ROOT, '.klp', 'figma-refs', component, screenshot);

  if (!existsSync(refPath)) {
    results.push({ variantId: id, passed: false, diffRatio: null, error: 'reference-missing' });
    continue;
  }

  // Re-apply brand before each screenshot to ensure consistency
  await page.evaluate((b) => {
    document.documentElement.dataset.brand = b;
  }, brand);

  // Wait for fonts ready before each capture
  await page.evaluate(() => document.fonts.ready);

  // Locate the cell element
  const cell = page.locator(`[data-variant-id="${id}"]`);
  const cellCount = await cell.count();
  if (cellCount === 0) {
    results.push({ variantId: id, passed: false, diffRatio: null, error: 'element-not-found' });
    continue;
  }

  // Capture the first direct child of the cell (the button itself, not the wrapper cell)
  const buttonEl = cell.locator('> *').first();
  const btnCount = await buttonEl.count();
  const targetEl = btnCount > 0 ? buttonEl : cell;

  // Take screenshot of the button element
  const actualBuffer = await targetEl.screenshot({ type: 'png' });

  // Load reference PNG
  const refBuffer = readFileSync(refPath);
  const refPng = PNG.sync.read(refBuffer);
  const actualPng = PNG.sync.read(actualBuffer);

  // Use reference dimensions for comparison
  const width = refPng.width;
  const height = refPng.height;

  // Resize actual to match ref dimensions if needed (nearest-neighbor)
  let actualResized = actualPng;
  if (actualPng.width !== refPng.width || actualPng.height !== refPng.height) {
    actualResized = new PNG({ width, height });
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcX = Math.round((x / width) * (actualPng.width - 1));
        const srcY = Math.round((y / height) * (actualPng.height - 1));
        const srcIdx = (srcY * actualPng.width + srcX) * 4;
        const dstIdx = (y * width + x) * 4;
        actualResized.data[dstIdx] = actualPng.data[srcIdx];
        actualResized.data[dstIdx + 1] = actualPng.data[srcIdx + 1];
        actualResized.data[dstIdx + 2] = actualPng.data[srcIdx + 2];
        actualResized.data[dstIdx + 3] = actualPng.data[srcIdx + 3];
      }
    }
  }

  const diffPng = new PNG({ width, height });
  const numDiffPixels = pixelmatch(
    refPng.data,
    actualResized.data,
    diffPng.data,
    width,
    height,
    { threshold: 0.1 }
  );

  const totalPixels = width * height;
  const diffRatio = numDiffPixels / totalPixels;

  const maxRatio = (toleranceConfig.perVariant && toleranceConfig.perVariant[id] !== undefined)
    ? toleranceConfig.perVariant[id]
    : toleranceConfig.maxDiffPixelRatio;

  const passed = diffRatio <= maxRatio;

  let diffPath = undefined;
  if (!passed) {
    diffPath = join(reportsDir, `${id}.diff.png`);
    writeFileSync(diffPath, PNG.sync.write(diffPng));
    // Also save actual screenshot for debugging
    writeFileSync(join(reportsDir, `${id}.actual.png`), actualBuffer);
  }

  results.push({
    variantId: id,
    passed,
    diffRatio: Math.round(diffRatio * 10000) / 10000,
    ...(diffPath ? { diffPath } : {}),
    ...(actualPng.width !== refPng.width || actualPng.height !== refPng.height
      ? { sizeMismatch: { actual: { w: actualPng.width, h: actualPng.height }, ref: { w: refPng.width, h: refPng.height } } }
      : {})
  });
}

await browser.close();

console.log(JSON.stringify(results, null, 2));

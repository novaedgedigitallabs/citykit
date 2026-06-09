/**
 * Data Conversion Script
 *
 * Reads worldcities.xlsx and produces:
 *   - data/cities.json     (all cities, array-of-arrays format)
 *   - data/cities-lite.json (cities with population >= 500,000)
 *   - data/columns.json    (column index map)
 */

import { readFileSync, writeFileSync, mkdirSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

// Ensure data directory exists
const dataDir = resolve(ROOT, 'data');
mkdirSync(dataDir, { recursive: true });

// ── Column order ──────────────────────────────────────────────
const COLUMN_ORDER = [
  'city',
  'city_ascii',
  'lat',
  'lng',
  'country',
  'iso2',
  'iso3',
  'admin_name',
  'capital',
  'population',
  'id',
];

const columnsMap = Object.fromEntries(COLUMN_ORDER.map((col, i) => [col, i]));

// ── Read XLSX ─────────────────────────────────────────────────
console.log('📖 Reading worldcities.xlsx...');
const xlsxPath = resolve(ROOT, 'worldcities.xlsx');
const workbook = XLSX.readFile(xlsxPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

console.log(`   Found ${rows.length} rows in sheet "${sheetName}"`);

// ── Convert to array-of-arrays ────────────────────────────────
function rowToArray(row) {
  return COLUMN_ORDER.map((col) => {
    let val = row[col];

    // Numeric fields
    if (col === 'lat' || col === 'lng') {
      return val !== '' && val != null ? Number(val) : 0;
    }
    if (col === 'population') {
      return val !== '' && val != null ? Number(val) : null;
    }
    if (col === 'id') {
      return val !== '' && val != null ? Number(val) : 0;
    }

    // Capital normalization
    if (col === 'capital') {
      if (val === 'primary' || val === 'admin' || val === 'minor') return val;
      return null;
    }

    // String fields
    return val != null ? String(val) : '';
  });
}

const allCities = rows.map(rowToArray);
const liteCities = allCities.filter((row) => {
  const pop = row[columnsMap.population];
  return pop != null && pop >= 500000;
});

// ── Write output files ────────────────────────────────────────
console.log('💾 Writing data files...');

const citiesPath = resolve(dataDir, 'cities.json');
const litePath = resolve(dataDir, 'cities-lite.json');
const columnsPath = resolve(dataDir, 'columns.json');

writeFileSync(citiesPath, JSON.stringify(allCities));
writeFileSync(litePath, JSON.stringify(liteCities));
writeFileSync(columnsPath, JSON.stringify(columnsMap, null, 2));

// ── Stats ─────────────────────────────────────────────────────
function fileSize(path) {
  const bytes = statSync(path).size;
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(2)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
}

console.log('');
console.log('✅ Conversion complete!');
console.log('');
console.log('┌─────────────────────────────────────────────┐');
console.log('│  📊 Dataset Statistics                      │');
console.log('├─────────────────────────────────────────────┤');
console.log(`│  Total cities:    ${String(allCities.length).padStart(8)}               │`);
console.log(`│  Lite cities:     ${String(liteCities.length).padStart(8)}               │`);
console.log(`│  cities.json:     ${fileSize(citiesPath).padStart(8)}               │`);
console.log(`│  cities-lite.json:${fileSize(litePath).padStart(8)}               │`);
console.log(`│  columns.json:    ${fileSize(columnsPath).padStart(8)}               │`);
console.log('└─────────────────────────────────────────────┘');

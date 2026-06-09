import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { City, ColumnMap } from './types.js';

// Column index map
const COLUMNS: ColumnMap = {
  city: 0,
  city_ascii: 1,
  lat: 2,
  lng: 3,
  country: 4,
  iso2: 5,
  iso3: 6,
  admin_name: 7,
  capital: 8,
  population: 9,
  id: 10,
};

let cachedCities: City[] | null = null;
let cachedRaw: unknown[][] | null = null;

/**
 * Resolve path to data file relative to this module.
 * Works in both CJS and ESM contexts.
 */
function resolveDataPath(filename: string): string {
  // In bundled context, __dirname is available (CJS) or we derive it (ESM)
  let dir: string;
  try {
    // ESM
    dir = dirname(fileURLToPath(import.meta.url));
  } catch {
    // CJS fallback
    dir = __dirname;
  }
  return resolve(dir, '..', 'data', filename);
}

/**
 * Parse a raw array-format row into a City object.
 */
function parseRow(row: unknown[]): City {
  const capitalVal = row[COLUMNS.capital] as string | null | undefined;
  let capital: City['capital'] = null;
  if (capitalVal === 'primary' || capitalVal === 'admin' || capitalVal === 'minor') {
    capital = capitalVal;
  }

  const popVal = row[COLUMNS.population];
  const population = popVal != null && popVal !== '' ? Number(popVal) : null;

  return {
    city: String(row[COLUMNS.city] ?? ''),
    city_ascii: String(row[COLUMNS.city_ascii] ?? ''),
    lat: Number(row[COLUMNS.lat]),
    lng: Number(row[COLUMNS.lng]),
    country: String(row[COLUMNS.country] ?? ''),
    iso2: String(row[COLUMNS.iso2] ?? ''),
    iso3: String(row[COLUMNS.iso3] ?? ''),
    admin_name: String(row[COLUMNS.admin_name] ?? ''),
    capital,
    population,
    id: Number(row[COLUMNS.id]),
  };
}

/**
 * Load and parse cities from the specified JSON file.
 * Uses lazy loading — data is loaded on first call and cached.
 */
function loadCities(filename: string): { raw: unknown[][]; cities: City[] } {
  const filePath = resolveDataPath(filename);
  const content = readFileSync(filePath, 'utf-8');
  const raw: unknown[][] = JSON.parse(content);
  const cities = raw.map(parseRow);
  return { raw, cities };
}

/**
 * Get parsed City objects (full dataset). Lazy-loaded and cached.
 */
export function getCities(): City[] {
  if (!cachedCities) {
    const result = loadCities('cities.json');
    cachedCities = result.cities;
    cachedRaw = result.raw;
  }
  return cachedCities;
}

/**
 * Get raw array-format data (full dataset). Lazy-loaded and cached.
 */
export function getCitiesRaw(): unknown[][] {
  if (!cachedRaw) {
    const result = loadCities('cities.json');
    cachedCities = result.cities;
    cachedRaw = result.raw;
  }
  return cachedRaw;
}

// ── Lite variants ──────────────────────────────────────────────

let cachedLiteCities: City[] | null = null;
let cachedLiteRaw: unknown[][] | null = null;

export function getLiteCities(): City[] {
  if (!cachedLiteCities) {
    const result = loadCities('cities-lite.json');
    cachedLiteCities = result.cities;
    cachedLiteRaw = result.raw;
  }
  return cachedLiteCities;
}

export function getLiteCitiesRaw(): unknown[][] {
  if (!cachedLiteRaw) {
    const result = loadCities('cities-lite.json');
    cachedLiteCities = result.cities;
    cachedLiteRaw = result.raw;
  }
  return cachedLiteRaw;
}

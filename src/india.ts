/**
 * India-specific utility functions.
 * All functions use the full citykit dataset filtered to ISO2 = 'IN'.
 *
 * Tier classification thresholds (based on population):
 *   Tier 1 — population >= 4,000,000  (mega cities: Mumbai, Delhi, Bangalore...)
 *   Tier 2 — population >= 500,000    (large cities: Indore, Patna, Vadodara...)
 *   Tier 3 — everything else          (smaller cities and towns)
 */
import { getCities } from './data.js';
import type { City, IndianCityTier } from './types.js';

const TIER1_THRESHOLD = 4_000_000;
const TIER2_THRESHOLD = 500_000;

/**
 * Strip diacritical marks (e.g. ā → a, ū → u) for fuzzy state-name matching.
 * The dataset stores some state names in Anglicized diacritic form
 * e.g. "Mahārāshtra", "Karnātaka".
 */
function stripDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/**
 * Get all Indian cities (7,200+ cities).
 * Equivalent to byCountry('IN') but explicitly documented.
 */
export function getIndianCities(): City[] {
  return getCities().filter((c) => c.iso2 === 'IN');
}

/**
 * Get cities in a specific Indian state/UT.
 * Case-insensitive partial match on admin_name.
 * Results sorted by population descending (nulls at end).
 *
 * Note: The dataset uses diacritical forms for some state names
 * (e.g. "Mahārāshtra", "Karnātaka"). Partial match handles this —
 * searching "Maharashtra" or "Mahār" both work.
 *
 * @param state - Full or partial state name (e.g. "Maharashtra", "UP", "Tamil")
 */
export function getCitiesByState(state: string): City[] {
  const stateNorm = stripDiacritics(state);
  const results = getCities().filter(
    (c) => c.iso2 === 'IN' && stripDiacritics(c.admin_name).includes(stateNorm)
  );

  results.sort((a, b) => {
    if (a.population === null && b.population === null) return 0;
    if (a.population === null) return 1;
    if (b.population === null) return -1;
    return b.population - a.population;
  });

  return results;
}

/**
 * Classify an Indian city's tier based on population.
 * Returns null if the city is not found or has no population data.
 *
 * Tier 1: population >= 4,000,000  (mega/metro cities)
 * Tier 2: population >= 500,000    (large cities)
 * Tier 3: population < 500,000     (smaller cities & towns)
 *
 * @param cityName - Exact city name (ASCII), case-insensitive
 */
export function getCityTier(cityName: string): IndianCityTier | null {
  const nameLower = cityName.toLowerCase();

  // Among duplicates, pick the Indian city with highest population
  const matches = getCities().filter(
    (c) => c.iso2 === 'IN' && c.city_ascii.toLowerCase() === nameLower
  );

  if (matches.length === 0) return null;

  const city = matches.reduce((best, c) =>
    (c.population ?? 0) > (best.population ?? 0) ? c : best
  );

  if (city.population === null) return null;
  if (city.population >= TIER1_THRESHOLD) return 'Tier 1';
  if (city.population >= TIER2_THRESHOLD) return 'Tier 2';
  return 'Tier 3';
}

/**
 * Get all Indian state/UT names available in the dataset.
 * Returns unique admin_name values, sorted alphabetically.
 */
export function getIndianStates(): string[] {
  const states = new Set<string>();
  for (const c of getCities()) {
    if (c.iso2 === 'IN' && c.admin_name) {
      states.add(c.admin_name);
    }
  }
  return Array.from(states).sort((a, b) => a.localeCompare(b));
}

/**
 * Get the tier classification thresholds used by getCityTier().
 */
export function getTierThresholds(): { tier1: number; tier2: number } {
  return { tier1: TIER1_THRESHOLD, tier2: TIER2_THRESHOLD };
}

import { getLiteCities } from './data.js';
import { haversine } from './haversine.js';
import type {
  City,
  SearchOptions,
  NearestOptions,
  DistanceResult,
  CountryInfo,
  CountryListItem,
} from './types.js';

// Re-export types for consumers
export type {
  City,
  SearchOptions,
  NearestOptions,
  DistanceResult,
  CountryInfo,
  CountryListItem,
};

/**
 * Search cities by name (lite dataset — cities with population >= 500,000).
 */
export function search(query: string, options: SearchOptions = {}): City[] {
  const { country, limit = 10, exact = false } = options;
  const cities = getLiteCities();
  const q = query.toLowerCase();
  const countryFilter = country?.toUpperCase();

  let results: City[];

  if (exact) {
    results = cities.filter((c) => {
      if (countryFilter && c.iso2.toUpperCase() !== countryFilter) return false;
      return c.city_ascii.toLowerCase() === q;
    });
  } else {
    results = cities.filter((c) => {
      if (countryFilter && c.iso2.toUpperCase() !== countryFilter) return false;
      return c.city_ascii.toLowerCase().includes(q);
    });

    results.sort((a, b) => {
      const aLower = a.city_ascii.toLowerCase();
      const bLower = b.city_ascii.toLowerCase();

      const aExact = aLower === q;
      const bExact = bLower === q;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      const aStarts = aLower.startsWith(q);
      const bStarts = bLower.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      return 0;
    });
  }

  return results.slice(0, limit);
}

/**
 * Get all cities for a given country ISO2 code (lite dataset).
 */
export function byCountry(iso2: string): City[] {
  const code = iso2.toUpperCase();
  return getLiteCities().filter((c) => c.iso2.toUpperCase() === code);
}

/**
 * Get capital cities (lite dataset).
 */
export function capitals(iso2?: string): City[] {
  const cities = getLiteCities();

  if (iso2) {
    const code = iso2.toUpperCase();
    return cities.filter(
      (c) =>
        c.iso2.toUpperCase() === code &&
        (c.capital === 'primary' || c.capital === 'admin')
    );
  }

  return cities.filter((c) => c.capital === 'primary');
}

/**
 * Find nearest cities using Haversine formula (lite dataset).
 */
export function nearest(
  coords: { lat: number; lng: number },
  options: NearestOptions = {}
): City[] {
  const { limit = 1, country } = options;
  const cities = getLiteCities();
  const countryFilter = country?.toUpperCase();

  let pool = cities;
  if (countryFilter) {
    pool = cities.filter((c) => c.iso2.toUpperCase() === countryFilter);
  }

  const withDistance = pool.map((c) => ({
    city: c,
    dist: haversine(coords.lat, coords.lng, c.lat, c.lng),
  }));

  withDistance.sort((a, b) => a.dist - b.dist);

  return withDistance.slice(0, limit).map((d) => d.city);
}

/**
 * Calculate distance between two cities or coordinate pairs (lite dataset).
 */
export function distance(
  from: string | { lat: number; lng: number },
  to: string | { lat: number; lng: number }
): DistanceResult | null {
  const resolveCoords = (
    input: string | { lat: number; lng: number }
  ): { lat: number; lng: number } | null => {
    if (typeof input === 'object') return input;
    const city = getLiteCities().find(
      (c) => c.city_ascii.toLowerCase() === input.toLowerCase()
    );
    return city ? { lat: city.lat, lng: city.lng } : null;
  };

  const fromCoords = resolveCoords(from);
  const toCoords = resolveCoords(to);

  if (!fromCoords || !toCoords) return null;

  const km = haversine(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng);
  const miles = km * 0.621371;

  return {
    km: Math.round(km * 100) / 100,
    miles: Math.round(miles * 100) / 100,
  };
}

/**
 * Get country info and all its cities by ISO2 code (lite dataset).
 */
export function getByIso2(iso2: string): CountryInfo | null {
  const code = iso2.toUpperCase();
  const cities = getLiteCities().filter((c) => c.iso2.toUpperCase() === code);

  if (cities.length === 0) return null;

  return {
    country: cities[0].country,
    iso2: cities[0].iso2,
    iso3: cities[0].iso3,
    cities,
  };
}

/**
 * Get a single city by exact name (lite dataset).
 */
export function getCity(name: string, iso2?: string): City | null {
  const nameLower = name.toLowerCase();
  const countryFilter = iso2?.toUpperCase();

  const city = getLiteCities().find((c) => {
    if (countryFilter && c.iso2.toUpperCase() !== countryFilter) return false;
    return c.city_ascii.toLowerCase() === nameLower;
  });

  return city ?? null;
}

/**
 * List all unique countries with city counts (lite dataset).
 */
export function listCountries(): CountryListItem[] {
  const cities = getLiteCities();
  const map = new Map<string, { country: string; iso2: string; iso3: string; count: number }>();

  for (const c of cities) {
    const key = c.iso2.toUpperCase();
    const existing = map.get(key);
    if (existing) {
      existing.count++;
    } else {
      map.set(key, {
        country: c.country,
        iso2: c.iso2,
        iso3: c.iso3,
        count: 1,
      });
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.country.localeCompare(b.country)
  );
}

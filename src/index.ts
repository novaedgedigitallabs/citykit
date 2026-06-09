import { getCities } from './data.js';
import { haversine } from './haversine.js';
import { levenshtein } from './levenshtein.js';
import { getContinentCodes } from './continents.js';
import type {
  City,
  SearchOptions,
  NearestOptions,
  DistanceResult,
  CountryInfo,
  CountryListItem,
  PopulationOptions,
  FuzzySearchOptions,
  RandomOptions,
  DatasetStats,
} from './types.js';

// Re-export types for consumers
export type {
  City,
  SearchOptions,
  NearestOptions,
  DistanceResult,
  CountryInfo,
  CountryListItem,
  PopulationOptions,
  FuzzySearchOptions,
  RandomOptions,
  DatasetStats,
};


/**
 * Search cities by name.
 *
 * Case-insensitive substring match on `city_ascii`.
 * Results are sorted: exact matches → starts-with → contains.
 *
 * @param query - City name to search for
 * @param options - Search options (country filter, limit, exact match)
 * @returns Array of matching cities
 */
export function search(query: string, options: SearchOptions = {}): City[] {
  const { country, limit = 10, exact = false } = options;
  const cities = getCities();
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

    // Sort: exact → starts-with → contains
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
 * Get all cities for a given country ISO2 code.
 *
 * @param iso2 - Two-letter country code (case-insensitive)
 * @returns Array of cities in that country
 */
export function byCountry(iso2: string): City[] {
  const code = iso2.toUpperCase();
  return getCities().filter((c) => c.iso2.toUpperCase() === code);
}

/**
 * Get capital cities.
 *
 * - If `iso2` is provided: returns cities where capital is "primary" OR "admin" for that country
 * - If no `iso2`: returns only national capitals (capital === "primary") worldwide
 *
 * @param iso2 - Optional country ISO2 code
 * @returns Array of capital cities
 */
export function capitals(iso2?: string): City[] {
  const cities = getCities();

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
 * Find the nearest city/cities to given coordinates using the Haversine formula.
 *
 * @param coords - Target coordinates { lat, lng }
 * @param options - Options: limit (default 1), country filter
 * @returns Array of nearest cities
 */
export function nearest(
  coords: { lat: number; lng: number },
  options: NearestOptions = {}
): City[] {
  const { limit = 1, country } = options;
  const cities = getCities();
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
 * Calculate distance between two cities or coordinate pairs.
 *
 * Accepts city names (matched by `city_ascii` exact match) or { lat, lng } objects.
 *
 * @param from - Source city name or coordinates
 * @param to - Destination city name or coordinates
 * @returns Distance in km and miles, or null if a city name wasn't found
 */
export function distance(
  from: string | { lat: number; lng: number },
  to: string | { lat: number; lng: number }
): DistanceResult | null {
  const resolveCoords = (
    input: string | { lat: number; lng: number }
  ): { lat: number; lng: number } | null => {
    if (typeof input === 'object') return input;
    const city = getCities().find(
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
 * Get country info and all its cities by ISO2 code.
 *
 * @param iso2 - Two-letter country code
 * @returns Country info with cities, or null if not found
 */
export function getByIso2(iso2: string): CountryInfo | null {
  const code = iso2.toUpperCase();
  const cities = getCities().filter((c) => c.iso2.toUpperCase() === code);

  if (cities.length === 0) return null;

  return {
    country: cities[0].country,
    iso2: cities[0].iso2,
    iso3: cities[0].iso3,
    cities,
  };
}

/**
 * Get a single city by exact name (city_ascii), optionally filtered by country.
 *
 * @param name - Exact city name (case-insensitive)
 * @param iso2 - Optional country ISO2 code filter
 * @returns The city, or null if not found
 */
export function getCity(name: string, iso2?: string): City | null {
  const nameLower = name.toLowerCase();
  const countryFilter = iso2?.toUpperCase();

  const city = getCities().find((c) => {
    if (countryFilter && c.iso2.toUpperCase() !== countryFilter) return false;
    return c.city_ascii.toLowerCase() === nameLower;
  });

  return city ?? null;
}

/**
 * List all unique countries with city counts, sorted alphabetically by name.
 *
 * @returns Array of country entries with counts
 */
export function listCountries(): CountryListItem[] {
  const cities = getCities();
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

/**
 * Get cities filtered by population range.
 *
 * @param options - Population filter options (min, max, sort, limit)
 * @returns Filtered and sorted cities
 */
export function byPopulation(options: PopulationOptions): City[] {
  const { min, max, sort = 'desc', limit } = options;
  const cities = getCities();

  const filtered = cities.filter((c) => {
    if (c.population === null) return false;
    if (c.population < min) return false;
    if (max !== undefined && c.population > max) return false;
    return true;
  });

  filtered.sort((a, b) => {
    const popA = a.population ?? 0;
    const popB = b.population ?? 0;
    return sort === 'asc' ? popA - popB : popB - popA;
  });

  if (limit !== undefined) {
    return filtered.slice(0, limit);
  }
  return filtered;
}

/**
 * Get cities by continent name (case-insensitive).
 *
 * @param continent - Continent name (e.g. "Asia", "Europe")
 * @returns Array of cities in the continent
 */
export function byContinent(continent: string): City[] {
  const codes = getContinentCodes(continent);
  if (!codes) return [];
  return getCities().filter((c) => codes.has(c.iso2.toUpperCase()));
}

/**
 * Fuzzy search cities by name using Levenshtein distance.
 *
 * Case-insensitive search on `city_ascii`. Results are sorted by Levenshtein distance
 * (ascending), then by population (descending).
 *
 * @param query - Typo-prone city name query
 * @param options - Fuzzy search options (country, limit, threshold)
 * @returns Array of matches within threshold
 */
export function fuzzySearch(query: string, options: FuzzySearchOptions = {}): City[] {
  const { country, limit = 10, threshold = 3 } = options;
  const cities = getCities();
  const q = query.toLowerCase().trim();
  const countryFilter = country?.toUpperCase();

  if (!q) return [];

  const results: { city: City; dist: number }[] = [];

  for (const c of cities) {
    if (countryFilter && c.iso2.toUpperCase() !== countryFilter) continue;

    const cityLower = c.city_ascii.toLowerCase();
    const dist = levenshtein(q, cityLower);

    if (dist <= threshold) {
      results.push({ city: c, dist });
    }
  }

  // Sort by distance (asc), then population (desc)
  results.sort((a, b) => {
    if (a.dist !== b.dist) return a.dist - b.dist;
    const popA = a.city.population ?? 0;
    const popB = b.city.population ?? 0;
    return popB - popA;
  });

  return results.slice(0, limit).map((r) => r.city);
}

/**
 * Get a random city from the dataset, optionally filtered by country or continent.
 *
 * @param options - Filter options
 * @returns A random city, or null if no cities match filters
 */
export function random(options: RandomOptions = {}): City | null {
  const { country, continent } = options;
  let pool = getCities();

  if (country) {
    const code = country.toUpperCase();
    pool = pool.filter((c) => c.iso2.toUpperCase() === code);
  }

  if (continent) {
    const codes = getContinentCodes(continent);
    if (!codes) return null;
    pool = pool.filter((c) => codes.has(c.iso2.toUpperCase()));
  }

  if (pool.length === 0) return null;

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

/**
 * Get aggregated dataset statistics.
 *
 * @returns Statistics of the dataset
 */
export function stats(): DatasetStats {
  const cities = getCities();

  const totalCities = cities.length;
  const countriesSet = new Set<string>();
  let totalCapitals = 0;
  let largestCity: City | null = null;
  let smallestCity: City | null = null;
  let totalPopulation = 0;
  let validPopulationCount = 0;

  for (const c of cities) {
    countriesSet.add(c.iso2.toUpperCase());
    if (c.capital === 'primary') {
      totalCapitals++;
    }

    if (c.population !== null) {
      totalPopulation += c.population;
      validPopulationCount++;

      if (!largestCity || c.population > (largestCity.population ?? 0)) {
        largestCity = c;
      }
      if (!smallestCity || c.population < (smallestCity.population ?? Infinity)) {
        smallestCity = c;
      }
    }
  }

  // Fallback in case of empty or all-null dataset
  const defaultCity: City = cities[0] || {
    city: '',
    city_ascii: '',
    lat: 0,
    lng: 0,
    country: '',
    iso2: '',
    iso3: '',
    admin_name: '',
    capital: null,
    population: null,
    id: 0,
  };

  return {
    totalCities,
    totalCountries: countriesSet.size,
    totalCapitals,
    largestCity: largestCity ?? defaultCity,
    smallestCity: smallestCity ?? defaultCity,
    averagePopulation: validPopulationCount > 0 ? totalPopulation / validPopulationCount : 0,
    totalPopulation,
  };
}


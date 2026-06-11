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
  WithinRadiusOptions,
  AutocompleteOptions,
} from './types.js';

/**
 * Factory: search cities by name.
 * Case-insensitive substring match on `city_ascii`.
 * Results sorted: exact → starts-with → contains.
 */
export function createSearch(getCitiesFn: () => City[]) {
  return function search(query: string, options: SearchOptions = {}): City[] {
    if (!query || query.trim() === '') return [];

    const { country, limit = 10, exact = false } = options;
    const cities = getCitiesFn();
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
  };
}

/**
 * Factory: get all cities for a given country ISO2 code.
 */
export function createByCountry(getCitiesFn: () => City[]) {
  return function byCountry(iso2: string): City[] {
    const code = iso2.toUpperCase();
    return getCitiesFn().filter((c) => c.iso2.toUpperCase() === code);
  };
}

/**
 * Factory: get capital cities.
 * Without iso2: returns national capitals (primary) worldwide.
 * With iso2: returns primary + admin capitals for that country.
 */
export function createCapitals(getCitiesFn: () => City[]) {
  return function capitals(iso2?: string): City[] {
    const cities = getCitiesFn();

    if (iso2) {
      const code = iso2.toUpperCase();
      return cities.filter(
        (c) =>
          c.iso2.toUpperCase() === code &&
          (c.capital === 'primary' || c.capital === 'admin')
      );
    }

    return cities.filter((c) => c.capital === 'primary');
  };
}

/**
 * Factory: find nearest cities to coordinates using Haversine formula.
 */
export function createNearest(getCitiesFn: () => City[]) {
  return function nearest(
    coords: { lat: number; lng: number },
    options: NearestOptions = {}
  ): City[] {
    const { limit = 1, country } = options;
    const cities = getCitiesFn();
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
  };
}

/**
 * Resolve a city name string to coordinates.
 * Picks highest-population city on name collision.
 */
function resolveCoordsFromCities(
  input: string | { lat: number; lng: number },
  cities: City[]
): { lat: number; lng: number } | null {
  if (typeof input === 'object') return input;

  const nameLower = input.toLowerCase();
  const matches = cities.filter(
    (c) => c.city_ascii.toLowerCase() === nameLower
  );

  if (matches.length === 0) return null;

  // Pick highest-population city on name collision
  if (matches.length > 1) {
    matches.sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
  }

  return { lat: matches[0].lat, lng: matches[0].lng };
}

/**
 * Factory: calculate distance between two cities or coordinate pairs.
 * When a string is passed, picks the highest-population city on duplicate name collision.
 */
export function createDistance(getCitiesFn: () => City[]) {
  return function distance(
    from: string | { lat: number; lng: number },
    to: string | { lat: number; lng: number }
  ): DistanceResult | null {
    const cities = getCitiesFn();
    const fromCoords = resolveCoordsFromCities(from, cities);
    const toCoords = resolveCoordsFromCities(to, cities);

    if (!fromCoords || !toCoords) return null;

    const km = haversine(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng);
    const miles = km * 0.621371;

    return {
      km: Math.round(km * 100) / 100,
      miles: Math.round(miles * 100) / 100,
    };
  };
}

/**
 * Factory: get country info and all its cities by ISO2 code.
 */
export function createGetByIso2(getCitiesFn: () => City[]) {
  return function getByIso2(iso2: string): CountryInfo | null {
    const code = iso2.toUpperCase();
    const cities = getCitiesFn().filter((c) => c.iso2.toUpperCase() === code);

    if (cities.length === 0) return null;

    return {
      country: cities[0].country,
      iso2: cities[0].iso2,
      iso3: cities[0].iso3,
      cities,
    };
  };
}

/**
 * Factory: get a single city by exact name, optionally filtered by country.
 */
export function createGetCity(getCitiesFn: () => City[]) {
  return function getCity(name: string, iso2?: string): City | null {
    const nameLower = name.toLowerCase();
    const countryFilter = iso2?.toUpperCase();

    const city = getCitiesFn().find((c) => {
      if (countryFilter && c.iso2.toUpperCase() !== countryFilter) return false;
      return c.city_ascii.toLowerCase() === nameLower;
    });

    return city ?? null;
  };
}

/**
 * Factory: list all unique countries with city counts, sorted alphabetically.
 */
export function createListCountries(getCitiesFn: () => City[]) {
  return function listCountries(): CountryListItem[] {
    const cities = getCitiesFn();
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
  };
}

/**
 * Factory: get cities filtered by population range.
 */
export function createByPopulation(getCitiesFn: () => City[]) {
  return function byPopulation(options: PopulationOptions): City[] {
    const { min, max, sort = 'desc', limit } = options;
    const cities = getCitiesFn();

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
  };
}

/**
 * Factory: get cities by continent name (case-insensitive).
 */
export function createByContinent(getCitiesFn: () => City[]) {
  return function byContinent(continent: string): City[] {
    const codes = getContinentCodes(continent);
    if (!codes) return [];
    return getCitiesFn().filter((c) => codes.has(c.iso2.toUpperCase()));
  };
}

/**
 * Factory: fuzzy search cities by name using Levenshtein distance.
 */
export function createFuzzySearch(getCitiesFn: () => City[]) {
  return function fuzzySearch(query: string, options: FuzzySearchOptions = {}): City[] {
    const { country, limit = 10, threshold = 3 } = options;
    const cities = getCitiesFn();
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

    results.sort((a, b) => {
      if (a.dist !== b.dist) return a.dist - b.dist;
      const popA = a.city.population ?? 0;
      const popB = b.city.population ?? 0;
      return popB - popA;
    });

    return results.slice(0, limit).map((r) => r.city);
  };
}

/**
 * Factory: get a random city, optionally filtered by country or continent.
 */
export function createRandom(getCitiesFn: () => City[]) {
  return function random(options: RandomOptions = {}): City | null {
    const { country, continent } = options;
    let pool = getCitiesFn();

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
  };
}

/**
 * Factory: get aggregated dataset statistics.
 */
export function createStats(getCitiesFn: () => City[]) {
  return function stats(): DatasetStats {
    const cities = getCitiesFn();

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
  };
}

/**
 * Factory: find all cities within a given radius (km) of coordinates.
 * Results sorted by distance ascending (nearest first).
 */
export function createWithinRadius(getCitiesFn: () => City[]) {
  return function withinRadius(
    coords: { lat: number; lng: number },
    radiusKm: number,
    options: WithinRadiusOptions = {}
  ): City[] {
    const { country, limit } = options;
    const cities = getCitiesFn();
    const countryFilter = country?.toUpperCase();

    let pool = cities;
    if (countryFilter) {
      pool = cities.filter((c) => c.iso2.toUpperCase() === countryFilter);
    }

    const withinRange: { city: City; dist: number }[] = [];

    for (const c of pool) {
      const dist = haversine(coords.lat, coords.lng, c.lat, c.lng);
      if (dist <= radiusKm) {
        withinRange.push({ city: c, dist });
      }
    }

    withinRange.sort((a, b) => a.dist - b.dist);

    const results = withinRange.map((r) => r.city);
    if (limit !== undefined) {
      return results.slice(0, limit);
    }
    return results;
  };
}

/**
 * Factory: filter cities by admin_name (state/province).
 * Case-insensitive substring match. Sorted by population descending (nulls at end).
 */
export function createByAdmin(getCitiesFn: () => City[]) {
  return function byAdmin(adminName: string, iso2?: string): City[] {
    const cities = getCitiesFn();
    const adminLower = adminName.toLowerCase();
    const countryFilter = iso2?.toUpperCase();

    const filtered = cities.filter((c) => {
      if (countryFilter && c.iso2.toUpperCase() !== countryFilter) return false;
      return c.admin_name.toLowerCase().includes(adminLower);
    });

    filtered.sort((a, b) => {
      // Null population goes to end
      if (a.population === null && b.population === null) return 0;
      if (a.population === null) return 1;
      if (b.population === null) return -1;
      return b.population - a.population;
    });

    return filtered;
  };
}

/**
 * Factory: autocomplete for form inputs.
 * Thin wrapper over search() with a minChars guard — returns [] if query is
 * shorter than the threshold, preventing unnecessary processing on first keystrokes.
 * Results sorted: exact → starts-with → contains (same as search()).
 */
export function createAutocomplete(getCitiesFn: () => City[]) {
  const searchFn = createSearch(getCitiesFn);

  return function autocomplete(query: string, options: AutocompleteOptions = {}): City[] {
    const { minChars = 1, country, limit = 10 } = options;
    const trimmed = query.trim();

    if (trimmed.length < minChars) return [];

    return searchFn(trimmed, { country, limit });
  };
}

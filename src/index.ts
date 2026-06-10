import { getCities } from './data.js';
import {
  createSearch,
  createByCountry,
  createCapitals,
  createNearest,
  createDistance,
  createGetByIso2,
  createGetCity,
  createListCountries,
  createByPopulation,
  createByContinent,
  createFuzzySearch,
  createRandom,
  createStats,
  createWithinRadius,
  createByAdmin,
} from './core.js';
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
  WithinRadiusOptions,
};

// Re-export getContinentNames for consumers
export { getContinentNames } from './continents.js';

// ── Bind all factory functions to the full dataset ──

/** Search cities by name. Case-insensitive substring match on `city_ascii`. */
export const search = createSearch(getCities);

/** Get all cities for a given country ISO2 code. */
export const byCountry = createByCountry(getCities);

/** Get capital cities. Without iso2: national capitals worldwide. With iso2: primary + admin. */
export const capitals = createCapitals(getCities);

/** Find nearest cities to coordinates using Haversine formula. */
export const nearest = createNearest(getCities);

/** Calculate distance between two cities or coordinate pairs. Picks highest-population city on name collision. */
export const distance = createDistance(getCities);

/** Get country info and all its cities by ISO2 code. */
export const getByIso2 = createGetByIso2(getCities);

/** Get a single city by exact name, optionally filtered by country. */
export const getCity = createGetCity(getCities);

/** List all unique countries with city counts, sorted alphabetically. */
export const listCountries = createListCountries(getCities);

/** Get cities filtered by population range. */
export const byPopulation = createByPopulation(getCities);

/** Get cities by continent name (case-insensitive). */
export const byContinent = createByContinent(getCities);

/** Fuzzy search cities by name using Levenshtein distance. */
export const fuzzySearch = createFuzzySearch(getCities);

/** Get a random city, optionally filtered by country or continent. */
export const random = createRandom(getCities);

/** Get aggregated dataset statistics. */
export const stats = createStats(getCities);

/** Find all cities within a given radius (km) of coordinates. Sorted by distance ascending. */
export const withinRadius = createWithinRadius(getCities);

/** Filter cities by admin_name (state/province). Case-insensitive substring match. */
export const byAdmin = createByAdmin(getCities);

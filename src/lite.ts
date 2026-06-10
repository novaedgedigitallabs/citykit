import { getLiteCities } from './data.js';
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

// ── Bind all factory functions to the lite dataset ──

/** Search cities by name (lite dataset — population >= 500,000). */
export const search = createSearch(getLiteCities);

/** Get all cities for a given country ISO2 code (lite). */
export const byCountry = createByCountry(getLiteCities);

/** Get capital cities (lite). */
export const capitals = createCapitals(getLiteCities);

/** Find nearest cities using Haversine formula (lite). */
export const nearest = createNearest(getLiteCities);

/** Calculate distance between two cities or coordinate pairs (lite). Picks highest-population city on name collision. */
export const distance = createDistance(getLiteCities);

/** Get country info and all its cities by ISO2 code (lite). */
export const getByIso2 = createGetByIso2(getLiteCities);

/** Get a single city by exact name (lite). */
export const getCity = createGetCity(getLiteCities);

/** List all unique countries with city counts (lite). */
export const listCountries = createListCountries(getLiteCities);

/** Get cities filtered by population range (lite). */
export const byPopulation = createByPopulation(getLiteCities);

/** Get cities by continent name (lite). */
export const byContinent = createByContinent(getLiteCities);

/** Fuzzy search cities by name using Levenshtein distance (lite). */
export const fuzzySearch = createFuzzySearch(getLiteCities);

/** Get a random city (lite). */
export const random = createRandom(getLiteCities);

/** Get aggregated dataset statistics (lite). */
export const stats = createStats(getLiteCities);

/** Find all cities within a given radius (km) of coordinates (lite). */
export const withinRadius = createWithinRadius(getLiteCities);

/** Filter cities by admin_name (state/province) (lite). */
export const byAdmin = createByAdmin(getLiteCities);

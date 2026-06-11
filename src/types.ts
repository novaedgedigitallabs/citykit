export interface City {
  city: string;
  city_ascii: string;
  lat: number;
  lng: number;
  country: string;
  iso2: string;
  iso3: string;
  admin_name: string;
  capital: 'primary' | 'admin' | 'minor' | null;
  population: number | null;
  id: number;
  /** true if the city is any type of capital (primary, admin, or minor) */
  isCapital: boolean;
  /** Continent name, e.g. "Asia", "Europe", "North America" */
  continent: string;
  /** Primary UTC timezone offset in hours (e.g. 5.5 for India, -5 for US EST) */
  timezone: number;
  /** ISO 4217 currency code (e.g. "INR", "USD", "EUR") */
  currency: string;
  /** International dialing prefix (e.g. "+91", "+1", "+44") */
  callingCode: string;
}

export interface SearchOptions {
  /** ISO2 country code filter, e.g. "IN" */
  country?: string;
  /** Maximum results to return (default: 10) */
  limit?: number;
  /** If true, only exact name matches (default: false) */
  exact?: boolean;
}

export interface NearestOptions {
  /** Number of nearest cities to return (default: 1) */
  limit?: number;
  /** ISO2 country code filter */
  country?: string;
}

export interface DistanceResult {
  /** Distance in kilometers */
  km: number;
  /** Distance in miles */
  miles: number;
}

export interface CountryInfo {
  country: string;
  iso2: string;
  iso3: string;
  cities: City[];
}

export interface CountryListItem {
  country: string;
  iso2: string;
  iso3: string;
  count: number;
}

export interface PopulationOptions {
  /** Minimum population (inclusive) */
  min: number;
  /** Maximum population (inclusive). If omitted, no upper limit. */
  max?: number;
  /** Sort order: 'asc' or 'desc' (default: 'desc') */
  sort?: 'asc' | 'desc';
  /** Maximum results to return */
  limit?: number;
}

export interface FuzzySearchOptions {
  /** ISO2 country code filter */
  country?: string;
  /** Maximum results to return (default: 10) */
  limit?: number;
  /** Maximum Levenshtein distance threshold (default: 3) */
  threshold?: number;
}

export interface RandomOptions {
  /** ISO2 country code filter */
  country?: string;
  /** Filter by continent name */
  continent?: string;
}

export interface DatasetStats {
  /** Total number of cities in the dataset */
  totalCities: number;
  /** Number of unique countries */
  totalCountries: number;
  /** Number of national capitals */
  totalCapitals: number;
  /** Largest city by population */
  largestCity: City;
  /** Smallest city by population (with non-null population) */
  smallestCity: City;
  /** Average population across cities with known population */
  averagePopulation: number;
  /** Total world population represented in the dataset */
  totalPopulation: number;
}

export interface WithinRadiusOptions {
  /** ISO2 country code filter */
  country?: string;
  /** Maximum results to return (default: no limit) */
  limit?: number;
}

/** Column index map for array-format city data */
export interface ColumnMap {
  city: number;
  city_ascii: number;
  lat: number;
  lng: number;
  country: number;
  iso2: number;
  iso3: number;
  admin_name: number;
  capital: number;
  population: number;
  id: number;
}

export interface AutocompleteOptions {
  /** ISO2 country code filter */
  country?: string;
  /** Maximum results to return (default: 10) */
  limit?: number;
  /** Minimum characters before returning results (default: 1) */
  minChars?: number;
}

/** India city tier classification based on population */
export type IndianCityTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

/** City with computed distance in km (nearest/radius results) */
export interface CityWithDistance {
  city: City;
  /** Distance in kilometers from the query point */
  distanceKm: number;
}

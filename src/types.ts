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

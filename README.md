# @novaedgedigitallabs/citykit

> World cities search, distance, geo utilities & India-specific tools — **49,992 cities** across **242 countries** — enriched with timezone, currency, calling code, continent & more.

A zero-dependency utility library for searching cities, calculating distances, finding nearest locations, autocompleting city names, and querying rich country metadata. Ships with a full dataset and a lightweight variant.

[![npm version](https://img.shields.io/npm/v/@novaedgedigitallabs/citykit.svg)](https://www.npmjs.com/package/@novaedgedigitallabs/citykit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Install

```bash
npm install @novaedgedigitallabs/citykit
```

---

## Quick Start

```js
import { search, distance, nearest, autocomplete } from '@novaedgedigitallabs/citykit';

// Search cities
const results = search('london', { limit: 3 });
// → [{ city: "London", country: "United Kingdom", timezone: 0, currency: "GBP", ... }]

// Autocomplete for form inputs
const suggestions = autocomplete('mumb', { country: 'IN', limit: 5 });
// → [{ city: "Mumbai", ... }]

// Distance between two cities
const dist = distance('Mumbai', 'Delhi');
// → { km: 1153.64, miles: 716.84 }

// Nearest city to coordinates
const [city] = nearest({ lat: 28.6139, lng: 77.209 });
// → { city: "New Delhi", country: "India", callingCode: "+91", ... }
```

---

## What's New in v1.3.0

| Feature | Functions Added |
|---|---|
| **Enriched city fields** | `isCapital`, `continent`, `timezone`, `currency`, `callingCode` on every `City` object |
| **Country metadata** | `getCountryMeta()`, `getCountryContinent()` |
| **Geo: bounding box** | `getBoundingBox()` |
| **Autocomplete** | `autocomplete()` with `minChars` guard |
| **India utilities** | `getIndianCities()`, `getCitiesByState()`, `getCityTier()`, `getIndianStates()`, `getTierThresholds()` |

---

## API Reference

### `search(query, options?)`

Search cities by name. Case-insensitive substring match on `city_ascii`. Sorted: **exact → starts-with → contains**.

```ts
search(query: string, options?: SearchOptions): City[]
```

| Option | Type | Default | Description |
|---|---|---|---|
| `country` | `string` | — | Filter by ISO2 code (e.g. `"IN"`) |
| `limit` | `number` | `10` | Max results |
| `exact` | `boolean` | `false` | Exact match only |

```js
search('paris');
// → [{ city: "Paris", country: "France", ... }, ...]

search('delhi', { country: 'IN', limit: 3 });
search('Tokyo', { exact: true });
```

---

### `autocomplete(query, options?)` ✨ New

Optimized for form inputs — applies a `minChars` guard to skip processing on very short queries. Results are prefix-sorted (starts-with first).

```ts
autocomplete(query: string, options?: AutocompleteOptions): City[]
```

| Option | Type | Default | Description |
|---|---|---|---|
| `minChars` | `number` | `1` | Skip query if shorter than this |
| `country` | `string` | — | Filter by ISO2 code |
| `limit` | `number` | `10` | Max results |

```js
import { autocomplete } from '@novaedgedigitallabs/citykit';

autocomplete('mum', { country: 'IN', limit: 5 });
// → [{ city: "Mumbai", ... }, { city: "Mumbra", ... }]

autocomplete('M', { minChars: 2 });
// → []  (query too short, returns immediately)
```

---

### `fuzzySearch(query, options?)`

Fuzzy search using Levenshtein distance — handles typos. Sorted by edit distance, then population descending.

```ts
fuzzySearch(query: string, options?: FuzzySearchOptions): City[]
```

| Option | Type | Default | Description |
|---|---|---|---|
| `country` | `string` | — | Filter by ISO2 code |
| `limit` | `number` | `10` | Max results |
| `threshold` | `number` | `3` | Max Levenshtein distance |

```js
import { fuzzySearch } from '@novaedgedigitallabs/citykit';

fuzzySearch('bangalor');
// → [{ city: "Bangalore", city_ascii: "Bangalore", ... }]
```

---

### `nearest(coords, options?)`

Find the nearest city/cities to coordinates using the Haversine formula.

```ts
nearest(coords: { lat: number; lng: number }, options?: NearestOptions): City[]
```

| Option | Type | Default | Description |
|---|---|---|---|
| `limit` | `number` | `1` | Number of results |
| `country` | `string` | — | Restrict to a country (ISO2) |

```js
import { nearest } from '@novaedgedigitallabs/citykit';

const [city] = nearest({ lat: 48.8584, lng: 2.2945 });
// → { city: "Paris", country: "France", ... }
```

---

### `distance(from, to)`

Calculate the Haversine distance between two cities or coordinate pairs.

```ts
distance(
  from: string | { lat: number; lng: number },
  to: string | { lat: number; lng: number }
): DistanceResult | null
```

```js
import { distance } from '@novaedgedigitallabs/citykit';

distance('Mumbai', 'Delhi');
// → { km: 1153.64, miles: 716.84 }

distance('Tokyo', { lat: 40.7128, lng: -74.006 });
// → { km: 10846.97, miles: 6739.99 }
```

---

### `withinRadius(coords, radiusKm, options?)`

Find all cities within a radius. Results sorted by distance ascending (nearest first).

```ts
withinRadius(
  coords: { lat: number; lng: number },
  radiusKm: number,
  options?: WithinRadiusOptions
): City[]
```

| Option | Type | Default | Description |
|---|---|---|---|
| `country` | `string` | — | Filter within a country (ISO2) |
| `limit` | `number` | — | Max results |

```js
import { withinRadius } from '@novaedgedigitallabs/citykit';

withinRadius({ lat: 22.7196, lng: 75.8577 }, 100);
// → [{ city: "Indore", ... }, { city: "Ujjain", ... }, ...]

withinRadius({ lat: 22.7196, lng: 75.8577 }, 100, { country: 'IN' });
```

---

### `getBoundingBox(lat, lng, radiusKm)` ✨ New

Returns a geographic bounding box around a point — useful for pre-filtering before precise Haversine queries.

```ts
getBoundingBox(lat: number, lng: number, radiusKm: number): BoundingBox
```

```js
import { getBoundingBox } from '@novaedgedigitallabs/citykit';

getBoundingBox(28.6139, 77.209, 100);
// → { north: 29.51, south: 27.71, east: 78.42, west: 76.00 }
```

Returns `{ north, south, east, west }` — all values clamped to valid lat/lng ranges.

---

### `byCountry(iso2)`

Get all cities for a country.

```ts
byCountry(iso2: string): City[]
```

```js
byCountry('JP');  // → 1,370 cities in Japan
```

---

### `capitals(iso2?)`

Get capital cities. Without arguments, returns all **national capitals**. With ISO2, returns national + state/province capitals for that country.

```ts
capitals(iso2?: string): City[]
```

```js
capitals();       // → all 242 national capitals
capitals('IN');   // → Delhi + all Indian state capitals
```

---

### `byAdmin(adminName, iso2?)`

Filter by admin name (state/province). Case-insensitive substring match. Sorted by population descending.

```ts
byAdmin(adminName: string, iso2?: string): City[]
```

```js
import { byAdmin } from '@novaedgedigitallabs/citykit';

byAdmin('Maharashtra', 'IN');
// → [{ city: "Mumbai", population: 18978000, ... }, ...]

byAdmin('California');
// → all California cities, any country
```

---

### `byPopulation(options)`

Filter cities by population range.

```ts
byPopulation(options: PopulationOptions): City[]
```

| Option | Type | Default | Description |
|---|---|---|---|
| `min` | `number` | — | Minimum population (inclusive) |
| `max` | `number` | — | Maximum population (inclusive) |
| `sort` | `'asc' \| 'desc'` | `'desc'` | Sort order |
| `limit` | `number` | — | Max results |

```js
byPopulation({ min: 10_000_000, limit: 5 });
// → [{ city: "Tokyo", population: 37785000, ... }, ...]
```

---

### `byContinent(continent)`

Get all cities on a continent (case-insensitive).

```ts
byContinent(continent: string): City[]
```

```js
byContinent('Asia');    // all Asian cities
byContinent('Europe');  // all European cities
```

---

### `getByIso2(iso2)`

Get country info and all its cities.

```ts
getByIso2(iso2: string): CountryInfo | null
```

```js
getByIso2('DE');
// → { country: "Germany", iso2: "DE", iso3: "DEU", cities: [...1782 cities] }
```

---

### `getCity(name, iso2?)`

Get a single city by exact name, optionally scoped to a country.

```ts
getCity(name: string, iso2?: string): City | null
```

```js
getCity('Paris');        // → Paris, France (highest population match)
getCity('Paris', 'US'); // → Paris, United States
```

---

### `getCountryMeta(iso2)` ✨ New

Get static metadata for any country: timezone offset, currency code, and calling code.

```ts
getCountryMeta(iso2: string): CountryMeta | undefined
```

```ts
interface CountryMeta {
  timezone: number;    // UTC offset in hours (e.g. 5.5 for India)
  currency: string;    // ISO 4217 code (e.g. "INR")
  callingCode: string; // E.164 prefix (e.g. "+91")
}
```

```js
import { getCountryMeta } from '@novaedgedigitallabs/citykit';

getCountryMeta('IN');
// → { timezone: 5.5, currency: "INR", callingCode: "+91" }

getCountryMeta('DE');
// → { timezone: 1, currency: "EUR", callingCode: "+49" }

getCountryMeta('XX');
// → undefined
```

---

### `getCountryContinent(iso2)` ✨ New

Resolve an ISO2 country code to its continent name.

```ts
getCountryContinent(iso2: string): string
```

```js
import { getCountryContinent } from '@novaedgedigitallabs/citykit';

getCountryContinent('IN'); // → "Asia"
getCountryContinent('FR'); // → "Europe"
getCountryContinent('BR'); // → "South America"
getCountryContinent('AU'); // → "Oceania"
getCountryContinent('XX'); // → ""
```

---

### `random(options?)`

Get a random city, optionally filtered by country or continent.

```ts
random(options?: RandomOptions): City | null
```

```js
random({ continent: 'Europe' });
// → { city: "Rome", country: "Italy", ... }
```

---

### `listCountries()`

List all unique countries with city count, sorted alphabetically.

```ts
listCountries(): CountryListItem[]
```

```js
listCountries();
// → [
//   { country: "Afghanistan", iso2: "AF", iso3: "AFG", count: 73 },
//   ...242 countries
// ]
```

---

### `getContinentNames()`

Get all continent names with correct capitalization.

```ts
getContinentNames(): string[]
```

```js
getContinentNames();
// → ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']
```

---

### `stats()`

Aggregated dataset statistics.

```ts
stats(): DatasetStats
```

```js
stats();
// → {
//     totalCities: 49992,
//     totalCountries: 242,
//     totalCapitals: 242,
//     largestCity: { city: "Tokyo", population: 37785000, ... },
//     smallestCity: { city: "Adamstown", ... },
//     averagePopulation: 111352.45,
//     totalPopulation: 4561848912
//   }
```

---

## India-Specific Utilities ✨ New

A dedicated set of helpers for Indian cities, fully typed and population-sorted.

### `getIndianCities()`

All 7,200+ Indian cities from the dataset.

```ts
getIndianCities(): City[]
```

```js
import { getIndianCities } from '@novaedgedigitallabs/citykit';

const cities = getIndianCities(); // → 7,200+ cities, iso2 === "IN"
```

---

### `getCitiesByState(state)`

Filter Indian cities by state/UT name. Supports plain English — diacritics in dataset names (e.g. `"Mahārāshtra"`) are normalized automatically. Sorted by population descending.

```ts
getCitiesByState(state: string): City[]
```

```js
import { getCitiesByState } from '@novaedgedigitallabs/citykit';

getCitiesByState('Maharashtra');
// → [{ city: "Mumbai", population: 18978000, ... }, { city: "Pune", ... }, ...]

getCitiesByState('Tamil');     // partial match — returns Tamil Nadu cities
getCitiesByState('Uttar Pradesh');
```

---

### `getCityTier(cityName)`

Classify an Indian city's tier based on population. Returns `null` if city not found or has no population data.

```ts
getCityTier(cityName: string): IndianCityTier | null
// IndianCityTier = 'Tier 1' | 'Tier 2' | 'Tier 3'
```

| Tier | Threshold | Examples |
|---|---|---|
| **Tier 1** | population ≥ 4,000,000 | Mumbai, Delhi, Bangalore, Hyderabad |
| **Tier 2** | population ≥ 500,000 | Indore, Patna, Vadodara, Coimbatore |
| **Tier 3** | population < 500,000 | Smaller cities & towns |

```js
import { getCityTier } from '@novaedgedigitallabs/citykit';

getCityTier('Mumbai');    // → "Tier 1"
getCityTier('Indore');    // → "Tier 2"
getCityTier('Khandwa');   // → "Tier 3"
getCityTier('FakeCity');  // → null
```

---

### `getIndianStates()`

All unique Indian state/UT names in the dataset, sorted alphabetically.

```ts
getIndianStates(): string[]
```

```js
import { getIndianStates } from '@novaedgedigitallabs/citykit';

getIndianStates();
// → ["Andaman and Nicobar", "Andhra Pradesh", "Arunachal Pradesh", ..., "West Bengal"]
```

---

### `getTierThresholds()`

Returns the population thresholds used by `getCityTier()`.

```ts
getTierThresholds(): { tier1: number; tier2: number }
```

```js
getTierThresholds();
// → { tier1: 4000000, tier2: 500000 }
```

---

## Enriched City Object ✨ New

Every `City` object now includes enriched metadata fields derived from the country's static profile.

```ts
interface City {
  // Core fields
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

  // Enriched fields (v1.3+)
  isCapital: boolean;    // true only for national capitals (capital === 'primary')
  continent: string;     // e.g. "Asia", "Europe", "North America"
  timezone: number;      // UTC offset in hours (e.g. 5.5 for India)
  currency: string;      // ISO 4217 code (e.g. "INR", "EUR", "USD")
  callingCode: string;   // E.164 prefix (e.g. "+91", "+49")
}
```

```js
import { getCity } from '@novaedgedigitallabs/citykit';

const city = getCity('Mumbai', 'IN');
// → {
//     city: "Mumbai",
//     country: "India",
//     iso2: "IN",
//     isCapital: false,
//     continent: "Asia",
//     timezone: 5.5,
//     currency: "INR",
//     callingCode: "+91",
//     population: 18978000,
//     ...
//   }
```

---

## Lite Version

For bundle-size-sensitive apps, use the lite import — only cities with **population ≥ 500,000** (1,422 cities, 141 countries).

```js
import { search, distance, autocomplete } from '@novaedgedigitallabs/citykit/lite';

// Same API, smaller dataset
search('london');
// → [{ city: "London", population: 11262000, currency: "GBP", ... }]
```

### Bundle Comparison

| Version | Cities | Data Size |
|---|---|---|
| Full | 49,992 | ~5.0 MB |
| Lite | 1,422 | ~140 KB |

---

## TypeScript Support

CityKit is written in TypeScript and ships full type declarations.

```ts
import type {
  City,
  CountryMeta,
  BoundingBox,
  IndianCityTier,
  AutocompleteOptions,
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
} from '@novaedgedigitallabs/citykit';
```

---

## Data Source

City data sourced from the [SimpleMaps World Cities Database](https://simplemaps.com/data/world-cities) — a comprehensive dataset covering cities worldwide with population, coordinates, and administrative data.

---

## Support

If citykit saved you time → [novaedgedigitallabs.tech/pay](https://www.novaedgedigitallabs.tech/pay)

## License

MIT © [NovaEdge Digital Labs](https://novaedgedigitallabs.in)

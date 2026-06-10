# @novaedgedigitallabs/citykit

> World cities search, distance, and geo utilities — **49,992 cities** across **242 countries** — **15 functions**.

A zero-dependency utility library for searching cities, calculating distances using the Haversine formula, finding nearest locations, querying country/capital data, and filtering by radius, state, or continent. Ships with a full dataset and a lightweight variant.

[![npm version](https://img.shields.io/npm/v/@novaedgedigitallabs/citykit.svg)](https://www.npmjs.com/package/@novaedgedigitallabs/citykit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## Install

```bash
npm install @novaedgedigitallabs/citykit
```

## Quick Start

```js
import { search, distance, nearest } from '@novaedgedigitallabs/citykit';

// Find cities matching "london"
const results = search('london', { limit: 3 });
// → [{ city: "London", country: "United Kingdom", ... }, ...]

// Distance between Mumbai and Delhi
const dist = distance('Mumbai', 'Delhi');
// → { km: 1153.64, miles: 716.84 }

// Nearest city to coordinates
const [city] = nearest({ lat: 28.6139, lng: 77.209 });
// → { city: "New Delhi", country: "India", ... }
```

---

## Documentation

Comprehensive documentation, including advanced usage, core concepts, and the complete API reference, is available in the [`docs.html`](./docs.html) file included in the repository.

---


## API Reference

### `search(query, options?)`

Search cities by name. Case-insensitive substring match on `city_ascii`. Results are sorted: **exact matches → starts-with → contains**.

```ts
search(query: string, options?: SearchOptions): City[]
```

**Options:**

| Option    | Type      | Default | Description                         |
| --------- | --------- | ------- | ----------------------------------- |
| `country` | `string`  | —       | Filter by ISO2 code (e.g. `"IN"`)  |
| `limit`   | `number`  | `10`    | Max results                         |
| `exact`   | `boolean` | `false` | Exact match only                    |

```js
import { search } from '@novaedgedigitallabs/citykit';

search('paris');
// → [{ city: "Paris", country: "France", ... }, { city: "Paris", country: "United States", ... }, ...]

search('delhi', { country: 'IN', limit: 3 });
// → [{ city: "Delhi", ... }, { city: "Delhi Cantonment", ... }, { city: "New Delhi", ... }]

search('Tokyo', { exact: true });
// → [{ city: "Tokyo", country: "Japan", population: 37785000, ... }]
```

---

### `byCountry(iso2)`

Get all cities for a given country.

```ts
byCountry(iso2: string): City[]
```

```js
import { byCountry } from '@novaedgedigitallabs/citykit';

const japanCities = byCountry('JP');
// → 1370 cities in Japan
```

---

### `capitals(iso2?)`

Get capital cities. Without arguments, returns all **national capitals** worldwide. With an ISO2 code, returns **national + state/province capitals** for that country.

```ts
capitals(iso2?: string): City[]
```

```js
import { capitals } from '@novaedgedigitallabs/citykit';

// All national capitals
const worldCapitals = capitals();
// → [{ city: "Tokyo", capital: "primary", ... }, { city: "Jakarta", ... }, ...]

// India's state capitals
const indiaCapitals = capitals('IN');
// → [{ city: "Delhi", capital: "admin", ... }, { city: "Mumbai", capital: "admin", ... }, ...]
```

---

### `nearest(coords, options?)`

Find the nearest city/cities to given coordinates using the **Haversine formula**.

```ts
nearest(coords: { lat: number; lng: number }, options?: NearestOptions): City[]
```

**Options:**

| Option    | Type     | Default | Description                   |
| --------- | -------- | ------- | ----------------------------- |
| `limit`   | `number` | `1`     | Number of results             |
| `country` | `string` | —       | Filter within a country (ISO2)|

```js
import { nearest } from '@novaedgedigitallabs/citykit';

// Nearest city to the Eiffel Tower
const [city] = nearest({ lat: 48.8584, lng: 2.2945 });
// → { city: "Paris", country: "France", ... }

// 3 nearest Indian cities to coordinates
const nearby = nearest({ lat: 28.6139, lng: 77.209 }, { limit: 3, country: 'IN' });
```

---

### `distance(from, to)`

Calculate distance between two cities or coordinate pairs. Accepts city names (`city_ascii` match) or `{ lat, lng }` objects.

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

distance('NonExistent', 'Paris');
// → null
```

---

### `getByIso2(iso2)`

Get country info and all its cities by ISO2 code.

```ts
getByIso2(iso2: string): CountryInfo | null
```

```js
import { getByIso2 } from '@novaedgedigitallabs/citykit';

const germany = getByIso2('DE');
// → { country: "Germany", iso2: "DE", iso3: "DEU", cities: [...1782 cities] }
```

---

### `getCity(name, iso2?)`

Get a single city by exact name, optionally filtered by country.

```ts
getCity(name: string, iso2?: string): City | null
```

```js
import { getCity } from '@novaedgedigitallabs/citykit';

getCity('Paris');
// → { city: "Paris", country: "France", lat: 48.8567, lng: 2.3522, population: 11060000, ... }

getCity('Paris', 'US');
// → { city: "Paris", country: "United States", ... }
```

---

### `listCountries()`

List all unique countries with their city count, sorted alphabetically.

```ts
listCountries(): CountryListItem[]
```

```js
import { listCountries } from '@novaedgedigitallabs/citykit';

const countries = listCountries();
// → [
//   { country: "Afghanistan", iso2: "AF", iso3: "AFG", count: 73 },
//   { country: "Albania", iso2: "AL", iso3: "ALB", count: 44 },
//   ...242 countries
// ]
```

---

### `byPopulation(options)`

Filter cities by a population range. Results are sorted by population descending by default.

```ts
byPopulation(options: PopulationOptions): City[]
```

**Options:**

| Option  | Type              | Default  | Description                         |
| ------- | ----------------- | -------- | ----------------------------------- |
| `min`   | `number`          | —        | Minimum population (inclusive)      |
| `max`   | `number`          | —        | Maximum population (inclusive)      |
| `sort`  | `'asc' \| 'desc'` | `'desc'` | Sort order                          |
| `limit` | `number`          | —        | Maximum results to return           |

```js
import { byPopulation } from '@novaedgedigitallabs/citykit';

// Get top 5 largest cities with at least 10M population
const majorCities = byPopulation({ min: 10000000, limit: 5 });
// → [{ city: "Tokyo", population: 37785000, ... }, ...]
```

---

### `byContinent(continent)`

Get all cities located in a given continent (case-insensitive).

```ts
byContinent(continent: string): City[]
```

```js
import { byContinent } from '@novaedgedigitallabs/citykit';

const asianCities = byContinent('Asia');
// → Array of cities in Asia
```

---

### `fuzzySearch(query, options?)`

Fuzzy search cities by name using Levenshtein distance to handle typos. Results are sorted by distance (ascending) and then by population (descending).

```ts
fuzzySearch(query: string, options?: FuzzySearchOptions): City[]
```

**Options:**

| Option      | Type     | Default | Description                         |
| ----------- | -------- | ------- | ----------------------------------- |
| `country`   | `string` | —       | Filter by ISO2 code (e.g. `"US"`)   |
| `limit`     | `number` | `10`    | Maximum results to return           |
| `threshold` | `number` | `3`     | Max Levenshtein distance allowed    |

```js
import { fuzzySearch } from '@novaedgedigitallabs/citykit';

// Typo correction for "bangalor"
const results = fuzzySearch('bangalor');
// → [{ city: "Bangalore", city_ascii: "Bangalore", ... }]
```

---

### `random(options?)`

Retrieve a random city from the dataset, optionally filtered by country or continent.

```ts
random(options?: RandomOptions): City | null
```

**Options:**

| Option      | Type     | Default | Description                         |
| ----------- | -------- | ------- | ----------------------------- |
| `country`   | `string` | —       | Filter by ISO2 code (e.g. `"FR"`)   |
| `continent` | `string` | —       | Filter by continent name            |

```js
import { random } from '@novaedgedigitallabs/citykit';

const city = random({ continent: 'Europe' });
// → { city: "Paris", country: "France", ... }
```

---

### `stats()`

Get aggregated dataset statistics, including city count, country count, national capitals count, and population statistics.

```ts
stats(): DatasetStats
```

```js
import { stats } from '@novaedgedigitallabs/citykit';

const summary = stats();
// → {
//     totalCities: 49992,
//     totalCountries: 242,
//     totalCapitals: 242,
//     largestCity: { city: "Tokyo", ... },
//     smallestCity: { city: "Adamstown", ... },
//     averagePopulation: 111352.45,
//     totalPopulation: 4561848912
//   }
```

---

### `withinRadius(coords, radiusKm, options?)`

Find all cities within a given radius (in km) of coordinates. Results sorted by distance ascending (nearest first).

```ts
withinRadius(
  coords: { lat: number; lng: number },
  radiusKm: number,
  options?: WithinRadiusOptions
): City[]
```

**Options:**

| Option    | Type     | Default | Description                   |
| --------- | -------- | ------- | ----------------------------- |
| `country` | `string` | —       | Filter within a country (ISO2)|
| `limit`   | `number` | —       | Maximum results to return     |

```js
import { withinRadius } from '@novaedgedigitallabs/citykit';

// All cities within 100km of Indore
const nearby = withinRadius({ lat: 22.7196, lng: 75.8577 }, 100);
// → [{ city: "Indore", ... }, { city: "Ujjain", ... }, ...]

// With country filter
const nearbyIN = withinRadius({ lat: 22.7196, lng: 75.8577 }, 100, { country: 'IN' });
```

---

### `byAdmin(adminName, iso2?)`

Filter cities by admin_name (state/province). Case-insensitive substring match. Sorted by population descending.

```ts
byAdmin(adminName: string, iso2?: string): City[]
```

```js
import { byAdmin } from '@novaedgedigitallabs/citykit';

// All cities in Maharashtra, India
const maharashtra = byAdmin('Maharashtra', 'IN');
// → [{ city: "Mumbai", population: 18978000, ... }, ...]

// All cities in California (any country)
const california = byAdmin('California');
```

---

### `getContinentNames()`

Get all valid continent names with proper capitalization.

```ts
getContinentNames(): string[]
```

```js
import { getContinentNames } from '@novaedgedigitallabs/citykit';

const continents = getContinentNames();
// → ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']
```

---

## Lite Version

For applications where bundle size matters, use the lite version — includes only cities with **population ≥ 500,000** (1,422 cities across 141 countries).

```js
import { search, distance } from '@novaedgedigitallabs/citykit/lite';

// Same API, smaller dataset
search('london');
// → [{ city: "London", country: "United Kingdom", population: 11262000, ... }]
```

### Bundle Size Comparison

| Version | Cities  | Data Size |
| ------- | ------- | --------- |
| Full    | 49,992  | ~5.0 MB   |
| Lite    | 1,422   | ~140 KB   |

---

## TypeScript Support

CityKit is written in TypeScript and ships with full type declarations.

```ts
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
} from '@novaedgedigitallabs/citykit';
```

### Key Types

```ts
interface City {
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

interface SearchOptions {
  country?: string;
  limit?: number;
  exact?: boolean;
}

interface NearestOptions {
  limit?: number;
  country?: string;
}

interface DistanceResult {
  km: number;
  miles: number;
}

interface CountryInfo {
  country: string;
  iso2: string;
  iso3: string;
  cities: City[];
}

interface CountryListItem {
  country: string;
  iso2: string;
  iso3: string;
  count: number;
}

interface PopulationOptions {
  min: number;
  max?: number;
  sort?: 'asc' | 'desc';
  limit?: number;
}

interface FuzzySearchOptions {
  country?: string;
  limit?: number;
  threshold?: number;
}

interface RandomOptions {
  country?: string;
  continent?: string;
}

interface DatasetStats {
  totalCities: number;
  totalCountries: number;
  totalCapitals: number;
  largestCity: City;
  smallestCity: City;
  averagePopulation: number;
  totalPopulation: number;
}

interface WithinRadiusOptions {
  country?: string;
  limit?: number;
}
```

---

## Data Source

City data sourced from the [SimpleMaps World Cities Database](https://simplemaps.com/data/world-cities) — a comprehensive dataset covering cities worldwide with population, coordinates, and administrative data.

---

## License

MIT © [NovaEdge Digital Labs](https://novaedgedigitallabs.in)


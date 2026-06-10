# CityKit — Project Context

---

## Package Info

| Field       | Value                                                                 |
| ----------- | --------------------------------------------------------------------- |
| Name        | `@novaedgedigitallabs/citykit`                                        |
| Version     | `1.1.1`                                                               |
| npm URL     | https://www.npmjs.com/package/@novaedgedigitallabs/citykit            |
| GitHub URL  | https://github.com/novaedgedigitallabs/citykit                       |
| License     | MIT                                                                   |
| Author/Org  | NovaEdge Digital Labs                                                 |

---

## What This Package Does

CityKit is a **zero-dependency** Node.js utility library for working with world city data. It provides functions to search cities by name (including fuzzy/typo-tolerant search), calculate distances between cities using the Haversine formula, find nearest cities to coordinates, query capitals, filter by population/continent/country, and retrieve dataset statistics. It ships with a full dataset of **49,992 cities across 242 countries** and a lightweight variant (1,422 cities with population ≥ 500,000).

---

## Data

| Field                      | Value                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| Source file                 | `worldcities.xlsx` (SimpleMaps World Cities Database)                                      |
| Full dataset               | `data/cities.json` — 49,992 cities (4.8 MB)                                               |
| Lite dataset               | `data/cities-lite.json` — 1,422 cities (137 KB)                                           |
| Column map                 | `data/columns.json` — index mapping for array-of-arrays format                            |
| Countries (full)           | 241 unique ISO2 codes                                                                      |
| Countries (lite)           | 141 unique ISO2 codes                                                                      |
| Lite population threshold  | ≥ 500,000                                                                                  |

### Column Names & Data Types

| Index | Column       | Type                                          |
| ----- | ------------ | --------------------------------------------- |
| 0     | `city`       | `string` — city name (native/display)         |
| 1     | `city_ascii`| `string` — ASCII-safe city name               |
| 2     | `lat`        | `number` — latitude in decimal degrees        |
| 3     | `lng`        | `number` — longitude in decimal degrees       |
| 4     | `country`    | `string` — full country name                  |
| 5     | `iso2`       | `string` — 2-letter country code (e.g. "IN")  |
| 6     | `iso3`       | `string` — 3-letter country code (e.g. "IND") |
| 7     | `admin_name` | `string` — state/province/admin region name   |
| 8     | `capital`    | `string \| null` — capital status              |
| 9     | `population` | `number \| null` — population (null if unknown)|
| 10    | `id`         | `number` — unique city identifier             |

### Capital Field Values

| Value       | Meaning                                   |
| ----------- | ----------------------------------------- |
| `"primary"` | National capital (e.g. Tokyo, Delhi)      |
| `"admin"`   | State/province capital (e.g. Mumbai)      |
| `"minor"`   | Minor administrative capital              |
| `null`      | Not a capital city                        |

---

## Tech Stack

| Component            | Value                                  |
| -------------------- | -------------------------------------- |
| Language             | TypeScript (strict mode)               |
| Build tool           | tsup ^8.0.0                            |
| Output formats       | ESM (`.mjs`) + CJS (`.js`) + Types (`.d.ts`, `.d.mts`) |
| Test framework       | Vitest ^1.6.0                          |
| Node version         | Not specified in `engines` (uses ES2020 target, requires Node ≥ 14) |
| TypeScript version   | ^5.4.0                                 |
| Runtime dependencies | **None** (zero-dependency)             |

---

## Project Structure

```
novaedge-citykit/
├── src/
│   ├── index.ts              — main entry point, all 12 exported functions (full dataset)
│   ├── lite.ts               — lite entry point, same 12 functions using lite dataset
│   ├── types.ts              — all TypeScript interfaces (City, SearchOptions, etc.)
│   ├── data.ts               — data loader with lazy loading & caching (full + lite)
│   ├── haversine.ts          — Haversine formula for great-circle distance calculation
│   ├── levenshtein.ts        — Levenshtein distance algorithm for fuzzy search
│   ├── continents.ts         — continent-to-ISO2 country code mapping
│   └── __tests__/
│       └── index.test.ts     — Vitest test suite (20 tests covering full + lite)
├── data/
│   ├── cities.json           — full dataset, 49,992 cities (4.8 MB, array-of-arrays)
│   ├── cities-lite.json      — lite dataset, 1,422 cities (137 KB, array-of-arrays)
│   └── columns.json          — column index map for array format
├── dist/
│   ├── index.js              — CJS bundle (6.9 KB)
│   ├── index.mjs             — ESM bundle (6.3 KB)
│   ├── index.d.ts            — TypeScript declarations (6.4 KB)
│   ├── index.d.mts           — ESM TypeScript declarations (6.4 KB)
│   ├── lite.js               — Lite CJS bundle (6.9 KB)
│   ├── lite.mjs              — Lite ESM bundle (6.3 KB)
│   ├── lite.d.ts             — Lite TypeScript declarations (4.5 KB)
│   └── lite.d.mts            — Lite ESM TypeScript declarations (4.5 KB)
├── scripts/
│   ├── convert.mjs           — XLSX → JSON data conversion script
│   └── test.cjs              — quick CJS smoke test for all functions
├── package.json              — package configuration & metadata
├── package-lock.json         — dependency lock file
├── tsconfig.json             — TypeScript compiler configuration
├── tsup.config.ts            — tsup build configuration (dual entry points)
├── .gitignore                — git ignore rules (node_modules, dist, *.tgz)
├── .npmignore                — npm publish exclusions (src, scripts, xlsx, configs)
├── README.md                 — full API documentation with examples
├── prompt.md                 — original project specification/prompt
├── worldcities.xlsx          — raw source data file (3.4 MB)
├── index.html                — interactive playground/demo page (115 KB)
├── citykit-demo.html         — earlier version of demo page (93 KB)
├── index.html.backup         — backup of earlier demo (93 KB)
└── novaedgedigitallabs-citykit-1.1.1.tgz — npm pack output (1.8 MB)
```

---

## All Exported Functions

Both `@novaedgedigitallabs/citykit` (full) and `@novaedgedigitallabs/citykit/lite` export the **same 12 functions** with identical signatures. The only difference is the underlying dataset.

### 1. `search(query, options?)`

```ts
search(query: string, options?: SearchOptions): City[]
```

**What it does:** Case-insensitive substring search on `city_ascii`. Results sorted: exact → starts-with → contains.

```js
import { search } from '@novaedgedigitallabs/citykit';
search('london', { limit: 3 });
// → [{ city: "London", country: "United Kingdom", ... }, ...]

search('delhi', { country: 'IN', limit: 3 });
// → [{ city: "Delhi", ... }, { city: "Delhi Cantonment", ... }, ...]

search('Tokyo', { exact: true });
// → [{ city: "Tokyo", country: "Japan", population: 37785000, ... }]
```

**Edge cases:** Empty query returns cities that match empty string (all cities). The `country` filter is case-insensitive.

---

### 2. `byCountry(iso2)`

```ts
byCountry(iso2: string): City[]
```

**What it does:** Returns all cities for a given ISO2 country code.

```js
const jpCities = byCountry('JP'); // → 1370 cities in Japan
```

**Edge cases:** Returns empty array for invalid ISO2 codes. Case-insensitive.

---

### 3. `capitals(iso2?)`

```ts
capitals(iso2?: string): City[]
```

**What it does:** Without args: returns all national capitals (`capital === "primary"`). With ISO2: returns `"primary"` + `"admin"` capitals for that country.

```js
capitals();       // → all 242 national capitals
capitals('IN');   // → India's national + state capitals
```

---

### 4. `nearest(coords, options?)`

```ts
nearest(coords: { lat: number; lng: number }, options?: NearestOptions): City[]
```

**What it does:** Finds nearest city/cities to coordinates using Haversine formula.

```js
nearest({ lat: 48.8584, lng: 2.2945 });
// → [{ city: "Paris", country: "France", ... }]

nearest({ lat: 28.6139, lng: 77.209 }, { limit: 3, country: 'IN' });
// → 3 nearest Indian cities
```

**Notes:** Computes distance for every city in the pool (O(n)). For large datasets, this is ~50K distance calculations per call.

---

### 5. `distance(from, to)`

```ts
distance(
  from: string | { lat: number; lng: number },
  to: string | { lat: number; lng: number }
): DistanceResult | null
```

**What it does:** Calculates distance between two cities or coordinate pairs. Returns `{ km, miles }` rounded to 2 decimals.

```js
distance('Mumbai', 'Delhi');
// → { km: 1153.64, miles: 716.84 }

distance('Tokyo', { lat: 40.7128, lng: -74.006 });
// → { km: 10846.97, miles: 6739.99 }

distance('NonExistent', 'Paris');
// → null
```

**Edge cases:** When using city names, resolves via first `city_ascii` match (case-insensitive). If a city has duplicates (e.g. "Paris" in France and US), it uses the first match found. Returns `null` if either city name not found.

---

### 6. `getByIso2(iso2)`

```ts
getByIso2(iso2: string): CountryInfo | null
```

**What it does:** Gets country info (name, iso2, iso3) plus all its cities.

```js
getByIso2('DE');
// → { country: "Germany", iso2: "DE", iso3: "DEU", cities: [...1782 cities] }
```

---

### 7. `getCity(name, iso2?)`

```ts
getCity(name: string, iso2?: string): City | null
```

**What it does:** Gets a single city by exact `city_ascii` match, optionally filtered by country.

```js
getCity('Paris');        // → Paris, France (first match)
getCity('Paris', 'US');  // → Paris, United States
```

---

### 8. `listCountries()`

```ts
listCountries(): CountryListItem[]
```

**What it does:** Lists all unique countries with city counts, sorted alphabetically.

```js
listCountries();
// → [{ country: "Afghanistan", iso2: "AF", iso3: "AFG", count: 73 }, ...]
```

---

### 9. `byPopulation(options)`

```ts
byPopulation(options: PopulationOptions): City[]
```

**What it does:** Filters cities by population range, sorted by population descending by default.

```js
byPopulation({ min: 10000000, limit: 5 });
// → Top 5 cities with 10M+ population
```

**Edge cases:** Cities with `population: null` are excluded.

---

### 10. `byContinent(continent)`

```ts
byContinent(continent: string): City[]
```

**What it does:** Returns all cities in a continent (case-insensitive). Valid values: `"Africa"`, `"Asia"`, `"Europe"`, `"North America"`, `"South America"`, `"Oceania"`, `"Antarctica"`.

```js
byContinent('Asia'); // → all Asian cities
```

**Notes:** Uses a hardcoded ISO2-to-continent mapping in `continents.ts`.

---

### 11. `fuzzySearch(query, options?)`

```ts
fuzzySearch(query: string, options?: FuzzySearchOptions): City[]
```

**What it does:** Fuzzy search using Levenshtein distance to handle typos. Sorted by edit distance (asc), then population (desc).

```js
fuzzySearch('bangalor');
// → [{ city: "Bangalore", ... }]
```

**Notes:** Default threshold is 3 (max Levenshtein distance). Computes distance for every city name — O(n × m) where m is query length. Empty query returns `[]`.

---

### 12. `random(options?)`

```ts
random(options?: RandomOptions): City | null
```

**What it does:** Returns a random city, optionally filtered by country or continent.

```js
random();                          // → any random city
random({ country: 'US' });        // → random US city
random({ continent: 'Europe' });   // → random European city
```

---

### 13. `stats()`

```ts
stats(): DatasetStats
```

**What it does:** Returns aggregated dataset statistics.

```js
stats();
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

## Lite vs Full

| Aspect       | Full (`@novaedgedigitallabs/citykit`)   | Lite (`@novaedgedigitallabs/citykit/lite`) |
| ------------ | --------------------------------------- | ------------------------------------------ |
| Cities       | 49,992                                  | 1,422                                      |
| Countries    | 241 ISO2 codes                          | 141 ISO2 codes                             |
| Data size    | ~4.8 MB                                 | ~137 KB                                    |
| Filter       | All cities                              | Population ≥ 500,000 only                  |
| API          | Identical                               | Identical                                  |

**How to import:**

```js
// Full dataset
import { search, distance } from '@novaedgedigitallabs/citykit';

// Lite dataset
import { search, distance } from '@novaedgedigitallabs/citykit/lite';
```

**When to use which:**
- **Full** — when you need comprehensive coverage (small towns, administrative regions, all countries)
- **Lite** — when bundle size matters, mobile apps, or you only need major cities

---

## Scripts

| Script                    | Command                  | What it does                                        |
| ------------------------- | ------------------------ | --------------------------------------------------- |
| `convert`                 | `node scripts/convert.mjs` | Reads `worldcities.xlsx`, produces JSON data files |
| `build`                   | `tsup`                   | Builds CJS + ESM + type declarations via tsup       |
| `dev`                     | `tsup --watch`           | Builds in watch mode for development                |
| `test`                    | `vitest run`             | Runs the Vitest test suite (20 tests)               |
| `prepublishOnly`          | `npm run build`          | Auto-builds before `npm publish`                    |

---

## Build Output

All files in `dist/`:

| File            | Size   | Purpose                                    |
| --------------- | ------ | ------------------------------------------ |
| `index.js`      | 6.9 KB | CJS bundle (full dataset entry)            |
| `index.mjs`     | 6.3 KB | ESM bundle (full dataset entry)            |
| `index.d.ts`    | 6.4 KB | TypeScript declarations (CJS)              |
| `index.d.mts`   | 6.4 KB | TypeScript declarations (ESM)              |
| `lite.js`       | 6.9 KB | CJS bundle (lite dataset entry)            |
| `lite.mjs`      | 6.3 KB | ESM bundle (lite dataset entry)            |
| `lite.d.ts`     | 4.5 KB | TypeScript declarations for lite (CJS)     |
| `lite.d.mts`    | 4.5 KB | TypeScript declarations for lite (ESM)     |

**Total dist size:** ~48 KB (code only, data files are in `data/` directory)

---

## GitHub Actions

**No GitHub Actions workflows exist.** The `.github/` directory does not exist in this repository. Publishing is done manually via `npm publish`.

---

## Version History

> **No `CHANGELOG.md` file exists in the project.** The version history below is reconstructed from git commits:

### v1.1.1 (2026-06-10)

- Added 5 new utility functions: `byPopulation`, `byContinent`, `fuzzySearch`, `random`, `stats`
- Added Levenshtein distance algorithm for fuzzy search
- Added continent-to-country ISO2 mapping
- Added Vitest test suite with 20 tests
- Updated README with full API documentation for all functions
- Added TypeScript types: `PopulationOptions`, `FuzzySearchOptions`, `RandomOptions`, `DatasetStats`
- Added interactive playground demo (`index.html`)

### v1.0.1 (2026-06-09)

- Added repository, homepage, and bugs metadata to `package.json`

### v1.0.0 (2026-06-09)

- Initial release
- 49,992 world cities across 242 countries
- Core functions: `search`, `byCountry`, `capitals`, `nearest`, `distance`, `getByIso2`, `getCity`, `listCountries`
- Data conversion script (`scripts/convert.mjs`)
- Lite version with cities having population ≥ 500,000
- Dual CJS/ESM output via tsup
- Full TypeScript support

---

## Installation & Basic Usage

```bash
npm install @novaedgedigitallabs/citykit
```

### Search for cities

```js
import { search } from '@novaedgedigitallabs/citykit';

const results = search('london', { limit: 3 });
console.log(results);
// → [{ city: "London", country: "United Kingdom", population: 11262000, ... }, ...]
```

### Calculate distance between two cities

```js
import { distance } from '@novaedgedigitallabs/citykit';

const dist = distance('Mumbai', 'Delhi');
console.log(dist);
// → { km: 1153.64, miles: 716.84 }
```

### Find nearest city to coordinates

```js
import { nearest } from '@novaedgedigitallabs/citykit';

const [city] = nearest({ lat: 28.6139, lng: 77.209 });
console.log(city.city, city.country);
// → "New Delhi" "India"
```

### Fuzzy search with typo tolerance

```js
import { fuzzySearch } from '@novaedgedigitallabs/citykit';

const results = fuzzySearch('bangalor');
console.log(results[0].city);
// → "Bangalore"
```

---

## Known Issues / Limitations

1. **`distance()` resolves to first match only** — When passing a city name string like `"Paris"`, it finds the first `city_ascii` match. If there are multiple cities with the same name (e.g. Paris in France vs Paris in US), it always picks the first one found in the array. There is no disambiguation.

2. **`nearest()` is O(n) brute force** — Every call computes Haversine distance for all ~50K cities (or the filtered subset). For performance-critical applications, a spatial index (e.g. k-d tree) would be more efficient.

3. **`fuzzySearch()` is O(n × m)** — Computes Levenshtein distance against every city name. On the full dataset, this means ~50K string comparisons per query. Could be slow for very high-frequency calls.

4. **Continent mapping is hardcoded** — The `continents.ts` file contains a manually maintained list of ISO2 codes per continent. If new countries are added to the dataset, this mapping must be manually updated.

5. **No `engines` field in `package.json`** — Node.js version requirement is not specified. The code uses `import.meta.url` (ESM) with a CJS fallback, which requires Node ≥ 14.

6. **Data is loaded synchronously** — `readFileSync` is used to load JSON data files. This blocks the event loop on first call (~4.8 MB file parse). An async loading option is not available.

7. **`search()` with empty string** — Passing an empty string `search('')` returns all cities (since every string includes `""`), limited to the default limit of 10. This may be unexpected behavior.

8. **`listCountries()` returns 241 not 242** — The README states "242 countries" but the actual unique ISO2 code count in the data is 241. The discrepancy may be due to how territories/dependencies are counted.

9. **No browser support** — The library uses Node.js `fs` and `path` modules to load data, making it incompatible with browser environments without bundler configuration.

10. **Packed tarball in repo** — `novaedgedigitallabs-citykit-1.1.1.tgz` (1.8 MB) is committed to the repo. While `.gitignore` has `*.tgz`, this file was committed before the rule was added.

11. **Demo HTML files are large** — `index.html` (115 KB) and `citykit-demo.html` (93 KB) are self-contained demo pages committed to the repo. They are excluded from npm via `.npmignore` but bloat the git repository.

12. **`getContinentNames()` capitalization** — Only capitalizes the first letter, so `"north america"` becomes `"North america"` instead of `"North America"`. This function is exported from `continents.ts` but not re-exported from `index.ts`.

---

## What Has Been Done (Chronological)

1. **2026-06-09 23:51** — Project initialized with full codebase:
   - Data conversion script (`scripts/convert.mjs`) to convert `worldcities.xlsx` → JSON
   - TypeScript source with 8 core functions: `search`, `byCountry`, `capitals`, `nearest`, `distance`, `getByIso2`, `getCity`, `listCountries`
   - Haversine formula implementation
   - Data loader with lazy loading and caching
   - Lite entry point using `cities-lite.json` (population ≥ 500K)
   - tsup build configuration (dual CJS/ESM output)
   - `package.json`, `tsconfig.json`, `.gitignore`, `.npmignore`
   - README.md with full API documentation

2. **2026-06-09 23:57** — Added repository metadata (`repository`, `homepage`, `bugs` URLs) to `package.json`

3. **2026-06-09 23:57** — Version bumped to `1.0.1`, tagged `v1.0.1`

4. **2026-06-10 00:18** — Auto Publish (published to npm)

5. **2026-06-10 00:19** — Version bumped to `1.1.1`, tagged `v1.1.1`. Added 5 new utility functions:
   - `byPopulation()` — filter cities by population range
   - `byContinent()` — filter cities by continent
   - `fuzzySearch()` — typo-tolerant search using Levenshtein distance
   - `random()` — get a random city with optional filters
   - `stats()` — aggregated dataset statistics
   - New internal modules: `levenshtein.ts`, `continents.ts`
   - Vitest test suite added (`src/__tests__/index.test.ts`)
   - CJS smoke test script (`scripts/test.cjs`)

6. **2026-06-10 00:21** — README updated to document new utility functions

7. **2026-06-10 01:16** — README updated with missing TypeScript types in the TypeScript Support section

8. **2026-06-10 01:30** — Interactive playground demo page added (`index.html`, `citykit-demo.html`)

9. **2026-06-10 04:23** — Files updated (latest commit)

---

## What Can Be Done Next (Ideas)

1. **Add `CHANGELOG.md`** — Proper changelog following Keep a Changelog format
2. **Add GitHub Actions CI/CD** — Automated testing on push, automated npm publishing on tags
3. **Add `engines` field** — Specify minimum Node.js version in `package.json`
4. **Browser support** — Create a browser-compatible build that bundles data inline or uses fetch
5. **Async data loading** — Add `loadCities()` async method for non-blocking initialization
6. **Spatial indexing** — Implement k-d tree for `nearest()` to improve performance from O(n) to O(log n)
7. **Fix `getContinentNames()` capitalization** — Properly capitalize multi-word continent names
8. **Export `getContinentNames()`** — Currently only available internally
9. **Add `withinRadius()` function** — Find all cities within X km of a coordinate
10. **Add `timezone` field** — Extend the dataset with timezone information
11. **Add `byAdmin(adminName, iso2)` function** — Filter cities by state/province
12. **Remove `.tgz` from git** — Clean up committed tarball
13. **Clean up demo files** — Move HTML demos to a separate `demo/` folder or separate repo
14. **Add `v1.1.0` tag** — Version jumped from 1.0.1 to 1.1.1, skipping 1.1.0
15. **Deduplicate code** — `lite.ts` is a near-copy of `index.ts`; could be refactored to share a common implementation with a data source parameter
16. **Add benchmarks** — Performance benchmarks for `nearest()`, `fuzzySearch()`, and `search()`
17. **Publish `v1.2.0`** with accumulated improvements

---

## How To Publish a New Version

```bash
# 1. Make sure everything builds and tests pass
npm run build
npm test

# 2. Bump the version (pick one)
npm version patch   # 1.1.1 → 1.1.2
npm version minor   # 1.1.1 → 1.2.0
npm version major   # 1.1.1 → 2.0.0

# 3. Push the commit and tag to GitHub
git push origin main --tags

# 4. Publish to npm (scoped public package)
npm publish --access public

# 5. Verify on npm
open https://www.npmjs.com/package/@novaedgedigitallabs/citykit
```

> **Note:** You must be logged into npm as a member of the `@novaedgedigitallabs` organization. Run `npm login` if needed. The `prepublishOnly` script automatically runs `npm run build` before publishing.

---

## NovaEdge Context

| Field         | Value                                                                |
| ------------- | -------------------------------------------------------------------- |
| Organization  | NovaEdge Digital Labs                                                |
| GitHub Org    | [novaedgedigitallabs](https://github.com/novaedgedigitallabs)        |
| npm Org       | [@novaedgedigitallabs](https://www.npmjs.com/org/novaedgedigitallabs)|
| Website       | https://novaedgedigitallabs.in                                       |
| Package type  | Open-source utility library under the NovaEdge product portfolio     |
| Data source   | SimpleMaps World Cities Database                                     |

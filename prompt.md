Build a complete, publishable npm package called `citykit` — a world cities utility library.

---

## DATA FILE

A file `worldcities.xlsx` is available with 49,992 cities. Columns:
city, city_ascii, lat, lng, country, iso2, iso3, admin_name, capital, population, id

`capital` field values: "primary" (national capital), "admin" (state/province capital), "minor", or null/empty

---

## STEP 1 — Data Conversion Script

Create `scripts/convert.mjs` that:
1. Reads `worldcities.xlsx` using `xlsx` npm package
2. Converts to two JSON files:
   - `data/cities.json` — all 49,992 cities, array of arrays format (not objects) to save size
   - `data/cities-lite.json` — only cities with population >= 500000
3. Array format: [city, city_ascii, lat, lng, country, iso2, iso3, admin_name, capital, population, id]
4. Save a `data/columns.json` with the column index map:
   { city: 0, city_ascii: 1, lat: 2, lng: 3, country: 4, iso2: 5, iso3: 6, admin_name: 7, capital: 8, population: 9, id: 10 }
5. Log stats after conversion: total cities, lite cities count, file sizes

---

## STEP 2 — TypeScript Source

Use TypeScript. Build tool: `tsup` (generates both CJS and ESM).

### Types — `src/types.ts`

```ts
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
  country?: string;   // iso2 code e.g. "IN"
  limit?: number;     // default 10
  exact?: boolean;    // exact match only, default false
}

export interface NearestOptions {
  limit?: number;     // default 1
  country?: string;   // filter by iso2
}

export interface DistanceResult {
  km: number;
  miles: number;
}
```

### Main source — `src/index.ts`

Implement these exported functions:

#### `search(query: string, options?: SearchOptions): City[]`
- Case-insensitive substring match on `city_ascii` field
- If `options.exact` is true, exact match only
- If `options.country` provided, filter by iso2
- Returns up to `options.limit` results (default 10)
- Sort results: exact matches first, then starts-with, then contains

#### `byCountry(iso2: string): City[]`
- Returns all cities for a given country iso2 code (case-insensitive)

#### `capitals(iso2?: string): City[]`
- If iso2 provided: return cities where capital is "primary" OR "admin" for that country
- If no iso2: return only cities where capital === "primary" (national capitals of all countries)

#### `nearest(coords: { lat: number; lng: number }, options?: NearestOptions): City[]`
- Find nearest city/cities to given coordinates using Haversine formula
- Returns `options.limit` nearest cities (default 1)
- If `options.country` provided, only search within that country

#### `distance(from: string | { lat: number; lng: number }, to: string | { lat: number; lng: number }): DistanceResult | null`
- If string passed, find city by exact name first (city_ascii match)
- Calculate distance using Haversine formula
- Return { km, miles } rounded to 2 decimal places
- Return null if either city not found

#### `getByIso2(iso2: string): { country: string; iso3: string; cities: City[] } | null`
- Get country info + all cities for iso2 code

#### `getCity(name: string, iso2?: string): City | null`
- Get single city by exact name (city_ascii), optionally filtered by country

#### `listCountries(): { country: string; iso2: string; iso3: string; count: number }[]`
- Returns all unique countries with city count, sorted by country name

### Internal Haversine utility — `src/haversine.ts`
```ts
export function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number
// Returns distance in kilometers
```
Formula: standard Haversine, Earth radius = 6371 km

### Data loading — `src/data.ts`
- Lazy-load cities data (load on first function call, cache in memory)
- Export `getCities(): City[]` and `getCitiesRaw(): any[][]`
- Parse array format back to City objects using columns map
- Handle null/empty population gracefully

---

## STEP 3 — package.json

```json
{
  "name": "@novaedgedigitallabs/citykit",
  "version": "1.0.0",
  "description": "World cities search, distance, and geo utilities — 49,992 cities across 242 countries",
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./lite": {
      "import": "./dist/lite.js",
      "require": "./dist/lite.cjs",
      "types": "./dist/lite.d.ts"
    }
  },
  "files": ["dist", "data"],
  "scripts": {
    "convert": "node scripts/convert.mjs",
    "build": "tsup",
    "dev": "tsup --watch",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["cities", "world", "geo", "distance", "search", "coordinates", "countries"],
  "license": "MIT"
}
```

---

## STEP 4 — tsup.config.ts

```ts
import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    minify: true,
  },
  {
    entry: { lite: 'src/lite.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
  }
])
```

---

## STEP 5 — Lite entry — `src/lite.ts`

Same exports as `src/index.ts` but loads `cities-lite.json` instead of `cities.json`.
All functions work identically.

---

## STEP 6 — README.md

Write a proper README with:
- Install: `npm install citykit`
- All 7 function examples with code snippets
- Lite version usage: `import { search } from 'citykit/lite'`
- Data source credit: SimpleMaps World Cities Database
- Bundle size note (full vs lite)
- TypeScript support note

---

## STEP 7 — `.npmignore`

Exclude: `scripts/`, `worldcities.xlsx`, `src/`, `*.config.ts`, `node_modules/`
Include: `dist/`, `data/`, `README.md`, `package.json`

---

## DEV DEPENDENCIES needed:
tsup, typescript, @types/node, xlsx (for conversion script only)

## RUNTIME DEPENDENCIES:
none (data bundled in package)

---

## FINAL CHECKLIST before finishing:
1. Run `node scripts/convert.mjs` — confirm data files generated
2. Run `npm run build` — confirm dist folder has .js, .cjs, .d.ts files
3. Test all 7 functions with quick node script
4. Confirm `citykit/lite` export works

Built and maintained by [NovaEdge Digital Labs](https://novaedgedigitallabs.tech)
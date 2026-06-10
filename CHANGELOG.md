# Changelog

All notable changes to `@novaedgedigitallabs/citykit` will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.2.0] - 2025-06-10

### Added
- `withinRadius(coords, radiusKm, options?)` — find all cities within X km of a point
- `byAdmin(adminName, iso2?)` — filter cities by state/province name
- `getContinentNames()` — now exported from main entry point
- `engines` field in package.json specifying Node.js >= 14.0.0
- `WithinRadiusOptions` TypeScript type
- GitHub Actions CI workflow (test on push/PR)
- GitHub Actions publish workflow (auto-publish on version tags)

### Fixed
- `search('')` with empty string now returns `[]` instead of all cities
- `distance()` now picks highest-population city on duplicate name collision
- `getContinentNames()` now correctly capitalizes multi-word continent names (e.g. "North America" not "North america")

### Changed
- Refactored `index.ts` and `lite.ts` to use shared `core.ts` factory functions (eliminates code duplication)
- Removed committed `.tgz` artifact from git history

## [1.1.1] - 2025-06-10

### Added
- Interactive playground demo page (index.html)
- Updated README with TypeScript types in TypeScript Support section

## [1.1.0] - 2025-06-10

### Added
- `byPopulation(options)` — filter cities by population range
- `byContinent(continent)` — get all cities in a continent
- `fuzzySearch(query, options?)` — typo-tolerant search using Levenshtein distance
- `random(options?)` — get a random city with optional filters
- `stats()` — aggregated dataset statistics
- Levenshtein distance algorithm (levenshtein.ts)
- Continent-to-ISO2 mapping (continents.ts)
- Vitest test suite (20 tests)

## [1.0.1] - 2025-06-09

### Changed
- Added repository, homepage, and bugs metadata to package.json

## [1.0.0] - 2025-06-09

### Added
- Initial release — 49,992 cities across 242 countries
- `search()` — substring city search with ranking
- `byCountry()` — all cities by ISO2 code
- `capitals()` — national and state capitals
- `nearest()` — Haversine-based geo proximity search
- `distance()` — distance in km and miles
- `getByIso2()` — country info and cities
- `getCity()` — single city lookup
- `listCountries()` — all countries with city counts
- Full TypeScript support
- ESM and CJS builds via tsup
- Lite variant (citykit/lite) — population >= 500,000

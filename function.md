# NovaEdge CityKit Functions

Here is a complete list of all functions provided by the `citykit` library:

### Search & Filtering
*   **`search(query: string, options?: SearchOptions)`**
    Search cities by name. Performs a case-insensitive substring match on the `city_ascii` field.
*   **`fuzzySearch(query: string, options?: FuzzySearchOptions)`**
    Fuzzy search cities by name using Levenshtein distance for spelling tolerance.
*   **`autocomplete(query: string, options?: AutocompleteOptions)`**
    *(v1.3+)* Fast prefix-match autocomplete for search inputs. Enforces a `minChars` threshold (default: 1) to avoid unnecessary lookups on empty or very short queries. Returns up to `limit` results sorted by population descending.
*   **`getCity(name: string, iso2?: string)`**
    Get a single city by exact name, optionally filtered by a specific country code.
*   **`byAdmin(query: string)`**
    Filter cities by `admin_name` (state, province, or region). Performs a case-insensitive substring match.

### Geographic & Spatial
*   **`nearest(lat: number, lng: number, options?: NearestOptions)`**
    Find the nearest cities to a specific set of coordinates using the Haversine formula.
*   **`withinRadius(lat: number, lng: number, options?: WithinRadiusOptions)`**
    Find all cities within a given radius (in kilometers) from a specific coordinate point, sorted by distance ascending.
*   **`distance(origin: string | Coordinates, destination: string | Coordinates)`**
    Calculate the distance (in km) between two cities (by name) or coordinate pairs. Automatically picks the highest-population city in the event of name collisions.
*   **`getBoundingBox(lat: number, lng: number, radiusKm: number)`**
    *(v1.3+)* Returns a `{ minLat, maxLat, minLng, maxLng }` bounding box object for a given center point and radius. Useful as a fast pre-filter to reduce the candidate set before applying the more expensive Haversine distance check.

### Demographics & Statistics
*   **`byPopulation(options: PopulationOptions)`**
    Get cities filtered by a population range (min/max).
*   **`stats()`**
    Retrieve aggregated dataset statistics (total cities, total countries, total population, etc.).

### Geography & Geopolitics
*   **`byCountry(iso2: string)`**
    Get an array of all cities belonging to a given country's ISO2 code.
*   **`getByIso2(iso2: string)`**
    Get detailed country information along with an array of all its cities.
*   **`capitals(iso2?: string)`**
    Get capital cities. Without an ISO2 code, it returns all national capitals worldwide. If an ISO2 code is provided, it returns the primary national capital and administrative state/provincial capitals for that country.
*   **`listCountries()`**
    List all unique countries present in the dataset along with their total city counts, sorted alphabetically.
*   **`byContinent(continentName: string)`**
    Get all cities located within a specific continent (case-insensitive).
*   **`getContinentNames()`**
    Returns a list of all valid continent names recognized by the library.

### India Utilities *(v1.3+)*
*   **`getIndianCities()`**
    Returns the full array of Indian city objects (equivalent to `byCountry('IN')` but named explicitly for discoverability).
*   **`getCitiesByState(stateName: string)`**
    Filter Indian cities by state name. Automatically normalizes Unicode diacritics so that queries like `"Maharashtra"` match the raw dataset entry `"Mahārāshtra"`. Case-insensitive.
*   **`getCityTier(cityName: string)`**
    Returns the tier classification (`1`, `2`, or `3`) for an Indian city based on population thresholds. Returns `null` if the city is not found.
*   **`getIndianStates()`**
    Returns a deduplicated, sorted list of all unique Indian state names as stored in the dataset.
*   **`getTierThresholds()`**
    Returns the population cutoff values used for tier classification: `{ tier1: number, tier2: number }`.

### Utility
*   **`random(options?: RandomOptions)`**
    Get a random city from the dataset. Can be optionally scoped to a specific country or continent.

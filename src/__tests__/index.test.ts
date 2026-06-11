import { describe, it, expect } from 'vitest';
import * as citykit from '../index.js';
import * as citykitLite from '../lite.js';

import { CONTINENT_MAP } from '../continents.js';

// ─────────────────────────────────────────────────────────────────────────────
// Original v1.0–v1.2 tests
// ─────────────────────────────────────────────────────────────────────────────
describe('CityKit Full Dataset', () => {
  it('should search cities correctly', () => {
    const results = citykit.search('london', { limit: 3 });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].city_ascii.toLowerCase()).toBe('london');

    const exactResults = citykit.search('London', { exact: true });
    expect(exactResults.length).toBeGreaterThan(0);
    expect(exactResults[0].city_ascii).toBe('London');
  });

  it('should filter by country', () => {
    const results = citykit.byCountry('IN');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((c) => c.iso2 === 'IN')).toBe(true);
  });

  it('should get capitals', () => {
    const worldCapitals = citykit.capitals();
    expect(worldCapitals.length).toBeGreaterThan(0);
    expect(worldCapitals.every((c) => c.capital === 'primary')).toBe(true);

    const countryCapitals = citykit.capitals('IN');
    expect(countryCapitals.length).toBeGreaterThan(0);
    expect(countryCapitals.every((c) => c.iso2 === 'IN' && (c.capital === 'primary' || c.capital === 'admin'))).toBe(true);
  });

  it('should find nearest city', () => {
    const results = citykit.nearest({ lat: 28.6139, lng: 77.209 }, { limit: 1 });
    expect(results.length).toBe(1);
    expect(['Delhi', 'New Delhi']).toContain(results[0].city_ascii);
  });

  it('should calculate distance', () => {
    const dist = citykit.distance('Mumbai', 'Delhi');
    expect(dist).not.toBeNull();
    expect(dist!.km).toBeGreaterThan(1000);
    expect(dist!.miles).toBeGreaterThan(600);

    const distCoords = citykit.distance(
      { lat: 18.9667, lng: 72.8258 },
      { lat: 28.6667, lng: 77.2167 }
    );
    expect(distCoords).not.toBeNull();
    expect(Math.abs(distCoords!.km - dist!.km)).toBeLessThan(50);
  });

  it('should get country info by ISO2', () => {
    const result = citykit.getByIso2('DE');
    expect(result).not.toBeNull();
    expect(result!.country).toBe('Germany');
    expect(result!.cities.length).toBeGreaterThan(0);
  });

  it('should get single city', () => {
    const city = citykit.getCity('Paris', 'FR');
    expect(city).not.toBeNull();
    expect(city!.country).toBe('France');

    const noCity = citykit.getCity('NonExistentCity');
    expect(noCity).toBeNull();
  });

  it('should list countries with counts', () => {
    const countries = citykit.listCountries();
    expect(countries.length).toBeGreaterThan(0);
    expect(countries[0].country).toBeDefined();
    expect(countries[0].count).toBeGreaterThan(0);
  });

  it('should filter by population range', () => {
    const results = citykit.byPopulation({ min: 10000000 });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].population).toBeGreaterThanOrEqual(10000000);

    // sorting desc by default
    expect(results[0].population!).toBeGreaterThanOrEqual(results[1].population!);

    const ascResults = citykit.byPopulation({ min: 10000000, sort: 'asc' });
    expect(ascResults[0].population!).toBeLessThanOrEqual(ascResults[1].population!);
  });

  it('should filter by continent', () => {
    const results = citykit.byContinent('Asia');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((c) => c.city_ascii === 'Tokyo')).toBe(true);
    const asiaCodes = new Set(CONTINENT_MAP.asia.map(code => code.toUpperCase()));
    expect(results.every((c) => asiaCodes.has(c.iso2.toUpperCase()))).toBe(true);
  });

  it('should fuzzy search correctly', () => {
    const results = citykit.fuzzySearch('bangalor');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].city_ascii).toBe('Bangalore');

    const limitResults = citykit.fuzzySearch('paris', { limit: 2 });
    expect(limitResults.length).toBeLessThanOrEqual(2);
  });

  it('should get random city', () => {
    const city = citykit.random();
    expect(city).not.toBeNull();
    expect(city!.city).toBeDefined();

    const countryCity = citykit.random({ country: 'US' });
    expect(countryCity).not.toBeNull();
    expect(countryCity!.iso2).toBe('US');
  });

  it('should get stats', () => {
    const stats = citykit.stats();
    expect(stats.totalCities).toBe(49992);
    expect(stats.totalCountries).toBeGreaterThan(200);
    expect(stats.largestCity.population).toBeGreaterThan(30000000);
  });

  it('should return empty array for empty search string', () => {
    expect(citykit.search('')).toEqual([]);
    expect(citykit.search('  ')).toEqual([]);
  });

  it('should find cities within radius of Indore', () => {
    const results = citykit.withinRadius({ lat: 22.7196, lng: 75.8577 }, 100);
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((c) => c.city_ascii === 'Indore')).toBe(true);
  });

  it('should find cities within radius with country filter', () => {
    const results = citykit.withinRadius(
      { lat: 22.7196, lng: 75.8577 },
      100,
      { country: 'IN' }
    );
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.every((c) => c.iso2 === 'IN')).toBe(true);
  });

  it('should filter by admin name with country', () => {
    const results = citykit.byAdmin('Mahār', 'IN');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((c) => c.city_ascii === 'Mumbai')).toBe(true);
    expect(results.every((c) => c.iso2 === 'IN')).toBe(true);
  });

  it('should filter by admin name without country', () => {
    const results = citykit.byAdmin('California');
    expect(results.length).toBeGreaterThan(0);
    const firstPop = results[0].population ?? 0;
    const secondPop = results[1]?.population ?? 0;
    expect(firstPop).toBeGreaterThanOrEqual(secondPop);
  });

  it('should export getContinentNames with correct capitalization', () => {
    const names = citykit.getContinentNames();
    expect(Array.isArray(names)).toBe(true);
    expect(names).toContain('North America');
    expect(names).toContain('South America');
    expect(names).not.toContain('North america');
    expect(names).not.toContain('South america');
  });
});

describe('CityKit Lite Dataset', () => {
  it('should search cities in lite', () => {
    const results = citykitLite.search('london');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].city_ascii).toBe('London');
  });

  it('should calculate distance in lite', () => {
    const dist = citykitLite.distance('Mumbai', 'Delhi');
    expect(dist).not.toBeNull();
  });

  it('should filter by population range in lite', () => {
    const results = citykitLite.byPopulation({ min: 1000000 });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].population).toBeGreaterThanOrEqual(1000000);
  });

  it('should filter by continent in lite', () => {
    const results = citykitLite.byContinent('Asia');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should fuzzy search in lite', () => {
    const results = citykitLite.fuzzySearch('tokyo');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].city_ascii).toBe('Tokyo');
  });

  it('should get random city in lite', () => {
    const city = citykitLite.random();
    expect(city).not.toBeNull();
  });

  it('should get stats in lite', () => {
    const stats = citykitLite.stats();
    expect(stats.totalCities).toBe(1422);
    expect(stats.largestCity.population).toBeGreaterThan(30000000);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// v1.3 — Enriched City fields
// ─────────────────────────────────────────────────────────────────────────────
describe('v1.3 — Enriched City Fields', () => {
  it('City objects should have isCapital field — true for capitals', () => {
    const tokyo = citykit.getCity('Tokyo', 'JP');
    expect(tokyo).not.toBeNull();
    expect(typeof tokyo!.isCapital).toBe('boolean');
    expect(tokyo!.isCapital).toBe(true);
  });

  it('isCapital should be false for non-capital cities', () => {
    const osaka = citykit.getCity('Osaka', 'JP');
    expect(osaka).not.toBeNull();
    expect(osaka!.isCapital).toBe(false);
  });

  it('City objects should have continent field', () => {
    const delhi = citykit.getCity('Delhi', 'IN');
    expect(delhi!.continent).toBe('Asia');

    const berlin = citykit.getCity('Berlin', 'DE');
    expect(berlin!.continent).toBe('Europe');

    const nyc = citykit.search('New York', { country: 'US', limit: 1 });
    expect(nyc[0].continent).toBe('North America');
  });

  it('City objects should have timezone offset', () => {
    const delhi = citykit.getCity('Delhi', 'IN');
    expect(delhi!.timezone).toBe(5.5);

    const london = citykit.getCity('London', 'GB');
    expect(london!.timezone).toBe(0);

    const tokyo = citykit.getCity('Tokyo', 'JP');
    expect(tokyo!.timezone).toBe(9);
  });

  it('City objects should have currency code', () => {
    const mumbai = citykit.getCity('Mumbai', 'IN');
    expect(mumbai!.currency).toBe('INR');

    const paris = citykit.getCity('Paris', 'FR');
    expect(paris!.currency).toBe('EUR');

    const nyc = citykit.search('New York', { country: 'US', limit: 1 });
    expect(nyc[0].currency).toBe('USD');
  });

  it('City objects should have callingCode', () => {
    const bangalore = citykit.getCity('Bangalore', 'IN');
    expect(bangalore!.callingCode).toBe('+91');

    const berlin = citykit.getCity('Berlin', 'DE');
    expect(berlin!.callingCode).toBe('+49');
  });

  it('getCountryMeta should return correct metadata', () => {
    const inMeta = citykit.getCountryMeta('IN');
    expect(inMeta).toBeDefined();
    expect(inMeta!.currency).toBe('INR');
    expect(inMeta!.callingCode).toBe('+91');
    expect(inMeta!.timezone).toBe(5.5);

    expect(citykit.getCountryMeta('XX')).toBeUndefined();
  });

  it('getCountryContinent should resolve iso2 to continent', () => {
    expect(citykit.getCountryContinent('IN')).toBe('Asia');
    expect(citykit.getCountryContinent('FR')).toBe('Europe');
    expect(citykit.getCountryContinent('BR')).toBe('South America');
    expect(citykit.getCountryContinent('NG')).toBe('Africa');
    expect(citykit.getCountryContinent('AU')).toBe('Oceania');
    expect(citykit.getCountryContinent('US')).toBe('North America');
    expect(citykit.getCountryContinent('XX')).toBe('');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// v1.4 — Geo utilities: getBoundingBox
// ─────────────────────────────────────────────────────────────────────────────
describe('v1.4 — getBoundingBox', () => {
  it('should return correct bounding box structure', () => {
    const box = citykit.getBoundingBox(28.6139, 77.209, 100);
    expect(box).toHaveProperty('north');
    expect(box).toHaveProperty('south');
    expect(box).toHaveProperty('east');
    expect(box).toHaveProperty('west');
  });

  it('north > lat, south < lat, east > lng, west < lng', () => {
    const lat = 28.6139;
    const lng = 77.209;
    const box = citykit.getBoundingBox(lat, lng, 100);
    expect(box.north).toBeGreaterThan(lat);
    expect(box.south).toBeLessThan(lat);
    expect(box.east).toBeGreaterThan(lng);
    expect(box.west).toBeLessThan(lng);
  });

  it('should clamp north to 90 and south to -90', () => {
    const northPole = citykit.getBoundingBox(89, 0, 500);
    expect(northPole.north).toBeLessThanOrEqual(90);

    const southPole = citykit.getBoundingBox(-89, 0, 500);
    expect(southPole.south).toBeGreaterThanOrEqual(-90);
  });

  it('larger radius should produce larger bounding box', () => {
    const small = citykit.getBoundingBox(20, 80, 50);
    const large = citykit.getBoundingBox(20, 80, 200);
    expect(large.north - large.south).toBeGreaterThan(small.north - small.south);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// v1.5 — Autocomplete
// ─────────────────────────────────────────────────────────────────────────────
describe('v1.5 — autocomplete()', () => {
  it('should return results for valid query', () => {
    const results = citykit.autocomplete('Mumbai');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].city_ascii).toBe('Mumbai');
  });

  it('should return [] when query is shorter than minChars', () => {
    expect(citykit.autocomplete('M', { minChars: 2 })).toEqual([]);
    expect(citykit.autocomplete('Mu', { minChars: 2 }).length).toBeGreaterThan(0);
  });

  it('should respect default minChars of 1', () => {
    expect(citykit.autocomplete('').length).toBe(0);
    expect(citykit.autocomplete('M').length).toBeGreaterThan(0);
  });

  it('should filter by country in autocomplete', () => {
    const results = citykit.autocomplete('Pune', { country: 'IN' });
    expect(results.every((c) => c.iso2 === 'IN')).toBe(true);
  });

  it('should respect limit in autocomplete', () => {
    const results = citykit.autocomplete('London', { limit: 3 });
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it('results should be prefix-sorted (starts-with before contains)', () => {
    const results = citykit.autocomplete('ban', { limit: 10 });
    const banIndex = results.findIndex((c) => c.city_ascii.toLowerCase().startsWith('ban'));
    const notBanIndex = results.findIndex((c) => !c.city_ascii.toLowerCase().startsWith('ban'));
    if (banIndex !== -1 && notBanIndex !== -1) {
      expect(banIndex).toBeLessThan(notBanIndex);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// v1.6 — India-specific utilities
// ─────────────────────────────────────────────────────────────────────────────
describe('v1.6 — India-specific utilities', () => {
  it('getIndianCities() should return only IN cities', () => {
    const cities = citykit.getIndianCities();
    expect(cities.length).toBeGreaterThan(7000);
    expect(cities.every((c) => c.iso2 === 'IN')).toBe(true);
  });

  it('getCitiesByState() should filter by state and include Mumbai for Maharashtra', () => {
    const cities = citykit.getCitiesByState('Maharashtra');
    expect(cities.length).toBeGreaterThan(0);
    expect(cities.every((c) => c.iso2 === 'IN')).toBe(true);
    expect(cities.some((c) => c.city_ascii === 'Mumbai')).toBe(true);
  });

  it('getCitiesByState() results should be sorted by population desc', () => {
    const cities = citykit.getCitiesByState('Uttar Pradesh');
    const pops = cities.filter((c) => c.population !== null).map((c) => c.population!);
    for (let i = 0; i < pops.length - 1; i++) {
      expect(pops[i]).toBeGreaterThanOrEqual(pops[i + 1]);
    }
  });

  it('getCityTier() should return Tier 1 for mega cities', () => {
    expect(citykit.getCityTier('Mumbai')).toBe('Tier 1');
    expect(citykit.getCityTier('Delhi')).toBe('Tier 1');
    expect(citykit.getCityTier('Bangalore')).toBe('Tier 1');
  });

  it('getCityTier() should return Tier 1 or Tier 2 for Indore (~2M)', () => {
    const tier = citykit.getCityTier('Indore');
    expect(['Tier 1', 'Tier 2']).toContain(tier);
  });

  it('getCityTier() should return null for unknown city', () => {
    expect(citykit.getCityTier('NotARealIndianCity')).toBeNull();
  });

  it('getIndianStates() should return sorted unique state names', () => {
    const states = citykit.getIndianStates();
    expect(states.length).toBeGreaterThan(20);
    for (let i = 0; i < states.length - 1; i++) {
      expect(states[i].localeCompare(states[i + 1])).toBeLessThanOrEqual(0);
    }
  });

  it('getTierThresholds() should return correct tier boundaries', () => {
    const thresholds = citykit.getTierThresholds();
    expect(thresholds.tier1).toBe(4_000_000);
    expect(thresholds.tier2).toBe(500_000);
  });
});

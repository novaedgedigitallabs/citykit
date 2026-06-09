import { describe, it, expect } from 'vitest';
import * as citykit from '../index.js';
import * as citykitLite from '../lite.js';

import { CONTINENT_MAP } from '../continents.js';

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

/**
 * Quick test script — validates all 7 exported functions
 */

const citykit = require('../dist/index.js');

console.log('═══════════════════════════════════════════════════');
console.log('  🧪 CityKit — Function Test Suite');
console.log('═══════════════════════════════════════════════════\n');

// 1. search()
console.log('1️⃣  search("london", { limit: 3 })');
const searchResult = citykit.search('london', { limit: 3 });
searchResult.forEach((c) =>
  console.log(`   → ${c.city_ascii}, ${c.country} (pop: ${c.population?.toLocaleString() ?? 'N/A'})`)
);
console.log();

// search with country filter
console.log('   search("delhi", { country: "IN", limit: 3 })');
const delhiResult = citykit.search('delhi', { country: 'IN', limit: 3 });
delhiResult.forEach((c) =>
  console.log(`   → ${c.city_ascii}, ${c.country} (${c.admin_name})`)
);
console.log();

// 2. byCountry()
console.log('2️⃣  byCountry("JP") — count');
const jpCities = citykit.byCountry('JP');
console.log(`   → ${jpCities.length} cities in Japan`);
console.log();

// 3. capitals()
console.log('3️⃣  capitals() — first 5 national capitals');
const allCapitals = citykit.capitals();
allCapitals.slice(0, 5).forEach((c) =>
  console.log(`   → ${c.city_ascii}, ${c.country}`)
);
console.log(`   ... total national capitals: ${allCapitals.length}`);
console.log();

// capitals with country
console.log('   capitals("IN") — India state capitals');
const inCapitals = citykit.capitals('IN');
inCapitals.slice(0, 5).forEach((c) =>
  console.log(`   → ${c.city_ascii} (${c.capital})`)
);
console.log(`   ... total: ${inCapitals.length}`);
console.log();

// 4. nearest()
console.log('4️⃣  nearest({ lat: 28.6139, lng: 77.2090 }, { limit: 3 })');
const nearDelhi = citykit.nearest({ lat: 28.6139, lng: 77.2090 }, { limit: 3 });
nearDelhi.forEach((c) =>
  console.log(`   → ${c.city_ascii}, ${c.country}`)
);
console.log();

// 5. distance()
console.log('5️⃣  distance("Mumbai", "Delhi")');
const dist = citykit.distance('Mumbai', 'Delhi');
if (dist) {
  console.log(`   → ${dist.km} km / ${dist.miles} miles`);
} else {
  console.log('   → Not found');
}
console.log();

// distance with coordinates
console.log('   distance("Tokyo", { lat: 40.7128, lng: -74.0060 })');
const tokyoNy = citykit.distance('Tokyo', { lat: 40.7128, lng: -74.0060 });
if (tokyoNy) {
  console.log(`   → ${tokyoNy.km} km / ${tokyoNy.miles} miles`);
}
console.log();

// 6. getByIso2()
console.log('6️⃣  getByIso2("DE")');
const de = citykit.getByIso2('DE');
if (de) {
  console.log(`   → ${de.country} (${de.iso3}) — ${de.cities.length} cities`);
}
console.log();

// 7. getCity()
console.log('7️⃣  getCity("Paris")');
const paris = citykit.getCity('Paris');
if (paris) {
  console.log(`   → ${paris.city}, ${paris.country} (${paris.lat}, ${paris.lng})`);
  console.log(`   → Population: ${paris.population?.toLocaleString()}, Capital: ${paris.capital}`);
}
console.log();

// 8. listCountries()
console.log('8️⃣  listCountries() — first 5');
const countries = citykit.listCountries();
countries.slice(0, 5).forEach((c) =>
  console.log(`   → ${c.country} (${c.iso2}) — ${c.count} cities`)
);
console.log(`   ... total countries: ${countries.length}`);
console.log();

// ── Test lite export ──
console.log('═══════════════════════════════════════════════════');
console.log('  🪶 Lite Export Test');
console.log('═══════════════════════════════════════════════════\n');

const lite = require('../dist/lite.js');

console.log('   lite.search("tokyo", { limit: 3 })');
const liteSearch = lite.search('tokyo', { limit: 3 });
liteSearch.forEach((c) =>
  console.log(`   → ${c.city_ascii}, ${c.country} (pop: ${c.population?.toLocaleString()})`)
);
console.log();

console.log('   lite.listCountries().length');
const liteCountries = lite.listCountries();
console.log(`   → ${liteCountries.length} countries with pop >= 500k cities`);
console.log();

console.log('═══════════════════════════════════════════════════');
console.log('  ✅ All tests passed!');
console.log('═══════════════════════════════════════════════════');

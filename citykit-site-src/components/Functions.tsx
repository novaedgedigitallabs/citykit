import { 
  Search, Zap, MapPin, Navigation, Circle, Flag, 
  Globe, Map, Users, Star, Building2, Info, List, 
  Shuffle, BarChart2 
} from 'lucide-react';

export default function Functions() {
  const functions = [
    { name: 'search()', icon: <Search size={20} />, description: 'Substring search with smart ranking' },
    { name: 'fuzzySearch()', icon: <Zap size={20} />, description: 'Typo-tolerant search with Levenshtein' },
    { name: 'nearest()', icon: <MapPin size={20} />, description: 'Closest city to any coordinates' },
    { name: 'distance()', icon: <Navigation size={20} />, description: 'km & miles between any two cities' },
    { name: 'withinRadius()', icon: <Circle size={20} />, description: 'All cities within X km of a point' },
    { name: 'byCountry()', icon: <Flag size={20} />, description: 'Every city in a country by ISO2' },
    { name: 'byContinent()', icon: <Globe size={20} />, description: 'Filter cities by continent' },
    { name: 'byAdmin()', icon: <Map size={20} />, description: 'Filter by state or province' },
    { name: 'byPopulation()', icon: <Users size={20} />, description: 'Filter by population range' },
    { name: 'capitals()', icon: <Star size={20} />, description: 'National and state capitals' },
    { name: 'getCity()', icon: <Building2 size={20} />, description: 'Single city exact lookup' },
    { name: 'getByIso2()', icon: <Info size={20} />, description: 'Country info and all its cities' },
    { name: 'listCountries()', icon: <List size={20} />, description: 'All 242 countries with city counts' },
    { name: 'random()', icon: <Shuffle size={20} />, description: 'Random city with optional filters' },
    { name: 'stats()', icon: <BarChart2 size={20} />, description: 'Full dataset statistics' },
  ];

  return (
    <section className="w-full py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-space)] font-bold text-4xl mb-3 text-white">
            Everything you need
          </h2>
          <p className="text-[var(--muted)] text-lg">
            15 utility functions. One install.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {functions.map((fn) => (
            <div key={fn.name} className="flex flex-col p-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] glow-hover">
              <div className="flex items-center gap-3 mb-4 text-[var(--muted)]">
                {fn.icon}
              </div>
              <div className="font-[family-name:var(--font-mono)] text-[var(--primary-glow)] font-bold text-lg mb-2">
                {fn.name}
              </div>
              <p className="text-sm text-[var(--text)] opacity-90">
                {fn.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

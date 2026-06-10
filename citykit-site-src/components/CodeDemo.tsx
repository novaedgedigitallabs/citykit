'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

const codeSnippets = {
  Search: `// Exact substring search
const cities = search('delhi', { country: 'IN', limit: 3 })
// → [{ city: 'Delhi', population: 32226000, ... }]

// Typo-tolerant fuzzy search
const result = fuzzySearch('bangalor')
// → [{ city: 'Bangalore', country: 'India', ... }]`,
  Distance: `// Distance between two cities
distance('Mumbai', 'Delhi')
// → { km: 1153.64, miles: 716.84 }

// Cities within 100km of Indore
withinRadius({ lat: 22.7196, lng: 75.8577 }, 100)
// → [{ city: 'Indore', ... }, { city: 'Ujjain', ... }, ...]

// Nearest city to coordinates
nearest({ lat: 48.8584, lng: 2.2945 })
// → [{ city: 'Paris', country: 'France', ... }]`,
  Geo: `// All cities in Asia
byContinent('Asia') // → 18,000+ cities

// All national capitals
capitals() // → 242 capitals

// Dataset statistics
stats()
// → { totalCities: 49992, totalCountries: 241,
//     largestCity: { city: 'Tokyo', population: 37785000 },
//     totalPopulation: 5258389250 }`
};

const imports = {
  Search: `import { search, fuzzySearch } from '@novaedgedigitallabs/citykit'`,
  Distance: `import { distance, withinRadius, nearest } from '@novaedgedigitallabs/citykit'`,
  Geo: `import { byContinent, capitals, stats } from '@novaedgedigitallabs/citykit'`
};

const highlightCode = (code: string, importStatement: string) => {
  let formatted = (importStatement + '\n\n' + code)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // Comments
  formatted = formatted.replace(/(\/\/.*)/g, '<span class="text-[#4B5563]">$1</span>');
  
  // Strings
  formatted = formatted.replace(/'([^']+)'/g, '<span class="text-[#06B6D4]">\'$1\'</span>');
  
  // Keywords
  formatted = formatted.replace(/\b(import|from|const)\b/g, '<span class="text-[#7C3AED]">$1</span>');
  
  // Functions
  formatted = formatted.replace(/([a-zA-Z0-9_]+)(?=\()/g, '<span class="text-[#A78BFA]">$1</span>');
  
  // Numbers
  formatted = formatted.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-[#F59E0B]">$1</span>');
  
  return formatted;
};

export default function CodeDemo() {
  const tabs = ['Search', 'Distance', 'Geo'] as const;
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Search');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = imports[activeTab] + '\n\n' + codeSnippets[activeTab];
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="w-full py-24 px-6 bg-[var(--bg)] border-y border-[var(--border)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-[family-name:var(--font-space)] font-bold text-4xl mb-10 text-center text-white">
          Simple API. Powerful results.
        </h2>

        <div className="w-full bg-[var(--code-bg)] border border-[var(--border)] rounded-[8px] overflow-hidden shadow-2xl">
          {/* Tabs */}
          <div className="flex border-b border-[var(--border)] bg-[#0A0A10]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={\`px-6 py-4 text-sm font-medium transition-colors relative \${
                  activeTab === tab ? 'text-white' : 'text-[var(--muted)] hover:text-white'
                }\`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Code Area */}
          <div className="relative p-6 group">
            <button
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 rounded-md bg-[rgba(255,255,255,0.05)] border border-[var(--border)] text-[var(--muted)] hover:text-white transition-colors flex items-center gap-2 opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              {copied && <span className="text-xs font-medium text-green-500">Copied!</span>}
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="font-[family-name:var(--font-mono)] text-[13px] leading-relaxed whitespace-pre overflow-x-auto text-[#F0EFF5]"
                dangerouslySetInnerHTML={{ __html: highlightCode(codeSnippets[activeTab], imports[activeTab]) }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import { search } from '@novaedgedigitallabs/citykit';

export default function Hero() {
  const [query, setQuery] = useState('Tokyo');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    try {
      if (query.trim() !== '') {
        const res = search(query, { limit: 5 });
        setResults(res || []);
      } else {
        setResults([]);
      }
    } catch (e) {
      // Mock data in case the package fails to load during dev
      if (query.toLowerCase().includes('tokyo')) {
        setResults([{ city: 'Tokyo', country: 'Japan', population: 37785000 }]);
      } else {
        setResults([]);
      }
    }
  }, [query]);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center grid-bg px-6 py-24 lg:py-0">
      <div className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[60%] flex flex-col items-start"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-[var(--border)] bg-[rgba(124,58,237,0.1)] text-[var(--primary)] font-[family-name:var(--font-mono)] text-sm mb-8">
            npm install @novaedgedigitallabs/citykit
          </div>
          
          <h1 className="font-[family-name:var(--font-space)] font-bold text-5xl lg:text-[72px] leading-[1.1] tracking-tight mb-6">
            The world&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]">cities.</span><br />
            In one package.
          </h1>
          
          <p className="font-[family-name:var(--font-inter)] text-lg text-[var(--muted)] max-w-xl mb-10">
            49,992 cities. 242 countries. Zero dependencies.<br />
            Search, filter, and calculate distances — all in TypeScript.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="https://www.npmjs.com/package/@novaedgedigitallabs/citykit" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-glow)] transition-colors text-center">
              View on npm
            </Link>
            <Link href="https://github.com/novaedgedigitallabs/citykit" target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full border border-[var(--border)] text-[var(--text)] font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors text-center">
              GitHub →
            </Link>
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[40%]"
        >
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 glow-shadow">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any city... try Mumbai"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--primary)] transition-colors mb-6 font-[family-name:var(--font-mono)] text-sm"
            />
            
            <div className="min-h-[250px] flex flex-col gap-3">
              <AnimatePresence>
                {results.map((result: any, i: number) => (
                  <motion.div 
                    key={`${result.city}-${result.country}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex justify-between items-center py-2 border-b border-[var(--border)] last:border-0"
                  >
                    <div>
                      <div className="font-bold">{result.city}</div>
                      <div className="text-sm text-[var(--muted)]">{result.country}</div>
                    </div>
                    <div className="text-sm font-[family-name:var(--font-mono)] text-[var(--accent)]">
                      {result.population?.toLocaleString() || 'N/A'}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {results.length === 0 && (
                <div className="text-center text-[var(--muted)] text-sm py-10">
                  No cities found
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)] text-center font-[family-name:var(--font-mono)]">
              49,992 cities available
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function Install() {
  const [copied, setCopied] = useState(false);
  const command = 'npm install @novaedgedigitallabs/citykit';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative w-full py-32 px-6 overflow-hidden flex flex-col items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-[var(--primary)] opacity-[0.05] blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-3xl w-full mx-auto text-center flex flex-col items-center">
        <h2 className="font-[family-name:var(--font-space)] font-bold text-[48px] mb-8 text-white">
          Start in 30 seconds
        </h2>

        <div className="flex items-center justify-between w-full max-w-xl bg-[var(--code-bg)] border border-[var(--border)] rounded-[8px] p-4 shadow-2xl mb-8">
          <div className="flex items-center gap-4 font-[family-name:var(--font-mono)] text-[var(--text)] text-sm sm:text-base">
            <span className="text-green-500 select-none">$</span>
            <span>{command}</span>
          </div>
          <button
            onClick={handleCopy}
            className="p-2 rounded-md hover:bg-[rgba(255,255,255,0.05)] text-[var(--muted)] hover:text-white transition-colors"
            title="Copy command"
          >
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
        </div>

        <div className="flex gap-6 mb-12">
          <Link href="https://www.npmjs.com/package/@novaedgedigitallabs/citykit" target="_blank" rel="noopener noreferrer" className="text-[var(--text)] font-medium hover:text-[var(--primary)] transition-colors">
            npm →
          </Link>
          <Link href="https://github.com/novaedgedigitallabs/citykit" target="_blank" rel="noopener noreferrer" className="text-[var(--text)] font-medium hover:text-[var(--primary)] transition-colors">
            GitHub →
          </Link>
        </div>

        <div className="text-sm text-[var(--muted)]">
          Built by NovaEdge Digital Labs · MIT License
        </div>
      </div>
    </section>
  );
}

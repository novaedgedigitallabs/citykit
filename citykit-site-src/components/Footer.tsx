import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--bg)] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[var(--primary)] tracking-wide">
            NovaEdge Digital Labs
          </span>
          <span className="text-[var(--muted)]">
            © 2026
          </span>
        </div>
        
        <div className="flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
          <Link href="https://www.npmjs.com/package/@novaedgedigitallabs/citykit" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text)] transition-colors">
            npm
          </Link>
          <Link href="https://github.com/novaedgedigitallabs/citykit" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text)] transition-colors">
            GitHub
          </Link>
          <Link href="https://novaedgedigitallabs.tech" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text)] transition-colors">
            novaedgedigitallabs.tech
          </Link>
        </div>
      </div>
    </footer>
  );
}

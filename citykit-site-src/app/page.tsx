import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Functions from '@/components/Functions';
import CodeDemo from '@/components/CodeDemo';
import Install from '@/components/Install';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] overflow-hidden">
      <Hero />
      <Stats />
      <Functions />
      <CodeDemo />
      <Install />
      <Footer />
    </main>
  );
}

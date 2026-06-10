export default function Stats() {
  const stats = [
    { label: 'Cities', value: '49,992' },
    { label: 'Countries', value: '242' },
    { label: 'Functions', value: '15' },
    { label: 'Dependencies', value: '0' },
  ];

  return (
    <section className="w-full bg-[var(--surface)] border-y border-[var(--border)] py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x-0 divide-y md:divide-y-0 md:divide-x divide-[var(--border)] gap-y-8">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center justify-center text-center">
            <div className="font-[family-name:var(--font-space)] font-bold text-4xl lg:text-5xl text-white mb-2">
              {stat.value}
            </div>
            <div className="font-[family-name:var(--font-inter)] text-sm text-[var(--muted)] uppercase tracking-widest">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

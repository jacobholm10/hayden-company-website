export default function StatsCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-charcoal-800 rounded-2xl p-6 border border-charcoal-700">
      <p className="text-xs font-medium uppercase tracking-wider text-charcoal-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-charcoal-500 mt-1">{sub}</p>}
    </div>
  );
}

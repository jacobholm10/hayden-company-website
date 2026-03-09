export default function SimpleBarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-xs text-charcoal-400 w-20 text-right shrink-0">{item.label}</span>
          <div className="flex-1 h-7 bg-charcoal-800 rounded-lg overflow-hidden">
            <div
              className="h-full bg-warm-600 rounded-lg flex items-center px-2 transition-all duration-500"
              style={{ width: `${Math.max((item.value / max) * 100, 2)}%` }}
            >
              <span className="text-[10px] font-semibold text-white">{item.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

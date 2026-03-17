export default function StatsCard({
  label,
  value,
  textColor = "text-white",
  icon,
  isLoading,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{label}</p>
          {isLoading ? (
            <div className="mt-2 h-8 w-24 bg-slate-700 rounded animate-pulse" />
          ) : (
            <p className={`text-3xl font-bold mt-1 tabular-nums ${textColor}`}>
              {typeof value === "number"
                ? value.toLocaleString("id-ID")
                : value}
            </p>
          )}
        </div>
        {icon && <span className="text-2xl opacity-60">{icon}</span>}
      </div>
    </div>
  );
}

import { forwardRef } from "react";
import { cn } from "@/utils/helpers";

const StatCard = forwardRef(({ className, title, value, subtitle, icon, trend, trendLabel, ...props }, ref) => {
  const trendColor = trend === "up" ? "text-emerald-600" : trend === "down" ? "text-rose-600" : "text-slate-400";

  return (
    <div ref={ref} className={cn("rounded-xl border border-slate-200 bg-white p-5 shadow-sm", className)} {...props}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl font-bold text-slate-900">{value}</span>
            {subtitle && <span className="ml-1 text-sm font-medium text-slate-500">{subtitle}</span>}
          </div>
          {trend && (
            <p className={`mt-1 text-xs font-medium flex items-center gap-1 ${trendColor}`}>
              {trend === "up" ? "▲" : trend === "down" ? "▼" : "—"} {trendLabel}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">{icon}</div>
      </div>
    </div>
  );
});

StatCard.displayName = "StatCard";

export { StatCard };
export default StatCard;

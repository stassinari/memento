import { LineChart } from "lucide-react";
import { StatCard } from "~/components/StatCard";
import { roundToDecimal } from "~/utils";
import { CountryOptionFlag } from "../CountryOptionFlag";
import { BeansSummary } from "./summary";

interface BeansHistorySummaryProps {
  summary: BeansSummary;
}

/**
 * The History summary strip: filtered-aware counts (beans · roasters ·
 * countries · avg score) plus a placeholder hook for a future Insights feature.
 * Tablet/desktop only — too heavy for a phone (see HANDOVER).
 */
export const BeansHistorySummary = ({ summary }: BeansHistorySummaryProps) => (
  <div className="mb-3 hidden flex-wrap items-stretch gap-3 sm:flex">
    <StatCard
      label="Beans"
      value={
        <>
          {summary.total}
          {summary.statusLabel && (
            <span className="ml-1 text-xs font-medium text-gray-400 dark:text-gray-500">
              {summary.statusLabel}
            </span>
          )}
        </>
      }
    />
    <StatCard
      label="Roasters"
      value={summary.roasterCount}
      meta={
        summary.topRoaster
          ? `top: ${summary.topRoaster.name} (${summary.topRoaster.count})`
          : undefined
      }
    />
    <StatCard
      label="Countries"
      value={summary.countryCount}
      meta={
        summary.topCountry ? (
          <span className="inline-flex items-center gap-1">
            top:
            <CountryOptionFlag
              country={summary.topCountry.name}
              className="h-3 w-auto rounded-sm"
            />
            {summary.topCountry.name} ({summary.topCountry.count})
          </span>
        ) : undefined
      }
    />
    <StatCard
      label="Avg score"
      value={summary.avgScore != null ? roundToDecimal(summary.avgScore, 1) : "—"}
      valueClassName="text-orange-600 dark:text-orange-400"
      meta={summary.avgScore != null ? `over ${summary.ratedCount} rated` : "none rated"}
    />
    <InsightsPlaceholder />
  </div>
);

/** Non-functional entry point for a future analytics feature — a hook only. */
const InsightsPlaceholder = () => (
  <div className="min-w-36 flex-1 rounded-lg border border-dashed border-orange-300 bg-orange-50/50 px-4 py-3 dark:border-orange-500/30 dark:bg-orange-500/5">
    <div className="flex items-center gap-1.5">
      <LineChart className="h-4 w-4 text-orange-500 dark:text-orange-400" />
      <p className="text-[11px] font-bold uppercase tracking-wide text-orange-600 dark:text-orange-400">
        Insights
      </p>
      <span className="ml-auto rounded-full bg-orange-200/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-orange-700 dark:bg-orange-500/30 dark:text-orange-100">
        Soon
      </span>
    </div>
    <p className="mt-1.5 text-xs leading-snug text-orange-800/80 dark:text-orange-200/70">
      Slice scores by roaster, country &amp; process over the years.
    </p>
  </div>
);

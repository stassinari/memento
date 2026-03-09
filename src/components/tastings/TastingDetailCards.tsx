import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ReactMarkdown from "react-markdown";

interface TastingDetailLike {
  tasting: {
    variable: string | null;
    samples: unknown[];
    date: Date | null;
    createdAt: Date;
    note: string | null;
    method: string | null;
    waterType: string | null;
    filterType: string | null;
    grinder: string | null;
    grindSetting: string | null;
    beansWeight: number | null;
    waterWeight: number | null;
    waterTemperature: number | null;
    targetTimeMinutes: number | null;
    targetTimeSeconds: number | null;
  };
}

const getTargetTimeLabel = (targetMinutes: number | null, targetSeconds: number | null): string => {
  if (targetMinutes === null && targetSeconds === null) return "-";
  return `${targetMinutes ?? 0}:${String(targetSeconds ?? 0).padStart(2, "0")}`;
};

export const TastingSetupCard = ({ tasting }: TastingDetailLike) => {
  const targetTime = getTargetTimeLabel(tasting.targetTimeMinutes, tasting.targetTimeSeconds);

  return (
    <details className="group sm:mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
      <summary className="flex cursor-pointer list-none items-center justify-between bg-gray-50/50 px-4 py-2 dark:bg-white/5 sm:px-6">
        <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
          Session details
        </h3>
        <ChevronDownIcon className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180 dark:text-gray-500" />
      </summary>

      <div className="border-t border-gray-200/80 px-4 py-4 dark:border-white/10 sm:px-6">
        <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Method
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.method ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Water type
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.waterType ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Filter type
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.filterType ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Grinder
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.grinder ?? "-"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Grind setting
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {tasting.grindSetting ?? "-"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Beans weight
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {tasting.beansWeight !== null ? `${tasting.beansWeight}g` : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Water weight
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {tasting.waterWeight !== null ? `${tasting.waterWeight}g` : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Water temperature
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {tasting.waterTemperature !== null ? `${tasting.waterTemperature}°C` : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Target time
            </p>
            <p className="text-sm text-gray-800 dark:text-gray-200">{targetTime}</p>
          </div>
        </div>

        {tasting.note && (
          <article className="prose prose-sm mt-4 max-w-none border-t border-gray-200/80 pt-4 dark:border-white/10 dark:prose-invert">
            <ReactMarkdown>{tasting.note}</ReactMarkdown>
          </article>
        )}
      </div>
    </details>
  );
};

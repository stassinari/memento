import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ReactMarkdown from "react-markdown";
import { Card } from "~/components/Card";
import { formatTastingDate } from "~/components/tastings/utils";

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

interface TastingSummaryCardProps extends TastingDetailLike {
  variableLabel: string;
}

const getTargetTimeLabel = (targetMinutes: number | null, targetSeconds: number | null): string => {
  if (targetMinutes === null && targetSeconds === null) return "-";
  return `${targetMinutes ?? 0}:${String(targetSeconds ?? 0).padStart(2, "0")}`;
};

export const TastingSummaryCard = ({ tasting, variableLabel }: TastingSummaryCardProps) => (
  <Card.Container className="mb-4">
    <Card.Header title="Summary" />
    <Card.Content>
      <Card.DescriptionList
        rows={[
          {
            label: "Variable",
            value: variableLabel,
          },
          {
            label: "Samples",
            value: String(tasting.samples.length),
          },
          {
            label: "Date",
            value: formatTastingDate(tasting.date ?? tasting.createdAt),
          },
        ]}
      />
      {tasting.note && (
        <article className="prose prose-sm mt-4 max-w-none dark:prose-invert">
          <ReactMarkdown>{tasting.note}</ReactMarkdown>
        </article>
      )}
    </Card.Content>
  </Card.Container>
);

export const TastingSetupCard = ({ tasting }: TastingDetailLike) => {
  const targetTime = getTargetTimeLabel(tasting.targetTimeMinutes, tasting.targetTimeSeconds);

  return (
    <Card.Container className="mb-4 overflow-hidden">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-2 dark:border-white/10 dark:bg-white/5 sm:px-6">
          <h3 className="text-sm font-bold leading-6 text-gray-900 dark:text-gray-100">Setup</h3>
          <ChevronDownIcon className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180 dark:text-gray-500" />
        </summary>
        <Card.Content>
          <div className="mt-1 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Method</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.method ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Water type</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.waterType ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Filter type</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.filterType ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Grinder</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.grinder ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Grind setting</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{tasting.grindSetting ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Beans weight</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">
                {tasting.beansWeight !== null ? `${tasting.beansWeight}g` : "-"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Water weight</p>
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
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Target time</p>
              <p className="text-sm text-gray-800 dark:text-gray-200">{targetTime}</p>
            </div>
          </div>
        </Card.Content>
      </details>
    </Card.Container>
  );
};

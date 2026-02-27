import { Link as RouterLink } from "@tanstack/react-router";
import clsx from "clsx";
import {
  buildBeansLookup,
  getNormalizedTastingSampleLabel,
} from "~/components/tastings/utils";

interface TastingSamplesListProps {
  tasting: {
    variable: string | null;
    samples: Array<{
      id: string;
      variableValueText: string | null;
      variableValueBeansId: string | null;
    }>;
  };
  tastingId: string;
  beansLookup: ReturnType<typeof buildBeansLookup>;
  selectedSampleId?: string;
  variant: "inbox" | "card";
}

export const TastingSamplesList = ({
  tasting,
  tastingId,
  beansLookup,
  selectedSampleId,
  variant,
}: TastingSamplesListProps) => (
  <ul className={variant === "inbox" ? "space-y-1 p-2" : "space-y-2"}>
    {tasting.samples.map((sample, index) => (
      <li key={sample.id}>
        <RouterLink
          to="/drinks/tastings/$tastingId/samples/$sampleId"
          params={{ tastingId, sampleId: sample.id }}
          className={clsx(
            "block rounded-md border px-3 py-2 text-sm transition-colors",
            variant === "inbox" &&
              (selectedSampleId === sample.id
                ? "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-400/60 dark:bg-orange-500/15 dark:text-orange-200"
                : "border-transparent text-gray-700 hover:border-gray-200 hover:bg-white dark:text-gray-300 dark:hover:border-white/10 dark:hover:bg-white/5"),
            variant === "card" &&
              "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5",
          )}
        >
          <p className="font-semibold">Sample #{index + 1}</p>
          <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
            {getNormalizedTastingSampleLabel(tasting.variable, sample, beansLookup) || "-"}
          </p>
        </RouterLink>
      </li>
    ))}
  </ul>
);

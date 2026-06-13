import { Card } from "~/components/Card";
import { Beans } from "~/db/types";
import { CountryOptionFlag } from "../CountryOptionFlag";
import { ProfileCardHeader } from "./ProfileCardHeader";

interface CompositionCardProps {
  bean: Beans;
}

/** Blend → one row per part. Replaces the Origin card (mutually exclusive on `origin`). */
export const CompositionCard = ({ bean }: CompositionCardProps) => {
  const parts = bean.blendParts ?? [];
  if (parts.length === 0) return null;

  return (
    <Card.Container className="overflow-hidden">
      <ProfileCardHeader title="Composition" />
      <div className="divide-y divide-gray-100 dark:divide-white/10">
        {parts.map((part, i) => {
          const primary = part.country ?? part.name ?? "Blend part";
          const title = part.process ? `${primary} · ${part.process}` : primary;
          const sub = part.varietals.length > 0 ? part.varietals.join(", ") : null;

          return (
            <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate text-[12.5px] font-semibold text-gray-800 dark:text-gray-200">
                  {part.country && (
                    <CountryOptionFlag
                      country={part.country}
                      className="h-3.5 w-3.5 shrink-0 rounded-[2px] object-cover"
                    />
                  )}
                  {title}
                </p>
                {sub && (
                  <p className="mt-0.5 truncate text-[10.5px] text-gray-400 dark:text-gray-500">
                    {sub}
                  </p>
                )}
              </div>
              {part.percentage !== null && (
                <span className="shrink-0 text-[13px] font-bold text-gray-700 dark:text-gray-300">
                  {part.percentage}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </Card.Container>
  );
};

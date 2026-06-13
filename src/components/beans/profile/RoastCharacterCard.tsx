import { Card } from "~/components/Card";
import { Beans } from "~/db/types";
import { getRoastLevelLabel } from "~/lib/beans";
import { RoastLevelMeter } from "./RoastLevelMeter";
import { ProfileCardHeader } from "./ProfileCardHeader";

const ROAST_STYLE_LABELS: Record<string, string> = {
  filter: "Filter",
  espresso: "Espresso",
  "omni-roast": "Omni-roast",
};

interface RoastCharacterCardProps {
  bean: Beans;
}

export const RoastCharacterCard = ({ bean }: RoastCharacterCardProps) => {
  const { roastStyle, roastLevel, roastingNotes } = bean;
  const levelLabel = getRoastLevelLabel(roastLevel);
  const hasNotes = roastingNotes.length > 0;

  // All three empty → omit the whole card.
  if (!roastStyle && levelLabel === null && !hasNotes) return null;

  return (
    <Card.Container className="overflow-hidden">
      <ProfileCardHeader title="Roast character" />
      <Card.Content>
        {roastStyle && (
          <Row label="Style" value={ROAST_STYLE_LABELS[roastStyle] ?? roastStyle} />
        )}
        {levelLabel !== null && (
          <>
            <Row label="Roast level" value={levelLabel} />
            <RoastLevelMeter level={roastLevel!} className="mt-1.5" />
          </>
        )}
        {hasNotes && (
          <div className="mt-3.5 border-t border-gray-100 pt-3.5 dark:border-white/10">
            <p className="mb-2 text-[11px] font-medium text-gray-400 dark:text-gray-500">
              Roaster's notes
            </p>
            <div className="flex flex-wrap gap-1.5">
              {roastingNotes.map((note) => (
                <span
                  key={note}
                  className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 dark:bg-orange-500/15 dark:text-orange-200"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card.Content>
    </Card.Container>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-[13px] text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">{value}</span>
  </div>
);

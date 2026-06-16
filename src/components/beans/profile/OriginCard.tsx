import { ReactNode } from "react";
import { Card } from "~/components/Card";
import { Beans } from "~/db/types";
import { CountryOptionFlag } from "../CountryOptionFlag";
import { fmtStorageDate } from "./format";
import { ProfileCardHeader } from "./ProfileCardHeader";

interface OriginCardProps {
  bean: Beans;
}

export const OriginCard = ({ bean }: OriginCardProps) => {
  const rows: { label: string; value: ReactNode }[] = [];

  if (bean.region) rows.push({ label: "Region", value: bean.region });
  if (bean.varietals.length > 0)
    rows.push({ label: "Varietals", value: bean.varietals.join(", ") });
  if (bean.process) rows.push({ label: "Process", value: bean.process });
  if (bean.altitude !== null) rows.push({ label: "Altitude", value: `${bean.altitude} masl` });
  if (bean.farmer) rows.push({ label: "Farmer", value: bean.farmer });
  if (bean.harvestDate)
    rows.push({ label: "Harvest", value: fmtStorageDate(bean.harvestDate, "MMM YYYY") });

  // All terroir fields null → omit (country alone lives in the descriptor pill).
  if (rows.length === 0) return null;

  return (
    <Card.Container className="overflow-hidden">
      <ProfileCardHeader
        title="Origin"
        right={
          bean.country && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
              <CountryOptionFlag
                country={bean.country}
                className="h-3 w-3 rounded-xs object-cover"
              />
              {bean.country}
            </span>
          )
        }
      />
      <Card.Content className="py-1.5">
        <Card.DescriptionList rows={rows} />
      </Card.Content>
    </Card.Container>
  );
};

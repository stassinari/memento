import type { Beans } from "~/db/types";
import { DetailsCard } from "../Details";

interface BeansShortInfoProps {
  beans: Beans;
  brewDate: Date;
}

export const BeansShortInfo = ({ beans, brewDate }: BeansShortInfoProps) => {
  console.log("BeansShortInfo.Postgres");

  const secondsBetween = beans.roastDate
    ? Number(brewDate) - Number(new Date(beans.roastDate))
    : 0;

  const daysBetween = Math.round(secondsBetween / (1000 * 60 * 60 * 24));

  return (
    <DetailsCard
      title="Beans"
      action={{
        type: "link",
        label: "View",
        href: beans.fbId ? `/beans/${beans.fbId}` : "",
      }}
      rows={[
        {
          label: "Name",
          value: beans.name,
        },
        { label: "Roaster", value: beans.roaster },
        {
          label: "Days post roast",
          value: daysBetween ? `${daysBetween}` : "",
        },
      ]}
    />
  );
};

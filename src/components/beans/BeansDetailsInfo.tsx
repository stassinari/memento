import dayjs from "dayjs";
import "twin.macro";
import { Beans } from "../../types/beans";
import { DetailsCard } from "../Details";

interface BeansDetailsInfoProps {
  beans: Beans;
}

export const BeansDetailsInfo: React.FC<BeansDetailsInfoProps> = ({
  beans,
}) => (
  <div tw="space-y-4">
    <DetailsCard
      title="Roast information"
      rows={[
        { label: "Name", value: beans.name },
        { label: "Roaster", value: beans.roaster },
        {
          label: "Roast date",
          value: beans.roastDate
            ? dayjs(beans.roastDate.toDate()).format("DD MMM YYYY")
            : "",
        },
        { label: "Roast style", value: beans.roastStyle ?? "" },
        {
          label: "Roast level",
          value: beans.roastLevel?.toString() ?? "",
        },
        {
          label: "Roasting notes",
          value: beans.roastingNotes.join(", "),
        },
      ]}
    />
    <DetailsCard
      title="Storage"
      rows={[
        {
          label: "Freeze date",
          value: beans.freezeDate
            ? dayjs(beans.freezeDate.toDate()).format("DD MMM YYYY")
            : "",
        },
        {
          label: "Thaw date",
          value: beans.thawDate
            ? dayjs(beans.thawDate.toDate()).format("DD MMM YYYY")
            : "",
        },
      ]}
    />
    {beans.origin === "single-origin" ? (
      <DetailsCard
        title="Single-origin terroir"
        rows={[
          { label: "Country", value: beans.country ?? "" },
          { label: "Region", value: beans.region ?? "" },
          { label: "Farmer", value: beans.farmer ?? "" },
          {
            label: "Altitude",
            value: beans.altitude ? `${beans.altitude} masl` : "",
          },
          { label: "Process", value: beans.process ?? "" },
          { label: "Varietal(s)", value: beans.varietals.join(", ") },
          {
            label: "Harvest date",
            value: beans.harvestDate
              ? dayjs(beans.harvestDate.toDate()).format("MMMM YYYY")
              : "",
          },
        ]}
      />
    ) : beans.origin === "blend" ? (
      <>
        {beans.blend.map((b, i) => (
          <DetailsCard
            key={i}
            title={`Blend item ${i + 1}`}
            rows={[
              { label: "Name", value: b.name ?? "" },
              {
                label: "Percentage",
                value: b.percentage ? `${b.percentage} %` : "",
              },
              { label: "Country", value: b.country ?? "" },
              { label: "Process", value: b.process ?? "" },
              { label: "Varietal(s)", value: b.varietals.join(", ") },
            ]}
          />
        ))}
      </>
    ) : null}
  </div>
);

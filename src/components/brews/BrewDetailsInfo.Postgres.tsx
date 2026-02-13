import type { Beans, Brew } from "~/db/types";
import { DetailsCard } from "../Details";
import { BeansShortInfo } from "../beans/BeansShortInfo.Postgres";
import { useDrinkRatio } from "../drinks/useDrinkRatio";

interface BrewDetailsInfoProp {
  brew: Brew;
  beans: Beans;
}

export const BrewDetailsInfo = ({ brew, beans }: BrewDetailsInfoProp) => {
  const { beansByWater, waterByBeans } = useDrinkRatio(
    brew?.beansWeight ?? 0,
    brew?.waterWeight ?? 0,
  );

  return (
    <div className="space-y-4">
      <BeansShortInfo beans={beans} brewDate={brew.date} />

      <DetailsCard
        title="Recipe"
        action={{
          type: "link",
          label: "Edit",
          linkProps: {
            to: "/drinks/brews/$brewId/edit",
            params: { brewId: brew.id },
          },
        }}
        rows={[
          { label: "Ratio (beans / water)", value: beansByWater },
          { label: "Ratio (water / beans)", value: waterByBeans },
          {
            label: "Water weight",
            value: `${brew.waterWeight} g`,
          },
          {
            label: "Beans weight",
            value: `${brew.beansWeight} g`,
          },
          {
            label: "Water temperature",
            value: brew.waterTemperature ? `${brew.waterTemperature} °C` : "",
          },
          { label: "Grind setting", value: brew.grindSetting ?? "" },
        ]}
      />

      <DetailsCard
        title="Equipment"
        action={{
          type: "link",
          label: "Edit",
          linkProps: {
            to: "/drinks/brews/$brewId/edit",
            params: { brewId: brew.id },
          },
        }}
        rows={[
          { label: "Grinder", value: brew.grinder ?? "" },
          { label: "Burrs", value: brew.grinderBurrs ?? "" },
          { label: "Water type", value: brew.waterType ?? "" },
          { label: "Filter type", value: brew.filterType ?? "" },
        ]}
      />
    </div>
  );
};

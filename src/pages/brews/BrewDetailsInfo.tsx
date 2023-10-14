import "twin.macro";
import { DetailsCard } from "../../components/Details";
import { BeansShortInfo } from "../../components/beans/BeansShortInfo";
import { useDrinkRatio } from "../../components/drinks/useDrinkRatio";
import { Brew } from "../../types/brew";

interface BrewDetailsInfoProp {
  brew: Brew;
}

export const BrewDetailsInfo: React.FC<BrewDetailsInfoProp> = ({ brew }) => {
  const { beansByWater, waterByBeans } = useDrinkRatio(
    brew?.beansWeight ?? 0,
    brew?.waterWeight ?? 0
  );

  return (
    <div tw="space-y-4">
      <BeansShortInfo beansId={brew.beans.id} brewDate={brew.date.toDate()} />

      <DetailsCard
        title="Recipe"
        action={{ type: "link", label: "Edit", href: "edit" }}
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
        action={{ type: "link", label: "Edit", href: "edit" }}
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

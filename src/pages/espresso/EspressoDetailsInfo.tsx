import { DetailsCard } from "../../components/Details";
import { BeansShortInfo } from "../../components/beans/BeansShortInfo";
import { useDrinkRatio } from "../../components/drinks/useDrinkRatio";
import { Espresso } from "../../types/espresso";

interface EspressoDetailsInfoProps {
  espresso: Espresso;
}

export const EspressoDetailsInfo: React.FC<EspressoDetailsInfoProps> = ({
  espresso,
}) => {
  const { waterByBeans } = useDrinkRatio(
    espresso?.beansWeight ?? 0,
    espresso?.actualWeight ?? espresso?.targetWeight ?? 0,
    { waterByBeansFactor: 100 },
  );

  return (
    <div className="mt-4 space-y-4">
      {espresso.fromDecent && (
        <DetailsCard
          title="Prep"
          rows={[
            ...(espresso.fromDecent
              ? [{ label: "Profile name", value: espresso.profileName ?? "" }]
              : []),
          ]}
        />
      )}
      {espresso.beans ? (
        <BeansShortInfo
          beansId={espresso.beans.id}
          brewDate={espresso.date.toDate()}
        />
      ) : null}
      <DetailsCard
        title="Equipment"
        rows={[
          { label: "Machine", value: espresso.machine ?? "" },
          { label: "Grinder", value: espresso.grinder ?? "" },
          { label: "Burrs", value: espresso.grinderBurrs ?? "" },
          { label: "Portafilter", value: espresso.portafilter ?? "" },
          { label: "Basket", value: espresso.basket ?? "" },
        ]}
      />
      <DetailsCard
        title="Recipe"
        rows={[
          { label: "Ratio (water / beans)", value: waterByBeans },
          {
            label: "Target weight",
            value: espresso.targetWeight ? `${espresso.targetWeight} g` : "",
          },
          {
            label: "Beans weight",
            value: espresso.beansWeight ? `${espresso.beansWeight} g` : "",
          },
          ...(!espresso.fromDecent
            ? [
                {
                  label: "Water temperature",
                  value: espresso.waterTemperature
                    ? `${espresso.waterTemperature} °C`
                    : "",
                },
              ]
            : []),
          { label: "Grind setting", value: espresso.grindSetting ?? "" },
        ]}
      />
      <DetailsCard
        title="Time"
        rows={[
          {
            label: "Time",
            value: `${espresso.actualTime}s`,
          },
        ]}
      />
    </div>
  );
};

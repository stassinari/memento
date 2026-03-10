import { CardRadioGroup, type CardRadioOption } from "~/components/form/CardRadioGroup";
import { Select } from "~/components/Select";
import { TastingVariable } from "~/db/schema";
import { tastingVariablesList } from "./utils";

type NonBeansVariable = Exclude<TastingVariable, TastingVariable.Beans>;

const nonBeansVariables = tastingVariablesList.map((entry) => ({
  label: entry.label,
  value: entry.value as NonBeansVariable,
}));

interface TastingVariableSelectorProps {
  value: TastingVariable | null;
  disabled?: boolean;
  onChange: (nextValue: TastingVariable | null) => void;
}

export const TastingVariableSelector = ({
  value,
  disabled = false,
  onChange,
}: TastingVariableSelectorProps) => {
  const options: CardRadioOption<TastingVariable.Beans | "__non_beans__">[] = [
    {
      value: TastingVariable.Beans,
      title: "Beans",
      description: "Compare different coffees (cupping and similar sessions).",
    },
    {
      value: "__non_beans__" as const,
      title: "Something else",
      description: "Compare one setup variable while holding the rest steady.",
      content: (
        <div onClick={(event) => event.stopPropagation()}>
          <Select
            value={value && value !== TastingVariable.Beans ? value : null}
            onChange={(nextValue) => {
              const selectedValue = nextValue as NonBeansVariable | null;
              onChange(selectedValue);
            }}
            disabled={disabled}
            emptyOptionLabel="Select variable"
            options={nonBeansVariables}
          />
        </div>
      ),
    },
  ];

  return (
    <CardRadioGroup
      legend="What are you tasting?"
      value={value === TastingVariable.Beans ? TastingVariable.Beans : "__non_beans__"}
      disabled={disabled}
      options={options}
      onChange={(nextValue) => {
        if (nextValue === TastingVariable.Beans) {
          onChange(TastingVariable.Beans);
          return;
        }

        if (value === TastingVariable.Beans) {
          onChange(null);
        }
      }}
    />
  );
};

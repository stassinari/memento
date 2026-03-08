import { CardRadioGroup, type CardRadioOption } from "~/components/form/CardRadioGroup";
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
        <select
          value={value && value !== TastingVariable.Beans ? value : ""}
          disabled={disabled}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => {
            const selectedValue = event.currentTarget.value as NonBeansVariable | "";
            onChange(selectedValue === "" ? null : selectedValue);
          }}
          className="block w-full rounded-md border-gray-300 bg-white text-sm text-gray-900 shadow-xs focus:border-orange-500 focus:ring-orange-500 disabled:cursor-not-allowed disabled:bg-gray-50 dark:border-white/15 dark:bg-gray-900 dark:text-gray-100 dark:disabled:bg-white/10"
        >
          <option value="">Select variable</option>
          {nonBeansVariables.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

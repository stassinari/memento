import { TrashIcon } from "@heroicons/react/24/outline";
import { useFieldArray, useFormContext } from "react-hook-form";
import "twin.macro";
import countries from "../data/countries";
import { processes } from "../data/processes";
import { varietals } from "../data/varietals";
import { CountryOptionFlag } from "../pages/BeansAdd/CountryOptionFlag";
import { Button } from "./Button";
import { FormComboboxMulti } from "./form/FormComboboxMulti";
import { FormComboboxSingle } from "./form/FormComboboxSingle";
import { FormInput } from "./form/FormInput";
import { TextWithImageOption } from "./ListOption";

const blendEmptyValues = {
  name: "",
  percentage: null,
  country: null,
  process: null,
  varietals: [],
};

export const BeansBlendForm = () => {
  const { control, register } = useFormContext();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "blend",
    }
  );

  const handleAppend = () => append(blendEmptyValues);
  const handleRemove = (index: number) => () => remove(index);

  console.log(fields);
  return (
    <div tw="space-y-4">
      This is where we'll blend.
      {fields.map((field, i) => (
        <div key={field.id} tw="p-4 space-y-4 border">
          <FormInput
            label="Blend name"
            id={`blend.${i}.name`}
            inputProps={{
              ...register(`blend.${i}.name`),
              type: "text",
              placeholder: "Blend name",
            }}
          />
          <FormInput
            label="Percentage (%)"
            id={`blend.${i}.percentage`}
            inputProps={{
              ...register(`blend.${i}.percentage`, { valueAsNumber: true }),
              type: "number",
              placeholder: "34",
            }}
          />
          <FormComboboxSingle
            name={`blend.${i}.country`}
            label="Country"
            options={countries.map(({ name }) => name)}
            placeholder="Ethiopia"
            renderOption={(country) => (
              <TextWithImageOption
                text={country}
                Image={<CountryOptionFlag country={country} />}
              />
            )}
          />
          <FormComboboxSingle
            label="Process"
            name={`blend.${i}.process`}
            options={processes}
            placeholder="Red honey"
          />
          <FormComboboxMulti
            label="Varietal(s)"
            name={`blend.${i}.varietals`}
            options={varietals}
            placeholder="Search variety..."
          />
          <button tw="w-6 h-6" type="button" onClick={handleRemove(i)}>
            <TrashIcon />
          </button>
        </div>
      ))}
      <Button variant="secondary" type="button" onClick={handleAppend}>
        Add blend item
      </Button>
    </div>
  );
};

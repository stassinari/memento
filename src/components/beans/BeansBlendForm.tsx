import { TrashIcon } from "@heroicons/react/20/solid";
import { PuzzlePieceIcon } from "@heroicons/react/24/outline";
import { useFieldArray, useFormContext } from "react-hook-form";

import countries from "~/data/countries";
import { processes } from "~/data/processes";
import { varietals } from "~/data/varietals";
import { BeansBlendPart } from "~/db/schema";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { FormComboboxMulti } from "../form/FormComboboxMulti";
import { FormComboboxSingle } from "../form/FormComboboxSingle";
import { FormInput } from "../form/FormInput";
import { TextWithImageOption } from "../form/ListOption";
import { CountryOptionFlag } from "./CountryOptionFlag";

export const blendEmptyValues: BeansBlendPart = {
  name: "",
  percentage: null,
  country: null,
  process: null,
  varietals: [],
};

export const BeansBlendForm = () => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "blendParts",
  });

  const handleAppend = () => {
    append(blendEmptyValues);
  };
  const handleRemove = (index: number) => () => {
    remove(index);
  };

  return fields.length > 0 ? (
    <div className="space-y-4">
      {fields.map((field, i) => (
        <div className="border rounded-md" key={field.id}>
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
            <span className="text-sm font-semibold text-gray-500">
              Blend part {i + 1}
            </span>
            <IconButton
              type="button"
              onClick={handleRemove(i)}
              variant="white"
              colour="main"
              size="xs"
            >
              <TrashIcon />
            </IconButton>
          </div>
          <div className="p-4 space-y-4">
            <FormInput
              label="Blend name"
              id={`blendParts.${i}.name`}
              inputProps={{
                ...register(`blendParts.${i}.name`),
                type: "text",
                placeholder: "Blend name",
              }}
            />
            <FormInput
              label="Percentage (%)"
              id={`blendParts.${i}.percentage`}
              inputProps={{
                ...register(`blendParts.${i}.percentage`, {
                  setValueAs: (v: string) => (v === "" ? null : Number(v)),
                }),
                type: "number",
                placeholder: "34",
              }}
            />
            <FormComboboxSingle
              name={`blendParts.${i}.country`}
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
              name={`blendParts.${i}.process`}
              options={processes}
              placeholder="Red honey"
            />
            <FormComboboxMulti
              label="Varietal(s)"
              name={`blendParts.${i}.varietals`}
              options={varietals}
              placeholder="Search variety..."
            />
          </div>
        </div>
      ))}
      <div className="text-right">
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={handleAppend}
        >
          Add blend part
        </Button>
      </div>
    </div>
  ) : (
    <button
      type="button"
      onClick={handleAppend}
      className="relative block w-full p-8 text-center border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
    >
      <span className="block w-12 h-12 mx-auto text-gray-400">
        <PuzzlePieceIcon />
      </span>
      <span className="block mt-2 text-sm font-medium text-gray-900">
        Add a blend part
      </span>
    </button>
  );
};

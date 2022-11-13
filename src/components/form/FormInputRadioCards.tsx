import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import "twin.macro";
import { Input } from "../Input";
import { InputRadioCards, InputRadioCardsProps } from "../InputRadioCards";
import { Modal } from "../Modal";

type FormInputRadioCardsProps<T> = Pick<
  InputRadioCardsProps<T>,
  "label" | "options"
> & {
  name: string;
  error?: string;
  requiredMsg?: string;
};

export const FormInputRadioCards = <T,>({
  name,
  requiredMsg,
  error,
  options,
  label,
}: FormInputRadioCardsProps<T>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collapseToOne, setCollapseToOne] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { control } = useFormContext();

  return (
    <div>
      <Controller
        control={control}
        name={name}
        rules={{ required: requiredMsg }}
        render={({ field }) => (
          <InputRadioCards
            options={
              collapseToOne
                ? options.filter((o) => o.value === field.value) ||
                  options.slice(0, 1)
                : options.slice(0, 3)
            }
            label={label}
            currentValue={field.value}
            handleChange={(newValue) => {
              field.onChange(newValue);
              setCollapseToOne(true);
            }}
          />
        )}
      />

      <button
        type="button"
        tw="mt-2 text-sm font-medium text-orange-500 hover:underline"
        onClick={() => setIsModalOpen(true)}
      >
        More...
      </button>

      <Modal open={isModalOpen} handleClose={() => setIsModalOpen(false)}>
        <div tw="w-full">
          <Input
            type="text"
            tw="mb-3"
            id="beans-radio-search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <Controller
            control={control}
            name={name}
            rules={{ required: requiredMsg }}
            render={({ field }) => (
              <InputRadioCards
                options={
                  searchQuery
                    ? options.filter(
                        (o) =>
                          o.left.top
                            ?.toString()
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          o.left.bottom
                            ?.toString()
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          o.right?.top
                            ?.toString()
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          o.right?.bottom
                            ?.toString()
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                      )
                    : options
                }
                label={label}
                currentValue={field.value}
                handleChange={(newValue) => {
                  field.onChange(newValue);
                  setIsModalOpen(false);
                  setCollapseToOne(true);
                }}
              />
            )}
          />
        </div>
      </Modal>

      {error && <Input.Error id={`${name}-error`}>{error}</Input.Error>}
    </div>
  );
};

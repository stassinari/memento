import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { beans } from "~/db/schema";
import { Button } from "../../Button";
import { EquipmentTable } from "../../EquipmentTable";
import { FormSection } from "../../Form";
import { BeansCardsSelect } from "../../beans/BeansCardsSelect";
import { FormComboboxSingle } from "../../form/FormComboboxSingle";
import { FormInput } from "../../form/FormInput";
import { FormInputDate } from "../../form/FormInputDate";
import { FormInputRadioButtonGroup } from "../../form/FormInputRadioButtonGroup";
import { extractSuggestions } from "../../form/FormSuggestions";

type PostgresEspresso = {
  id: string;
  date: Date;
  machine: string | null;
  grinder: string | null;
  grinderBurrs: string | null;
  portafilter: string | null;
  basket: string | null;
  actualWeight: number | null;
  targetWeight: number | null;
  beansWeight: number | null;
  grindSetting: string | null;
  profileName: string | null;
  actualTime: number | null;
};

type PostgresDecentEspressoPrep = PostgresEspresso;

export interface DecentEspressoFormInputs {
  date: Date;
  beans: string | null;

  machine: string | null;
  grinder: string | null;
  grinderBurrs: string | null;
  portafilter: string | null;
  basket: string | null;

  actualWeight: number; // FIXME this should be nullable if no scale is used
  targetWeight: number | null;
  beansWeight: number | null;
  grindSetting: string | null;
}

export const decentEspressoFormEmptyValuesPostgres: (
  partialEspresso: PostgresDecentEspressoPrep,
  latestEspresso?: PostgresEspresso,
) => DecentEspressoFormInputs = (partialEspresso, latestEspresso) => ({
  date: partialEspresso.date,

  beans: null,
  grindSetting: null,
  actualTime: partialEspresso.actualTime ?? 0,
  actualWeight: partialEspresso.actualWeight ?? 0,

  targetWeight: partialEspresso.targetWeight ?? null,
  beansWeight: null,

  machine: latestEspresso ? latestEspresso.machine : null,
  grinder: latestEspresso ? latestEspresso.grinder : null,
  grinderBurrs: latestEspresso ? latestEspresso.grinderBurrs : null,
  portafilter: latestEspresso ? latestEspresso.portafilter : null,
  basket: latestEspresso ? latestEspresso.basket : null,
});

interface DecentEspressoFormPostgresProps {
  defaultValues: DecentEspressoFormInputs;
  espressoList: PostgresEspresso[];
  beansList: (typeof beans.$inferSelect)[];
  mutation: (data: DecentEspressoFormInputs) => void;
  backLink: string;
}

export const DecentEspressoFormPostgres = ({
  defaultValues,
  espressoList,
  beansList,
  mutation,
  backLink,
}: DecentEspressoFormPostgresProps) => {
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);

  const methods = useForm<DecentEspressoFormInputs>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    getValues,
    register,
  } = methods;

  const onSubmit: SubmitHandler<DecentEspressoFormInputs> = async (data) => {
    mutation(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        className="space-y-6"
      >
        <FormSection
          title="Base information"
          subtitle="This section includes the information that boh I don't know."
        >
          <FormInputDate
            label="Date *"
            id="date"
            requiredMsg="Please enter a espresso date"
            error={errors.date?.message}
            placeholder="Select espresso date"
          />

          <BeansCardsSelect beansList={beansList} />
        </FormSection>

        <FormSection
          title="Recipe"
          subtitle="All the info unique to this espresso."
        >
          <FormInput
            label="Final yield (g)"
            id="actualWeight"
            inputProps={{
              ...register("actualWeight", {
                min: {
                  value: 0,
                  message: "Please enter a positive weight.",
                },
                valueAsNumber: true,
              }),
              type: "number",
              step: "0.01",
              placeholder: "41.7",
            }}
            error={errors.actualWeight?.message}
          />

          <FormInput
            label="Dose (g) *"
            id="beansWeight"
            inputProps={{
              ...register("beansWeight", {
                required: "Please enter the dose of your beans.",
                min: {
                  value: 0,
                  message: "Please enter a positive weight.",
                },
                valueAsNumber: true,
              }),
              type: "number",
              step: "0.01",
              placeholder: "15",
            }}
            error={errors.beansWeight?.message}
          />

          <FormInput
            label="Target yield"
            id="targetWeight"
            inputProps={{
              ...register("targetWeight", {
                min: {
                  value: 0,
                  message: "Please enter a positive weight.",
                },
                valueAsNumber: true,
              }),
              type: "number",
              step: "0.01",
              placeholder: "42",
            }}
            error={errors.targetWeight?.message}
          />

          <FormInput
            label="Grind setting"
            id="grindSetting"
            inputProps={{
              ...register("grindSetting"),
              type: "text",
              placeholder: "1.5",
            }}
          />
        </FormSection>

        <FormSection
          title="Equipment information"
          subtitle="This section is about equipment. Duh."
        >
          {showEquipmentForm ? (
            <>
              <FormComboboxSingle
                label="Machine"
                name="machine"
                placeholder="Lelit Elizabeth"
                options={[
                  ...new Set(
                    espressoList
                      .flatMap(({ machine }) => (machine ? [machine] : []))
                      .sort(),
                  ),
                ]}
                suggestions={extractSuggestions(espressoList, "machine")}
              />

              <FormComboboxSingle
                label="Grinder"
                name="grinder"
                placeholder="Niche Zero"
                options={[
                  ...new Set(
                    espressoList
                      .flatMap(({ grinder }) => (grinder ? [grinder] : []))
                      .sort(),
                  ),
                ]}
                suggestions={extractSuggestions(espressoList, "grinder")}
              />

              <FormComboboxSingle
                label="Burrs"
                name="grinderBurrs"
                placeholder="54mm conical"
                options={[
                  ...new Set(
                    espressoList
                      .flatMap(({ grinderBurrs }) =>
                        grinderBurrs ? [grinderBurrs] : [],
                      )
                      .sort(),
                  ),
                ]}
                suggestions={extractSuggestions(espressoList, "grinderBurrs")}
              />

              <FormInputRadioButtonGroup
                label="Portafilter"
                name="portafilter"
                options={[
                  { label: "Regular", value: "regular" },
                  { label: "Bottomless", value: "bottomless" },
                ]}
                variant="secondary"
              />

              <FormComboboxSingle
                label="Basket"
                name="basket"
                placeholder="VST 18g"
                options={[
                  ...new Set(
                    espressoList
                      .flatMap(({ basket }) => (basket ? [basket] : []))
                      .sort(),
                  ),
                ]}
                suggestions={extractSuggestions(espressoList, "basket")}
              />
            </>
          ) : (
            <EquipmentTable
              rows={[
                { label: "Machine", value: getValues("machine") },
                { label: "Grinder", value: getValues("grinder") },
                { label: "Burrs", value: getValues("grinderBurrs") },
                { label: "Portafilter", value: getValues("portafilter") },
                { label: "Basket", value: getValues("basket") },
              ]}
              onClick={() => setShowEquipmentForm(true)}
            />
          )}
        </FormSection>

        <div className="flex justify-end gap-4">
          <Button variant="white" asChild>
            <Link to={backLink}>Back</Link>
          </Button>
          <Button variant="primary" type="submit" colour="accent">
            Update
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

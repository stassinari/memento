import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Beans } from "../../../types/beans";
import { Brew } from "../../../types/brews";
import { Divider } from "../../Divider";
import { FormSection } from "../../Form";
import { FormComboboxSingle } from "../../form/FormComboboxSingle";
import { FormInputDate } from "../../form/FormInputDate";
import { FormInputRadio } from "../../form/FormInputRadio";
import { extractSuggestions } from "../../form/FormSuggestions";

export interface BeansMethodEquipmentInputs {
  date: Date | null;
  method: string | null;
  beans: string | null;

  grinder: string | null;
  grinderBurrs: string | null;
  waterType: string | null;
  filterType: string | null;
}

export const beansMethodEquipmentEmptyValues: () => BeansMethodEquipmentInputs =
  () => ({
    date: new Date(),
    method: null,
    beans: null,

    grinder: null,
    grinderBurrs: null,
    waterType: null,
    filterType: null,
  });

interface BeansMethodEquipmentProps {
  brewsList: Brew[];
  beansList: Beans[];
  defaultValues: BeansMethodEquipmentInputs;
}

export const BeansMethodEquipment: React.FC<BeansMethodEquipmentProps> = ({
  brewsList,
  beansList,
  defaultValues,
}) => {
  const methods = useForm<BeansMethodEquipmentInputs>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  const onSubmit: SubmitHandler<BeansMethodEquipmentInputs> = async (data) => {
    // 1. add to atom
    // 2. move to next page
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        tw="mt-6 space-y-6"
      >
        <FormSection
          title="Base information"
          subtitle="This section includes the information that boh I don't know."
        >
          <FormInputDate
            label="Date *"
            id="date"
            requiredMsg="Please enter a brew date"
            error={errors.date?.message}
            placeholder="Select brew date"
          />

          <FormComboboxSingle
            label="Method *"
            name="method"
            options={[...new Set(brewsList.map(({ method }) => method).sort())]}
            placeholder="Orea v3"
            requiredMsg="Please enter the method of your brew"
            error={errors.method?.message}
            suggestions={extractSuggestions(brewsList, "method")}
          />

          <p>TODO: nicer beans selection</p>

          <FormInputRadio
            id="beans"
            label="Beans"
            direction="vertical"
            inputProps={{
              ...register("beans", {
                required: "Please select the beans you're using",
              }),
            }}
            options={beansList.map((beans) => ({
              value: `beans/${beans.id}`,
              label: `${beans.name} (${beans.roaster})`,
            }))}
            error={errors.beans?.message}
          />
        </FormSection>

        <Divider tw="hidden sm:block" />

        <FormSection
          title="Equipment information"
          subtitle="This section is about equipment. Duh."
        >
          <FormComboboxSingle
            label="Grinder"
            name="grinder"
            placeholder="Niche Zero"
            options={[
              ...new Set(
                brewsList
                  .flatMap(({ grinder }) => (grinder ? [grinder] : []))
                  .sort()
              ),
            ]}
            suggestions={extractSuggestions(brewsList, "grinder")}
          />

          <FormComboboxSingle
            label="Burrs"
            name="grinderBurrs"
            placeholder="54mm conical"
            options={[
              ...new Set(
                brewsList
                  .flatMap(({ grinderBurrs }) =>
                    grinderBurrs ? [grinderBurrs] : []
                  )
                  .sort()
              ),
            ]}
            suggestions={extractSuggestions(brewsList, "grinderBurrs")}
          />

          <FormComboboxSingle
            label="Water type"
            name="waterType"
            placeholder="ZeroWater"
            options={[
              ...new Set(
                brewsList
                  .flatMap(({ waterType }) => (waterType ? [waterType] : []))
                  .sort()
              ),
            ]}
            suggestions={extractSuggestions(brewsList, "waterType")}
          />

          <FormComboboxSingle
            label="Filter"
            name="filterType"
            placeholder="Bleached"
            options={[
              ...new Set(
                brewsList
                  .flatMap(({ filterType }) => (filterType ? [filterType] : []))
                  .sort()
              ),
            ]}
            suggestions={extractSuggestions(brewsList, "filterType")}
          />
        </FormSection>

        <div className="flex justify-end gap-4"></div>
      </form>
    </FormProvider>
  );
};

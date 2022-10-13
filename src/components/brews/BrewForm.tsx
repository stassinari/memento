import { orderBy } from "firebase/firestore";
import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "twin.macro";
import { useBeansList } from "../../hooks/firestore/useBeansList";
import { Button } from "../Button";
import { Divider } from "../Divider";
import { FormSection } from "../Form";
import { FormComboboxSingle } from "../form/FormComboboxSingle";
import { FormInputDate } from "../form/FormInputDate";

// FIXME introduce global "createdAt" and "updatedAt" on every object
export interface BrewFormInputs {
  date: Date | null;
  method: string | null;
  grinder: string | null;
  grinderBurrs: string | null;
  waterType: string | null;
  filterType: string | null;
}

export const brewFormEmptyValues: () => BrewFormInputs = () => ({
  date: new Date(), // FIXME I think this will not update, this prolly need to be wrapped in a function and called
  method: null,
  grinder: null,
  grinderBurrs: null,
  waterType: null,
  filterType: null,
});

interface BrewFormProps {
  defaultValues: BrewFormInputs;
  title: string;
  buttonLabel: string;
  mutation: (data: BrewFormInputs) => Promise<void>;
}

export const BrewForm: React.FC<BrewFormProps> = ({
  defaultValues,
  title,
  buttonLabel,
  mutation,
}) => {
  const navigate = useNavigate();

  const { beansList } = useBeansList([orderBy("roastDate", "desc")]);

  const methods = useForm<BrewFormInputs>({
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
  } = methods;

  const onSubmit: SubmitHandler<BrewFormInputs> = async (data) => {
    // if (data.origin === "blend") {
    //   data = { ...data, ...singleOriginEmptyValues };
    // } else {
    //   data = { ...data, blend: [] };
    // }
    mutation(data);
  };

  return (
    <div>
      <h1 tw="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
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
              options={[]}
              // options={[
              //   ...new Set(beansList.map(({ roaster }) => roaster).sort()),
              // ]}
              placeholder="Orea v3"
              requiredMsg="Please enter the method of your brew"
              error={errors.method?.message}
              // suggestions={extractSuggestions(beansList, "roaster")}
            />

            <p>Beans selection here.</p>
            <p>
              Would like to give extra care to this with a custom component.
            </p>
            <ul>
              <li>
                {beansList.map((beans) => `${beans.name} (${beans.roaster})`)}
              </li>
            </ul>
          </FormSection>

          <Divider tw="hidden sm:block" />

          <FormSection
            title="Equipment information"
            subtitle="This section is about equipment. Duh."
          >
            <FormComboboxSingle
              label="Grinder"
              name="grinder"
              options={[]}
              // options={[
              //   ...new Set(beansList.map(({ roaster }) => roaster).sort()),
              // ]}
              placeholder="Niche Zero"
              // suggestions={extractSuggestions(beansList, "roaster")}
            />

            <FormComboboxSingle
              label="Burrs"
              name="grinderBurrs"
              options={[]}
              // options={[
              //   ...new Set(beansList.map(({ roaster }) => roaster).sort()),
              // ]}
              placeholder="54mm conical"
              // suggestions={extractSuggestions(beansList, "roaster")}
            />

            <FormComboboxSingle
              label="Water type"
              name="waterType"
              options={[]}
              // options={[
              //   ...new Set(beansList.map(({ roaster }) => roaster).sort()),
              // ]}
              placeholder="ZeroWater"
              // suggestions={extractSuggestions(beansList, "roaster")}
            />

            <FormComboboxSingle
              label="Filter"
              name="filterType"
              options={[]}
              // options={[
              //   ...new Set(beansList.map(({ roaster }) => roaster).sort()),
              // ]}
              placeholder="Bleached"
              // suggestions={extractSuggestions(beansList, "roaster")}
            />
          </FormSection>

          <div className="flex justify-end gap-4">
            <Button variant="white" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              colour="accent"
              // disabled={mutation.isLoading} FIXME disabled buttons after first click
            >
              {buttonLabel}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

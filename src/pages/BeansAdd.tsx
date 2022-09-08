import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useFirestoreCollectionMutation } from "@react-query-firebase/firestore";
import dayjs from "dayjs";
import { collection } from "firebase/firestore";
import { useAtom } from "jotai";
import { useState } from "react";
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import tw from "twin.macro";
import { Button } from "../components/Button";
import { FormInput } from "../components/form/FormInput";
import { db } from "../firebaseConfig";
import { userAtom } from "../hooks/useInitUser";

type BeansAddInputs = {
  name: string;
  roaster: string;
  roastDate: string | null;
  testDate: Date | null;
  isFinished?: boolean;
};

export const emptyValues: BeansAddInputs = {
  name: "",
  isFinished: false,
  roaster: "",
  roastDate: null,
  testDate: null,
  // roastingNotes: [],
  // roastLevel: null,
  // roastStyle: null,
  // origin: "single-origin",
  // country: null,
  // farmer: "",
  // region: "",
  // process: "",
  // varietals: [],
  // harvestDate: null,
  // altitude: "",
  // freezeDate: null,
  // thawDate: null,
};

export const BeansAdd = () => {
  const [user] = useAtom(userAtom);

  const now = new Date();
  const maxDate = now.toISOString();

  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(new Date());

  const methods = useForm<BeansAddInputs>({ defaultValues: emptyValues });
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = methods;

  const beansRef = collection(db, "users", user?.uid || "lol", "beans");
  const mutation = useFirestoreCollectionMutation(beansRef, {
    onSuccess(data) {
      console.log("new document with ID: ", data.id);
      navigate(`/beans/${data.id}`);
    },
  });

  const onSubmit: SubmitHandler<BeansAddInputs> = async (data) => {
    // const newData = { ...data, roastDate: Date.parse(data.roastDate || "") };
    console.log(data);
    // mutation.mutate({ ...emptyValues, ...data }); // fix this, add a hidden isFinished field I guess
  };

  return (
    <div>
      adding beanz
      <form onSubmit={handleSubmit(onSubmit)} tw="space-y-6">
        <FormInput
          label="Name"
          id="name"
          inputProps={{
            ...register("name", {
              required: "Please enter a name for your beans",
            }),
            type: "text",
            autoFocus: true,
            placeholder: "Kilimanjaro",
          }}
          error={errors.name?.message}
        />

        <FormInput
          label="Roaster"
          id="roaster"
          inputProps={{
            ...register("roaster", { required: "Please enter your password" }),
            type: "text",
            placeholder: "Square Mile",
          }}
          error={errors.roaster?.message}
        />

        <FormInput
          label="Roast date"
          id="roastDate"
          inputProps={{
            ...register("roastDate", { valueAsDate: true }),
            type: "date",
            placeholder: "12/08/2022",
            max: maxDate,
          }}
        />
        <div tw="mt-1">
          <Controller
            control={control}
            name="testDate"
            render={({ field }) => (
              <DatePicker
                placeholderText="Select roast date"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                dateFormat="dd MMM yyyy"
                maxDate={new Date()}
                highlightDates={[new Date()]}
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div tw="flex items-center justify-between px-2 py-2">
                    <span tw="flex-auto font-semibold text-gray-900">
                      {dayjs(date).format("MMMM YYYY")}
                    </span>

                    <button
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      type="button"
                      css={[
                        tw`-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500`,
                        prevMonthButtonDisabled &&
                          tw`opacity-50 cursor-not-allowed`,
                      ]}
                    >
                      <span tw="sr-only">Previous month</span>
                      <ChevronLeftIcon tw="w-5 h-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                      type="button"
                      css={[
                        tw`-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500`,
                        nextMonthButtonDisabled &&
                          tw`text-gray-300! cursor-not-allowed`,
                      ]}
                    >
                      <span tw="sr-only">Next month</span>
                      <ChevronRightIcon tw="w-5 h-5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              />
            )}
          />
        </div>

        <Button variant="primary" type="submit" disabled={mutation.isLoading}>
          Add
        </Button>
      </form>
    </div>
  );
};

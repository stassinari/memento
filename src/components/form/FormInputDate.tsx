import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import { Controller, useFormContext } from "react-hook-form";
import "twin.macro";
import tw from "twin.macro";
import { Input } from "../Input";

interface FormInputDateProps {
  label: string;
  id: string;
  placeholder?: string;
  showMonthYearPicker?: boolean;
  helperText?: string;
  error?: string;
}

export const FormInputDate: React.FC<FormInputDateProps> = ({
  label,
  id,
  placeholder,
  helperText,
  showMonthYearPicker,
  error,
}) => {
  // Consider creating reusable components rather than relying on this Provider
  const { control } = useFormContext();
  return (
    <div>
      <Input.Label htmlFor={id}>{label}</Input.Label>
      <div tw="mt-1">
        <Controller
          control={control}
          name={id}
          render={({ field }) => (
            <DatePicker
              showMonthYearPicker={showMonthYearPicker}
              placeholderText={placeholder}
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
                <CalendarHeader
                  date={date}
                  dateFormat="MMMM YYYY"
                  decrease={decreaseMonth}
                  increase={increaseMonth}
                  prevButtonDisabled={prevMonthButtonDisabled}
                  nextButtonDisabled={nextMonthButtonDisabled}
                />
              )}
            />
          )}
        />
      </div>
      {helperText && !error && (
        <Input.Helper id={`${id}-description`}>{helperText}</Input.Helper>
      )}
      {error && <Input.Error id={`${id}-error`}>{error}</Input.Error>}
    </div>
  );
};

interface CalendarHeaderProps {
  date: Date;
  dateFormat: string;
  decrease: VoidFunction;
  increase: VoidFunction;
  prevButtonDisabled: boolean;
  nextButtonDisabled: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  date,
  dateFormat,
  decrease,
  increase,
  prevButtonDisabled,
  nextButtonDisabled,
}) => {
  return (
    <div tw="flex items-center justify-between px-2 py-2">
      <span tw="flex-auto font-semibold text-gray-900">
        {dayjs(date).format(dateFormat)}
      </span>

      <button
        onClick={decrease}
        disabled={prevButtonDisabled}
        type="button"
        css={[
          tw`-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500`,
          prevButtonDisabled && tw`opacity-50 cursor-not-allowed`,
        ]}
      >
        <span tw="sr-only">Previous month</span>
        <ChevronLeftIcon tw="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        onClick={increase}
        disabled={nextButtonDisabled}
        type="button"
        css={[
          tw`-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500`,
          nextButtonDisabled && tw`text-gray-300! cursor-not-allowed`,
        ]}
      >
        <span tw="sr-only">Next month</span>
        <ChevronRightIcon tw="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
};

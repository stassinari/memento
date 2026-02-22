import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../Input";

interface FormInputDateProps {
  label: string;
  id: string;
  placeholder?: string;
  showMonthYearPicker?: boolean;
  requiredMsg?: string;
  helperText?: string;
  error?: string;
}

export const FormInputDate = ({
  label,
  id,
  placeholder,
  helperText,
  showMonthYearPicker,
  requiredMsg,
  error,
}: FormInputDateProps) => {
  // Consider creating reusable components rather than relying on this Provider
  const { control } = useFormContext();
  return (
    <div>
      <Input.Label htmlFor={id}>{label}</Input.Label>
      <div className="mt-1">
        <Controller
          control={control}
          name={id}
          rules={{ required: requiredMsg }}
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
      {helperText && !error && <Input.Helper id={`${id}-description`}>{helperText}</Input.Helper>}
      {error && <Input.Error id={`${id}-error`}>{error}</Input.Error>}
    </div>
  );
};

interface CalendarHeaderProps {
  date: Date;
  dateFormat: string;
  decrease: () => void;
  increase: () => void;
  prevButtonDisabled: boolean;
  nextButtonDisabled: boolean;
}

export const CalendarHeader = ({
  date,
  dateFormat,
  decrease,
  increase,
  prevButtonDisabled,
  nextButtonDisabled,
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-2 py-2">
      <span className="flex-auto font-semibold text-gray-900">
        {dayjs(date).format(dateFormat)}
      </span>

      <button
        onClick={decrease}
        disabled={prevButtonDisabled}
        type="button"
        className={clsx([
          "-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500",
          prevButtonDisabled && "opacity-50 cursor-not-allowed",
        ])}
      >
        <span className="sr-only">Previous month</span>
        <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
      </button>
      <button
        onClick={increase}
        disabled={nextButtonDisabled}
        type="button"
        className={clsx([
          "-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500",
          nextButtonDisabled && "text-gray-300! cursor-not-allowed",
        ])}
      >
        <span className="sr-only">Next month</span>
        <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
};

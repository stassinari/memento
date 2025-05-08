import DatePicker from "react-datepicker";
import { Controller, useFormContext } from "react-hook-form";

import { Input } from "../Input";
import { CalendarHeader } from "./FormInputDate";

interface FormInputMonthYearProps {
  label: string;
  id: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
}

export const FormInputMonthYear = ({
  label,
  id,
  placeholder,
  helperText,
  error,
}: FormInputMonthYearProps) => {
  // Consider creating reusable components rather than relying on this Provider
  const { control } = useFormContext();
  return (
    <div>
      <Input.Label htmlFor={id}>{label}</Input.Label>
      <div className="mt-1">
        <Controller
          control={control}
          name={id}
          render={({ field }) => (
            <DatePicker
              showMonthYearPicker={true}
              placeholderText={placeholder}
              onChange={(date) => field.onChange(date)}
              selected={field.value}
              dateFormat="MMMM yyyy"
              maxDate={new Date()}
              highlightDates={[new Date()]}
              renderCustomHeader={({
                date,
                decreaseYear,
                increaseYear,
                prevYearButtonDisabled,
                nextYearButtonDisabled,
              }) => (
                <CalendarHeader
                  date={date}
                  dateFormat="YYYY"
                  decrease={decreaseYear}
                  increase={increaseYear}
                  prevButtonDisabled={prevYearButtonDisabled}
                  nextButtonDisabled={nextYearButtonDisabled}
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

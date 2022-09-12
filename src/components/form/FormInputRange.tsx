import { Controller, useFormContext } from "react-hook-form";
import { getTrackBackground, Range } from "react-range";
import "twin.macro";
import { theme } from "twin.macro";
import { Input } from "../Input";

interface FormInputRange {
  label: string;
  id: string;
  helperText?: string;
}

export const FormInputRange: React.FC<FormInputRange> = ({ label, id }) => {
  const { control } = useFormContext();

  return (
    <div>
      <Input.Label htmlFor={id}>{label}</Input.Label>
      <div tw="mt-4">
        <Controller
          control={control}
          name={id}
          render={({ field }) => (
            <Range
              step={1}
              min={0}
              max={4}
              values={[field.value]}
              onChange={(values) => field.onChange(values[0])}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  tw="w-full h-2 rounded-full"
                  style={{
                    ...props.style,
                    background: getTrackBackground({
                      values: [field.value],
                      colors: [
                        theme`colors.orange.400`,
                        theme`colors.gray.200`,
                      ],
                      min: 0,
                      max: 4,
                    }),
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  tw="w-4 h-4 bg-white border border-gray-300 rounded-full shadow focus-visible:(outline-none ring-orange-500 border-orange-500 border-2)"
                  style={{
                    transform: "translate(-8px, -4px)",
                    ...props.style,
                  }}
                />
              )}
            />
          )}
        />
      </div>
    </div>
  );
};

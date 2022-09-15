import { getTrackBackground, Range } from "react-range";
import { theme } from "twin.macro";

export interface InputRangeProps {
  onChange: (values: number[]) => void;
  values: number[];
  step: number;
  min: number;
  max: number;
}

export const InputRange: React.FC<InputRangeProps> = ({
  min,
  max,
  step,
  values,
  onChange,
}) => {
  return (
    <Range
      min={min}
      max={max}
      step={step}
      values={values}
      onChange={onChange}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          tw="w-full h-2 rounded-full"
          style={{
            ...props.style,
            background: getTrackBackground({
              values: values,
              colors: [theme`colors.orange.400`, theme`colors.gray.200`],
              min: min,
              max: max,
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
  );
};

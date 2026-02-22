import clsx from "clsx";
import { getTrackBackground, Range } from "react-range";

export interface InputSliderProps {
  onChange: (values: number[]) => void;
  values: number[];
  step: number;
  min: number;
  max: number;
  overrideLabels?: string[];
  hideThumbMarker?: boolean;
}

export const InputSlider = ({
  min,
  max,
  step,
  values,
  onChange,
  overrideLabels,
  hideThumbMarker = false,
}: InputSliderProps) => {
  return (
    <div className="mx-2">
      <Range
        min={min}
        max={max}
        step={step}
        values={values}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="w-full h-2 rounded-full"
            style={{
              ...props.style,
              background: getTrackBackground({
                values,
                colors: ["#f97316", "#e5e7eb"], // FIXME better tw theme
                min,
                max,
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            className={clsx([
              "relative w-4 h-4 bg-white border border-gray-300 rounded-full shadow-sm",
              "before:content before:rounded-full before:opacity-20 before:w-12 before:h-12 before:block before:-top-5/4 before:-left-5/4 before:absolute",
              "focus:outline-hidden focus:ring-orange-500 focus:border-orange-500",
            ])}
            style={{
              transform: "translate(-8px, -4px)",
              ...props.style,
            }}
          >
            {!hideThumbMarker && (
              <div
                className={clsx([
                  "absolute px-2 py-0.5 font-medium text-xs text-white bg-orange-600 rounded-sm -top-6 -left-1 transition-opacity",
                  isDragged ? "opacity-90" : "opacity-0",
                ])}
              >
                {values[0] || 0}
              </div>
            )}
          </div>
        )}
        renderMark={({ props, index }) => {
          // remove first and last mark
          if (index === 0 || index === max / step) return null;

          // remove non-int marks if step is < 1
          // NOTE only works for 0.5 step for now
          if (step < 1 && index % 2 === 1) return null;
          return <div {...props} className="top-0 w-0.5 h-1 rounded-full bg-gray-50" />;
        }}
      />

      <div className="flex justify-between mt-2 -mx-2 text-sm text-gray-700 px-1 sm:text-xs">
        {overrideLabels ? (
          <>
            {overrideLabels.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </>
        ) : (
          <>
            <span>{min}</span>
            <span>{max}</span>
          </>
        )}
      </div>
    </div>
  );
};

import clsx from "clsx";
import { getTrackBackground, Range } from "react-range";
import { useTheme } from "~/hooks/useTheme";

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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

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
                colors: isDark ? ["#fb923c", "#4b5563"] : ["#f97316", "#e5e7eb"],
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
              "relative h-4 w-4 rounded-full border shadow-sm",
              isDark ? "bg-gray-100 border-gray-500" : "bg-white border-gray-300",
              "before:content before:rounded-full before:opacity-20 before:w-12 before:h-12 before:block before:-top-5/4 before:-left-5/4 before:absolute",
              "focus:outline-hidden focus:ring-orange-500 focus:border-orange-500 dark:focus:ring-orange-400 dark:focus:border-orange-400",
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
          return (
            <div
              {...props}
              className={clsx("top-0 h-1 w-0.5 rounded-full", isDark ? "bg-gray-500" : "bg-gray-300")}
            />
          );
        }}
      />

      <div className="mt-2 -mx-2 flex justify-between px-1 text-sm text-gray-700 dark:text-gray-300 sm:text-xs">
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

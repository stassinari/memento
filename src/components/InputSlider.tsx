import React from "react";
import { getTrackBackground, Range } from "react-range";
import tw, { theme } from "twin.macro";

export interface InputSliderProps {
  onChange: (values: number[]) => void;
  values: number[];
  step: number;
  min: number;
  max: number;
  overrideLabels?: string[];
  hideThumbMarker?: boolean;
}

export const InputSlider: React.FC<InputSliderProps> = ({
  min,
  max,
  step,
  values,
  onChange,
  overrideLabels,
  hideThumbMarker = false,
}) => {
  return (
    <div tw="mx-2">
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
                values,
                colors: [theme`colors.orange.500`, theme`colors.gray.200`],
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
            css={[
              tw`relative w-4 h-4 bg-white border border-gray-300 rounded-full shadow`,
              tw`before:(content rounded-full opacity-20 w-12 h-12 block -top-5/4 -left-5/4 absolute)`,
              tw`focus:(outline-none ring-orange-500 border-orange-500)`,
            ]}
            style={{
              transform: "translate(-8px, -4px)",
              ...props.style,
            }}
          >
            {!hideThumbMarker && (
              <div
                css={[
                  tw`absolute px-2 py-0.5 font-medium text-xs text-white bg-orange-600 rounded -top-6 -left-1 transition-opacity`,
                  isDragged ? tw`opacity-90` : tw`opacity-0`,
                ]}
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
            <div {...props} tw="top-0 w-0.5 h-1 rounded-full bg-gray-50" />
          );
        }}
      />

      <div tw="flex justify-between mt-2 -mx-2 text-sm text-gray-700 sm:text-xs">
        {overrideLabels ? (
          <React.Fragment>
            {overrideLabels.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span>{min}</span>
            <span>{max}</span>
          </React.Fragment>
        )}
      </div>

      {/* <span tw="flex items-center justify-center w-6 h-6 mx-4 text-sm bg-gray-200 rounded-md">
        {values[0] || 0}
      </span> */}
    </div>
  );
};

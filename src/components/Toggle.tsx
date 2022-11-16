import { Switch } from "@headlessui/react";
import tw from "twin.macro";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  colour?: "main" | "accent";
  label?: string;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  colour = "main",
  disabled = false,
  label,
}) => (
  <Switch.Group as="div" className="flex items-center">
    <Switch
      className="group"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      css={[
        tw`relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11`,
        tw`disabled:(bg-gray-100 cursor-not-allowed)`,
        tw`focus:(outline-none ring-2 ring-offset-2)`,
        colour === "main"
          ? tw`focus:ring-orange-500`
          : colour === "accent"
          ? tw`focus:ring-blue-500`
          : null,
        checked
          ? colour === "main"
            ? tw`bg-orange-600`
            : colour === "accent"
            ? tw`bg-blue-600`
            : null
          : tw`bg-gray-200`,
      ]}
    >
      <span
        aria-hidden="true"
        css={[
          tw`inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full shadow pointer-events-none ring-0 group-disabled:bg-gray-50`,
          checked ? tw`translate-x-5` : tw`translate-x-0`,
        ]}
      />
    </Switch>
    {label && (
      <Switch.Label as="span" tw="ml-3">
        <span
          css={[
            tw`text-sm font-medium text-gray-700`,
            disabled && tw`text-gray-400`,
          ]}
        >
          {label}
        </span>
        {/* <span tw="text-sm text-gray-500">(Save 10%)</span> */}
      </Switch.Label>
    )}
  </Switch.Group>
);

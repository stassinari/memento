// export const Switch = () => {
//   return <div>lol</div>;
// };

import { Switch as HuiSwitch } from "@headlessui/react";
import tw from "twin.macro";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  colour?: "main" | "accent";
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  colour = "main",
  label,
}) => (
  <HuiSwitch.Group as="div" className="flex items-center">
    <HuiSwitch
      checked={checked}
      onChange={onChange}
      css={[
        tw`relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:(outline-none ring-2 ring-offset-2)`,
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
          tw`inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white rounded-full shadow pointer-events-none ring-0`,
          checked ? tw`translate-x-5` : tw`translate-x-0`,
        ]}
      />
    </HuiSwitch>
    {label && (
      <HuiSwitch.Label as="span" className="ml-3">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        {/* <span className="text-sm text-gray-500">(Save 10%)</span> */}
      </HuiSwitch.Label>
    )}
  </HuiSwitch.Group>
);

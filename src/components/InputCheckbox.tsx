import "twin.macro";

interface InputCheckboxProps {
  label: string;
  checked: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// This is very different from InputRadio, as it's a single element rather than a group of elements.
export const InputCheckbox: React.FC<InputCheckboxProps> = ({
  label,
  checked,
  handleChange,
}) => {
  return (
    <label tw="font-medium text-gray-900">
      <input
        tw="w-4 h-4 mr-2 text-orange-600 border-gray-300 rounded focus:ring-orange-600"
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      {label}
    </label>
  );
};

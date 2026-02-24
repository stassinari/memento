interface InputCheckboxProps {
  label: string;
  checked: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// This is very different from InputRadio, as it's a single element rather than a group of elements.
export const InputCheckbox = ({ label, checked, handleChange }: InputCheckboxProps) => {
  return (
    <label className="font-medium text-gray-900 dark:text-gray-100">
      <input
        className="mr-2 h-4 w-4 rounded-sm border-gray-300 text-orange-600 focus:ring-orange-600 dark:border-white/15 dark:bg-gray-900 dark:text-orange-400 dark:focus:ring-orange-400"
        type="checkbox"
        checked={checked}
        onChange={handleChange}
      />
      {label}
    </label>
  );
};

import "twin.macro";

interface InputProps {
  label: string;
  placeholder?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  helperText,
}) => {
  return (
    <div>
      <label htmlFor={label} tw="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div tw="mt-1">
        <input
          type="text"
          name={label}
          id={label}
          tw="block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          placeholder={placeholder}
          aria-describedby={`${label}-description`}
        />
      </div>
      {helperText && (
        <p tw="mt-2 text-sm text-gray-500" id={`${label}-description`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

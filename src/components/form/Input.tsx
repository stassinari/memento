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
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          name={label}
          id={label}
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder={placeholder}
          aria-describedby={`${label}-description`}
        />
      </div>
      {helperText && (
        <p className="mt-2 text-sm text-gray-500" id={`${label}-description`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

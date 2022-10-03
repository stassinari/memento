import "twin.macro";
import { Badge, BadgePlusIcon } from "../Badge";

interface Suggestion {
  label: string;
  onClick: () => void;
}
interface FormSuggestionsProps {
  suggestions?: Suggestion[];
}

export const FormSuggestions: React.FC<FormSuggestionsProps> = ({
  suggestions,
}) => {
  return (
    <div tw="flex items-center mt-2 text-xs text-gray-600">
      Recent:
      <ul tw="flex items-center gap-2 ml-2">
        {suggestions?.map(({ label, onClick }) => (
          <li key={label}>
            <Badge
              label={label}
              colour="grey"
              clickable={true}
              icon={{
                Element: <BadgePlusIcon />,
                position: "left",
                onClick,
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

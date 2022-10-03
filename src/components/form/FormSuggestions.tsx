import "twin.macro";
import { Badge, BadgePlusIcon } from "../Badge";

interface Suggestion {
  label: string;
  onClick: () => void;
}
interface FormSuggestionsProps {
  suggestions?: Suggestion[];
}

export const extractSuggestions = (arr: any[], field: string, limit = 3) => {
  // TODO is this iffy af?
  const sugSet = new Set(arr.map((b) => b[field]));
  return Array.from(sugSet).slice(0, limit);
};

export const FormSuggestions: React.FC<FormSuggestionsProps> = ({
  suggestions,
}) => {
  if (suggestions?.length === 0) return null;
  return (
    <div tw="flex items-baseline mt-2 text-xs text-gray-600">
      Recent:
      <ul tw="flex flex-wrap items-center gap-2 ml-2">
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

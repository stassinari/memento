import "twin.macro";
import { theme } from "twin.macro";
import useMediaQuery from "../../hooks/useMediaQuery";
import { Badge, BadgePlusIcon } from "../Badge";

interface Suggestion {
  label: string;
  onClick: () => void;
}
interface FormSuggestionsProps {
  suggestions?: Suggestion[];
}

// TODO is this iffy af?
export const extractSuggestions = (arr: any[], field: string, limit = 3) =>
  [...new Set(arr.map((b) => b[field]))].slice(0, limit);

export const FormSuggestions: React.FC<FormSuggestionsProps> = ({
  suggestions,
}) => {
  const isSm = useMediaQuery(`(min-width: ${theme`screens.sm`})`);
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
              size={isSm ? "small" : "large"}
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

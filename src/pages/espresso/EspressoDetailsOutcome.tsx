import ReactMarkdown from "react-markdown";
import "twin.macro";
import { DetailsCard } from "../../components/Details";
import { Espresso } from "../../types/espresso";
import { getEyFromEspresso } from "../../utils";

interface EspressoDetailsOutcomeProps {
  espresso: Espresso;
}

export const EspressoDetailsOutcome: React.FC<EspressoDetailsOutcomeProps> = ({
  espresso,
}) => {
  return (
    <div tw="mt-4 space-y-4">
      <DetailsCard
        title="Rating"
        rows={[
          {
            label: "Overall score",
            value: espresso.rating ? `${espresso.rating}/10` : "",
          },
          {
            label: "Notes",
            value: (
              <article tw="prose-sm prose">
                <ReactMarkdown>{espresso.notes ?? ""}</ReactMarkdown>
              </article>
            ),
          },
        ]}
      />
      <DetailsCard
        title="Tasting scores"
        rows={[
          {
            label: "Aroma",
            value: espresso.tastingScores?.aroma
              ? `${espresso.tastingScores.aroma}/10`
              : "",
          },
          {
            label: "Acidity",
            value: espresso.tastingScores?.acidity
              ? `${espresso.tastingScores.acidity}/10`
              : "",
          },
          {
            label: "Sweetness",
            value: espresso.tastingScores?.sweetness
              ? `${espresso.tastingScores.sweetness}/10`
              : "",
          },
          {
            label: "Body",
            value: espresso.tastingScores?.body
              ? `${espresso.tastingScores.body}/10`
              : "",
          },
          {
            label: "Finish",
            value: espresso.tastingScores?.finish
              ? `${espresso.tastingScores.finish}/10`
              : "",
          },
        ]}
      />
      <DetailsCard
        title="Extraction"
        rows={[
          {
            label: "Extraction yield",
            value: `${getEyFromEspresso(espresso)}%`,
          },
          {
            label: "TDS",
            value: espresso.tds ? `${espresso.tds}%` : "",
          },
        ]}
      />
    </div>
  );
};

import { EspressoWithBeans } from "~/routes/_auth/_layout/drinks/espresso/$espressoId";
import { MarkdownNotes } from "../MarkdownNotes";
import { DetailsCard } from "../Details";

interface EspressoDetailsOutcomeProps {
  espresso: EspressoWithBeans;
}

export const EspressoDetailsOutcome = ({ espresso }: EspressoDetailsOutcomeProps) => {
  return (
    <div className="mt-4 space-y-4">
      <DetailsCard
        title="Rating"
        rows={[
          {
            label: "Overall score",
            value: espresso.rating ? `${espresso.rating}/10` : "",
          },
          {
            label: "Notes",
            value: <MarkdownNotes markdown={espresso.notes} />,
          },
        ]}
      />
      <DetailsCard
        title="Tasting scores"
        rows={[
          {
            label: "Aroma",
            value: espresso.aroma ? `${espresso.aroma}/10` : "",
          },
          {
            label: "Acidity",
            value: espresso.acidity ? `${espresso.acidity}/10` : "",
          },
          {
            label: "Sweetness",
            value: espresso.sweetness ? `${espresso.sweetness}/10` : "",
          },
          {
            label: "Body",
            value: espresso.body ? `${espresso.body}/10` : "",
          },
          {
            label: "Finish",
            value: espresso.finish ? `${espresso.finish}/10` : "",
          },
        ]}
      />
      <DetailsCard
        title="Extraction"
        rows={[
          {
            label: "TDS",
            value: espresso.tds ? `${espresso.tds}%` : "",
          },
        ]}
      />
    </div>
  );
};

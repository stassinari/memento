import ReactMarkdown from "react-markdown";
import "twin.macro";
import { Card } from "../../components/Card";
import { DetailsCard } from "../../components/Details";
import { Brew } from "../../types/brew";
import { getEyFromBrew } from "../../utils";

interface BrewDetailsOutcomeProp {
  brew: Brew;
}

export const BrewDetailsOutcome: React.FC<BrewDetailsOutcomeProp> = ({
  brew,
}) => {
  return (
    <div tw="space-y-4">
      <DetailsCard
        title="Outcome"
        action={{ type: "link", label: "Edit", href: "outcome" }}
        rows={[
          {
            label: "Overall score",
            value: brew.rating ? `${brew.rating}/10` : "",
          },
        ]}
      />

      <Card.Container>
        <Card.Header title="Notes" />

        <Card.Content>
          <article tw="prose-sm prose">
            <ReactMarkdown>{brew.notes ?? ""}</ReactMarkdown>
          </article>
        </Card.Content>
      </Card.Container>

      <DetailsCard
        title="Time"
        action={{ type: "link", label: "Edit", href: "edit" }}
        rows={[
          {
            label: "Time",
            value:
              brew.timeMinutes ?? brew.timeSeconds
                ? `${brew.timeMinutes ?? ""}:${brew.timeSeconds ?? ""}`
                : "",
          },
        ]}
      />

      <DetailsCard
        title="Tasting notes"
        action={{ type: "link", label: "Edit", href: "outcome" }}
        rows={[
          {
            label: "Aroma",
            value: brew.tastingScores?.aroma
              ? `${brew.tastingScores.aroma}/10`
              : "",
          },
          {
            label: "Acidity",
            value: brew.tastingScores?.acidity
              ? `${brew.tastingScores.acidity}/10`
              : "",
          },
          {
            label: "Sweetness",
            value: brew.tastingScores?.sweetness
              ? `${brew.tastingScores.sweetness}/10`
              : "",
          },
          {
            label: "Body",
            value: brew.tastingScores?.body
              ? `${brew.tastingScores.body}/10`
              : "",
          },
          {
            label: "Finish",
            value: brew.tastingScores?.finish
              ? `${brew.tastingScores.finish}/10`
              : "",
          },
        ]}
      />

      <DetailsCard
        title="Extraction"
        action={{ type: "link", label: "Edit", href: "outcome" }}
        rows={[
          {
            label: "Extraction type",
            value: brew.extractionType ?? "",
          },
          {
            label: "Extraction yield",
            value: `${getEyFromBrew(brew)}%`,
          },
          {
            label: "Final brew weight",
            value: brew.finalBrewWeight ? `${brew.finalBrewWeight}g` : "",
          },
          {
            label: "TDS",
            value: brew.tds ? `${brew.tds}%` : "",
          },
        ]}
      />
    </div>
  );
};

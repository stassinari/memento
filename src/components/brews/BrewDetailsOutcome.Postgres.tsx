import ReactMarkdown from "react-markdown";

import type { Brew } from "~/db/types";
import { getEyFromBrew } from "~/utils";
import { Card } from "../Card";
import { DetailsCard } from "../Details";

interface BrewDetailsOutcomeProp {
  brew: Brew;
}

export const BrewDetailsOutcome = ({ brew }: BrewDetailsOutcomeProp) => {
  return (
    <div className="space-y-4">
      <DetailsCard
        title="Outcome"
        action={{
          type: "link",
          label: "Edit",
          linkProps: {
            to: "/drinks/brews/$brewId/outcome",
            params: { brewId: brew.id },
          },
        }}
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
          <article className="prose-sm prose">
            <ReactMarkdown>{brew.notes ?? ""}</ReactMarkdown>
          </article>
        </Card.Content>
      </Card.Container>

      <DetailsCard
        title="Time"
        action={{
          type: "link",
          label: "Edit",
          linkProps: {
            to: "/drinks/brews/$brewId/edit",
            params: { brewId: brew.id },
          },
        }}
        rows={[
          {
            label: "Time",
            value:
              (brew.timeMinutes ?? brew.timeSeconds)
                ? `${brew.timeMinutes ?? ""}:${brew.timeSeconds ?? ""}`
                : "",
          },
        ]}
      />

      <DetailsCard
        title="Tasting notes"
        action={{
          type: "link",
          label: "Edit",
          linkProps: {
            to: "/drinks/brews/$brewId/outcome",
            params: { brewId: brew.id },
          },
        }}
        rows={[
          {
            label: "Aroma",
            value: brew.aroma ? `${brew.aroma}/10` : "",
          },
          {
            label: "Acidity",
            value: brew.acidity ? `${brew.acidity}/10` : "",
          },
          {
            label: "Sweetness",
            value: brew.sweetness ? `${brew.sweetness}/10` : "",
          },
          {
            label: "Body",
            value: brew.body ? `${brew.body}/10` : "",
          },
          {
            label: "Finish",
            value: brew.finish ? `${brew.finish}/10` : "",
          },
        ]}
      />

      <DetailsCard
        title="Extraction"
        action={{
          type: "link",
          label: "Edit",
          linkProps: {
            to: "/drinks/brews/$brewId/outcome",
            params: { brewId: brew.id },
          },
        }}
        rows={[
          {
            label: "Extraction type",
            value: brew.extractionType ?? "",
          },
          {
            label: "Extraction yield",
            value: `${getEyFromBrew({
              tds: brew.tds ?? 0,
              finalBrewWeight: brew.finalBrewWeight ?? 0,
              beansWeight: brew.beansWeight ?? 0,
              extractionType: brew.extractionType,
              waterWeight: brew.waterWeight ?? 0,
            })}%`,
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

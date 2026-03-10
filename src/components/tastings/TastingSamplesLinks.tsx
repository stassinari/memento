import { Link as RouterLink } from "@tanstack/react-router";
import {
  TastingSamplesList,
  TastingSamplesListItem,
  TastingSamplesListItemContent,
} from "~/components/tastings/TastingSamplesList";
import { buildBeansLookup, getTastingSampleLabel } from "~/components/tastings/utils";

interface TastingSampleLike {
  id: string;
  variableValueText: string | null;
  variableValueBeansId: string | null;
}

interface TastingSamplesLinksProps {
  variant: "inbox" | "card";
  tastingId: string;
  variable: string | null;
  samples: TastingSampleLike[];
  beansLookup: ReturnType<typeof buildBeansLookup>;
  selectedSampleId?: string;
}

export const TastingSamplesLinks = ({
  variant,
  tastingId,
  variable,
  samples,
  beansLookup,
  selectedSampleId,
}: TastingSamplesLinksProps) => (
  <TastingSamplesList variant={variant}>
    {samples.map((sample, index) => (
      <TastingSamplesListItem
        key={sample.id}
        variant={variant}
        isSelected={selectedSampleId === sample.id}
        asChild
      >
        <RouterLink
          to="/drinks/tastings/$tastingId/samples/$sampleId"
          params={{ tastingId, sampleId: sample.id }}
          resetScroll={false}
        >
          <TastingSamplesListItemContent
            sampleNumber={index + 1}
            label={getTastingSampleLabel(variable, sample, beansLookup, index + 1)}
          />
        </RouterLink>
      </TastingSamplesListItem>
    ))}
  </TastingSamplesList>
);

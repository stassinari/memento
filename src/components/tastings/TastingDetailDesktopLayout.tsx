import type { ReactNode } from "react";
import { NotFound } from "~/components/ErrorPage";
import { TastingSetupCard } from "~/components/tastings/TastingDetailCards";
import { TastingDetailHeader } from "~/components/tastings/TastingDetailHeader";
import { TastingSamplesLinks } from "~/components/tastings/TastingSamplesLinks";
import { TastingSamplesShell } from "~/components/tastings/TastingSamplesShell";
import { buildBeansLookup } from "~/components/tastings/utils";
import { useTastingDetailData } from "~/hooks/queries/tastings";

interface TastingDetailDesktopLayoutProps {
  tastingId: string;
  selectedSampleId?: string;
  children: (params: {
    tasting: NonNullable<ReturnType<typeof useTastingDetailData>["tasting"]>;
    beansLookup: ReturnType<typeof buildBeansLookup>;
  }) => ReactNode;
}

export const TastingDetailDesktopLayout = ({
  tastingId,
  selectedSampleId,
  children,
}: TastingDetailDesktopLayoutProps) => {
  const { tasting, beans, isLoadingTasting } = useTastingDetailData({ tastingId });

  if (isLoadingTasting) {
    return null;
  }

  if (!tasting) {
    return <NotFound />;
  }

  const beansLookup = buildBeansLookup(beans);

  return (
    <>
      <TastingDetailHeader
        tastingId={tasting.id}
        variable={tasting.variable}
        name={tasting.name}
        date={tasting.date}
        createdAt={tasting.createdAt}
      />

      <TastingSetupCard tasting={tasting} />

      <TastingSamplesShell
        list={
          <TastingSamplesLinks
            variant="inbox"
            tastingId={tasting.id}
            variable={tasting.variable}
            samples={tasting.samples}
            beansLookup={beansLookup}
            selectedSampleId={selectedSampleId}
          />
        }
      >
        {children({ tasting, beansLookup })}
      </TastingSamplesShell>
    </>
  );
};

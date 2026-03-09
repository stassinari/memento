import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { NotFound } from "~/components/ErrorPage";
import { Heading } from "~/components/Heading";
import { TastingScoringForm } from "~/components/tastings/TastingScoringForm";
import { formatTastingDate } from "~/components/tastings/utils";
import { useTastingDetailData } from "~/hooks/queries/tastings";

export const Route = createFileRoute("/_auth/_layout/drinks/tastings/$tastingId/scoring")({
  component: TastingScoringPage,
});

function TastingScoringPage() {
  const { tastingId } = Route.useParams();
  const navigate = useNavigate();

  const { tasting, beans, isLoadingTasting } = useTastingDetailData({ tastingId });

  if (isLoadingTasting) {
    return null;
  }

  if (!tasting) {
    return <NotFound />;
  }

  return (
    <>
      <BreadcrumbsWithHome
        items={[
          navLinks.drinks,
          navLinks.tastings,
          { label: "Detail", link: { to: "/drinks/tastings/$tastingId", params: { tastingId } } },
          { label: "Scoring" },
        ]}
      />
      <Heading>Tasting scoring</Heading>
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {formatTastingDate(tasting.date ?? tasting.createdAt)}
      </p>

      <TastingScoringForm
        tastingId={tastingId}
        tasting={tasting}
        beansLookup={beans}
        onBack={() => navigate({ to: "/drinks/tastings/$tastingId", params: { tastingId } })}
      />
    </>
  );
}

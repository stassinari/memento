import { navLinks } from "@/components/BottomNav";
import { BreadcrumbsWithHome } from "@/components/Breadcrumbs";
import { Heading } from "@/components/Heading";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_layout/drinks/tastings")({
  component: TastingsPage,
});

function TastingsPage() {
  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.tastings]} />
      <Heading>Tastings</Heading>
      <p className="mt-4">Tastings here soon</p>
    </>
  );
}

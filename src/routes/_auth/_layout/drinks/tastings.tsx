import { createFileRoute } from "@tanstack/react-router";
import { navLinks } from "~/components/BottomNav";
import { BreadcrumbsWithHome } from "~/components/Breadcrumbs";
import { Heading } from "~/components/Heading";

export const Route = createFileRoute("/_auth/_layout/drinks/tastings")({
  component: TastingsPage,
});

function TastingsPage() {
  return (
    <>
      <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.tastings]} />
      <Heading>Tastings</Heading>
      <p className="mt-4">
        Tastings were a feature of the original Memento app, but have not yet been implemented in
        this version.
      </p>
    </>
  );
}

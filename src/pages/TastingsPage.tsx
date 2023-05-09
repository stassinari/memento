import React from "react";
import { navLinks } from "../components/BottomNav";
import { BreadcrumbsWithHome } from "../components/Breadcrumbs";
import { PageHeading } from "../components/Heading";

export const TastingsPage: React.FC = () => (
  <>
    <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.tastings]} />
    <PageHeading>Tastings</PageHeading>
    Tastings here soon
  </>
);

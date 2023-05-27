import React from "react";
import { navLinks } from "../components/BottomNav";
import { BreadcrumbsWithHome } from "../components/Breadcrumbs";
import { Heading } from "../components/Heading";

export const TastingsPage: React.FC = () => (
  <>
    <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.tastings]} />
    <Heading>Tastings</Heading>
    Tastings here soon
  </>
);

import React from "react";
import "twin.macro";
import { navLinks } from "../components/BottomNav";
import { BreadcrumbsWithHome } from "../components/Breadcrumbs";
import { Heading } from "../components/Heading";

export const TastingsPage: React.FC = () => (
  <>
    <BreadcrumbsWithHome items={[navLinks.drinks, navLinks.tastings]} />
    <Heading>Tastings</Heading>
    <p tw="mt-4">Tastings here soon</p>
  </>
);

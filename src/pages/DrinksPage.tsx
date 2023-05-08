import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { navLinks } from "../components/BottomNav";
import { BreadcrumbsWithHome } from "../components/Breadcrumbs";
import { PageHeading } from "../components/Heading";
import { Link } from "../components/Link";

export const DrinksPage: React.FC = () => (
  <>
    <BreadcrumbsWithHome items={[navLinks.drinks]} />

    <PageHeading>Drinks</PageHeading>

    <ul>
      <li>
        <Link as={RouterLink} to="brews">
          Go to brews
        </Link>
      </li>
      <li>
        <Link as={RouterLink} to="espresso">
          Go to espressos
        </Link>
      </li>
      <li>
        <Link as={RouterLink} to="tastings">
          Go to tastings
        </Link>
      </li>
    </ul>
  </>
);

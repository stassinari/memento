import { Link as RouterLink } from "react-router-dom";
import { Link } from "../components/Link";

export const DrinksPage = () => (
  <div>
    Drink here soon{" "}
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
  </div>
);

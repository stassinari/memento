import { Link } from "../components/Link";

export const DrinksPage = () => (
  <div>
    Drink here soon{" "}
    <ul>
      <li>
        <Link to="brews">Go to brews</Link>
      </li>
      <li>
        <Link to="espresso">Go to espressos</Link>
      </li>
      <li>
        <Link to="tastings">Go to tastings</Link>
      </li>
    </ul>
  </div>
);

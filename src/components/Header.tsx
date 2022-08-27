import { Link } from "react-router-dom";
import "twin.macro";
import { AuthStatus } from "./auth/AuthStatus";

export const Header = () => (
  <header tw="flex justify-between">
    <nav>
      <ol tw="flex gap-4">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="test">Test</Link>
        </li>
        <li>
          <Link to="beans">Beans</Link>
        </li>
        <li>
          <Link to="public">Public page</Link>
        </li>
        <li>
          <Link to="no-auth">No auth page</Link>
        </li>
      </ol>
    </nav>
    <AuthStatus />
  </header>
);

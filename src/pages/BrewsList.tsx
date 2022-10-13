import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export const BrewsList = () => (
  <div>
    <Button as={Link} to="add" variant="primary" colour="accent">
      Add brew
    </Button>
    <div>Brews list TBD</div>
  </div>
);

import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { useBrewsList } from "../hooks/firestore/useBrewsList";

export const BrewsList = () => {
  const { brewsList } = useBrewsList();
  console.log(brewsList);
  return (
    <div>
      <Button as={Link} to="add" variant="primary" colour="accent">
        Add brew
      </Button>
      <div>Brews list TBD</div>
    </div>
  );
};

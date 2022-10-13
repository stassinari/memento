import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { useFirestoreList } from "../hooks/firestore/useFirestoreList";
import { Brew } from "../types/brews";

export const BrewsList = () => {
  const { list: brewsList } = useFirestoreList<Brew>("brews");
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

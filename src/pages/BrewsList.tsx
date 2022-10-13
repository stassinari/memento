import { Link as RouterLink } from "react-router-dom";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { useFirestoreList } from "../hooks/firestore/useFirestoreList";
import { Brew } from "../types/brews";

export const BrewsList = () => {
  const { list: brewsList } = useFirestoreList<Brew>("brews");
  console.log(brewsList);
  return (
    <div>
      <Button as={RouterLink} to="add" variant="primary" colour="accent">
        Add brew
      </Button>
      <div>
        <ul>
          {brewsList.map((brew) => (
            <li>
              <Link to={brew.id || ""}>
                {brew.method} ({brew.method})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

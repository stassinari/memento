import { orderBy } from "firebase/firestore";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "../../components/Button";
import { Link } from "../../components/Link";
import { useFirestoreCollection } from "../../hooks/firestore/useFirestoreCollection";
import { Brew } from "../../types/brews";

export const BrewsList = () => {
  const { list: brewsList } = useFirestoreCollection<Brew>("brews", [
    orderBy("date", "desc"),
  ]);
  return (
    <div>
      <Button as={RouterLink} to="add" variant="primary" colour="accent">
        Add brew
      </Button>
      <div>
        <ul>
          {brewsList.map((brew) => (
            <li key={brew.id}>
              <Link to={brew.id ?? ""}>
                {brew.method} ({brew.method})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

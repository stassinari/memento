import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
import "twin.macro";

export const Lolz: React.FC = () => {
  const firestore = useFirestore();
  const burritoRef = doc(firestore, "tryreactfire", "burrito");

  const { status, data } = useFirestoreDocData(burritoRef);

  if (status === "loading") {
    return <p>Fetching burrito flavour...</p>;
  }

  console.log(data);

  return (
    <div>
      Lolz are public
      <button>Button</button>
    </div>
  );
};

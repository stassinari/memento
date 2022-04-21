import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
import "twin.macro";

export const Lolz: React.FC = () => {
  const firestore = useFirestore();
  const burritoRef = doc(firestore, "tryreactfire", "burrito");

  const { status, data } = useFirestoreDocData(burritoRef);

  if (status === "loading") {
    return <p>Fetching burrito flavor...</p>;
  }

  console.log(data);

  return (
    <div>
      Hic sunt (React XVIII) lolz... {data.testing}
      <button tw="btn btn-xs">Button</button>
    </div>
  );
};

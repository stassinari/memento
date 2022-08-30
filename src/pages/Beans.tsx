import { collection, orderBy, query } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";

export const Beans = () => {
  const { data: user } = useUser();
  const firestore = useFirestore();
  const beansRef = collection(firestore, "users", user?.uid || "", "beans");
  const beansQuery = query(beansRef, orderBy("roastDate", "desc"));
  const { status, data: beans } = useFirestoreCollectionData(beansQuery, {
    idField: "id",
  });

  if (status === "loading") {
    return <span>loading...</span>;
  }

  return (
    <div>
      These are all your beans
      {beans.map((b) => (
        <div key={b.id}>
          {b.name} - {b.roaster}
        </div>
      ))}
    </div>
  );
};

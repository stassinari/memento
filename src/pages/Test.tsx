import { collection, orderBy, query } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";

export const Test = () => {
  const { data: user } = useUser();
  const firestore = useFirestore();
  const brewsRef = collection(firestore, "users", user?.uid || "", "brews");
  const brewsQuery = query(brewsRef, orderBy("date", "desc"));
  const { status, data: brews } = useFirestoreCollectionData(brewsQuery, {
    idField: "id",
  });

  if (status === "loading") {
    return <span>loading...</span>;
  }

  return (
    <div>
      These are all your brews
      {brews.map((b) => (
        <div key={b.id}>{b.method}</div>
      ))}
    </div>
  );
};

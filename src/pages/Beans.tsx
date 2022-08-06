import { PlusCircleIcon } from "@heroicons/react/solid";
import { collection, orderBy, query } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

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
      <Input label="Roaster" placeholder="E.g La Cabra" />
      <div>
        <Button label="Button xs" size="xs" />
        <Button label="Button sm" size="sm" />
        <Button label="Button md" />
        <Button label="Button lg" size="lg" />
        <Button label="Button xl" size="xl" />
      </div>
      <div>
        <Button label="Button xs" size="xs" Icon={PlusCircleIcon} />
        <Button label="Button sm" size="sm" Icon={PlusCircleIcon} />
        <Button label="Button md" Icon={PlusCircleIcon} />
        <Button label="Button lg" size="lg" Icon={PlusCircleIcon} />
        <Button label="Button xl" size="xl" Icon={PlusCircleIcon} />
      </div>
    </div>
  );
};

import { PlusCircleIcon } from "@heroicons/react/solid";
import { collection, orderBy, query } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { Button } from "../components/Button";

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
      <div>
        <Button variant="primary" size="xs">
          Button xs
        </Button>
        <Button variant="primary" size="sm">
          Button sm
        </Button>
        <Button variant="primary">Button md</Button>
        <Button variant="primary" size="lg">
          Button lg
        </Button>
        <Button variant="primary" size="xl">
          Button xl
        </Button>
      </div>
      <div>
        <Button variant="secondary" size="xs">
          Button xs
        </Button>
        <Button variant="secondary" size="sm">
          Button sm
        </Button>
        <Button variant="secondary">Button md</Button>
        <Button variant="secondary" size="lg">
          Button lg
        </Button>
        <Button variant="secondary" size="xl">
          Button xl
        </Button>
      </div>
      <div>
        <Button variant="white" size="xs">
          Button xs
        </Button>
        <Button variant="white" size="sm">
          Button sm
        </Button>
        <Button variant="white">Button md</Button>
        <Button variant="white" size="lg">
          Button lg
        </Button>
        <Button variant="white" size="xl">
          Button xl
        </Button>
      </div>
      <div>
        <Button variant="primary" size="xs" Icon={<PlusCircleIcon />}>
          Button xs
        </Button>
        <Button variant="primary" size="sm" Icon={<PlusCircleIcon />}>
          Button sm
        </Button>
        <Button variant="primary" Icon={<PlusCircleIcon />}>
          Button md asdasdasdasd
        </Button>
        <Button variant="primary" size="lg" Icon={<PlusCircleIcon />}>
          Button lg
        </Button>
        <Button variant="primary" size="xl" Icon={<PlusCircleIcon />}>
          Button xl
        </Button>
      </div>
      <div>
        <Button variant="secondary" size="xs" Icon={<PlusCircleIcon />}>
          Button xs
        </Button>
        <Button variant="secondary" size="sm" Icon={<PlusCircleIcon />}>
          Button sm
        </Button>
        <Button variant="secondary" Icon={<PlusCircleIcon />}>
          Button md
        </Button>
        <Button variant="secondary" size="lg" Icon={<PlusCircleIcon />}>
          Button lg
        </Button>
        <Button variant="secondary" size="xl" Icon={<PlusCircleIcon />}>
          Button xl
        </Button>
      </div>
      <div>
        <Button variant="white" size="xs" Icon={<PlusCircleIcon />}>
          Button xs
        </Button>
        <Button variant="white" size="sm" Icon={<PlusCircleIcon />}>
          Button sm
        </Button>
        <Button variant="white" Icon={<PlusCircleIcon />}>
          Button md asdasdasdasdasd
        </Button>
        <Button variant="white" size="lg" Icon={<PlusCircleIcon />}>
          Button lg
        </Button>
        <Button variant="white" size="xl" Icon={<PlusCircleIcon />}>
          Button xl
        </Button>
      </div>
    </div>
  );
};

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
      {/* <FormInput label="Roaster" name="roaster" placeholder="E.g La Cabra" /> */}
      <div>
        <Button variant="primary" label="Button xs" size="xs" />
        <Button variant="primary" label="Button sm" size="sm" />
        <Button variant="primary" label="Button md" />
        <Button variant="primary" label="Button lg" size="lg" />
        <Button variant="primary" label="Button xl" size="xl" />
      </div>
      <div>
        <Button variant="secondary" label="Button xs" size="xs" />
        <Button variant="secondary" label="Button sm" size="sm" />
        <Button variant="secondary" label="Button md" />
        <Button variant="secondary" label="Button lg" size="lg" />
        <Button variant="secondary" label="Button xl" size="xl" />
      </div>
      <div>
        <Button variant="white" label="Button xs" size="xs" />
        <Button variant="white" label="Button sm" size="sm" />
        <Button variant="white" label="Button md" />
        <Button variant="white" label="Button lg" size="lg" />
        <Button variant="white" label="Button xl" size="xl" />
      </div>
      <div>
        <Button
          variant="primary"
          label="Button xs"
          size="xs"
          Icon={<PlusCircleIcon />}
        />
        <Button
          variant="primary"
          label="Button sm"
          size="sm"
          Icon={<PlusCircleIcon />}
        />
        <Button variant="primary" label="Button md" Icon={<PlusCircleIcon />} />
        <Button
          variant="primary"
          label="Button lg"
          size="lg"
          Icon={<PlusCircleIcon />}
        />
        <Button
          variant="primary"
          label="Button xl"
          size="xl"
          Icon={<PlusCircleIcon />}
        />
      </div>
      <div>
        <Button
          variant="secondary"
          label="Button xs"
          size="xs"
          Icon={<PlusCircleIcon />}
        />
        <Button
          variant="secondary"
          label="Button sm"
          size="sm"
          Icon={<PlusCircleIcon />}
        />
        <Button
          variant="secondary"
          label="Button md"
          Icon={<PlusCircleIcon />}
        />
        <Button
          variant="secondary"
          label="Button lg"
          size="lg"
          Icon={<PlusCircleIcon />}
        />
        <Button
          variant="secondary"
          label="Button xl"
          size="xl"
          Icon={<PlusCircleIcon />}
        />
      </div>
      <div>
        <Button
          variant="white"
          label="Button xs"
          size="xs"
          Icon={<PlusCircleIcon />}
        />
        <Button
          variant="white"
          label="Button sm"
          size="sm"
          Icon={<PlusCircleIcon />}
        />
        <Button variant="white" label="Button md" Icon={<PlusCircleIcon />} />
        <Button
          variant="white"
          label="Button lg"
          size="lg"
          Icon={<PlusCircleIcon />}
        />
        <Button
          variant="white"
          label="Button xl"
          size="xl"
          Icon={<PlusCircleIcon />}
        />
      </div>
    </div>
  );
};

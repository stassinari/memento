import { useDocRef } from "../../hooks/firestore/useDocRef";
import { useFirestoreDocRealtime } from "../../hooks/firestore/useFirestoreDocRealtime";
import { Beans } from "../../types/beans";
import { Card } from "../Card";

interface BeansShortInfoProps {
  beansId?: string;
  brewDate: Date;
}

export const BeansShortInfo: React.FC<BeansShortInfoProps> = ({
  beansId,
  brewDate,
}) => {
  console.log("BeansShortInfo");

  const docRef = useDocRef<Beans>("beans", beansId);
  const { details: beans, isLoading } = useFirestoreDocRealtime<Beans>(docRef);

  if (isLoading) return null;

  if (!beans) return null;

  const secondsBetween = beans.roastDate
    ? Number(brewDate) - Number(beans.roastDate.toDate())
    : 0;

  const daysBetween = Math.round(secondsBetween / (1000 * 60 * 60 * 24));

  return (
    <Card>
      <Card.Header
        title="Beans"
        action={{
          type: "link",
          label: "View",
          href: beans.id ? `/beans/${beans.id}` : "",
        }}
      />
      <Card.DescriptionList
        rows={[
          {
            label: "Name",
            value: beans.name,
          },
          { label: "Roaster", value: beans.roaster },
          {
            label: "Days post roast",
            value: daysBetween ? `${daysBetween}` : "",
          },
        ]}
      />
    </Card>
  );
};

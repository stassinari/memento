import { useFirestoreDoc } from "../../hooks/firestore/useFirestoreDoc";
import { NotFound } from "../../pages/NotFound";
import { Beans } from "../../types/beans";
import { Details } from "../Details";

interface BeansShortInfoProps {
  beansId?: string;
  brewDate: Date;
}

export const BeansShortInfo: React.FC<BeansShortInfoProps> = ({
  beansId,
  brewDate,
}) => {
  const { details: beans, isLoading } = useFirestoreDoc<Beans>(
    "beans",
    beansId
  );

  if (isLoading) return null;

  if (!beans) {
    return <NotFound />;
  }

  const secondsBetween = beans.roastDate
    ? Number(brewDate) - Number(beans.roastDate.toDate())
    : 0;

  const daysBetween = Math.round(secondsBetween / (1000 * 60 * 60 * 24));

  return (
    <Details
      title="Beans"
      rows={[
        {
          label: "Name",
          value: beans.name,
          link: beans.id ? `/beans/${beans.id}` : undefined,
        },
        { label: "Roaster", value: beans.roaster },
        {
          label: "Days post roast",
          value: daysBetween ? `${daysBetween}` : "",
        },
      ]}
    />
  );
};

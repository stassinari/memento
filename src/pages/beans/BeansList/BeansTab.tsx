import { QueryConstraint } from "firebase/firestore";
import { Fragment, ReactNode } from "react";
import "twin.macro";
import { DataList } from "../../../components/DataList";
import { beansToDataListItem } from "../../../components/beans/utils";
import { useCollectionQuery } from "../../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../../../hooks/firestore/useFirestoreCollectionRealtime";
import { Beans } from "../../../types/beans";
import { isNotFrozenOrIsThawed } from "../../../util";

export interface BeansTabProps {
  name: "Archived" | "Frozen" | "Open";
  filters: QueryConstraint[];
  removeFrozen?: boolean;
  EmptyState: ReactNode;
}

export const BeansTab: React.FC<BeansTabProps> = ({
  filters,
  removeFrozen,
  EmptyState,
}) => {
  console.log("BeansTab");

  const query = useCollectionQuery<Beans>("beans", filters);
  const { list: beansList, isLoading } =
    useFirestoreCollectionRealtime<Beans>(query);

  if (isLoading) return null;

  const sortedAndFiltered = beansList
    .sort((a, b) =>
      (a.roastDate?.toDate() || 0) < (b.roastDate?.toDate() || 0) ? 1 : -1
    )
    .filter(removeFrozen ? isNotFrozenOrIsThawed : () => true);

  if (sortedAndFiltered.length === 0) return <Fragment>{EmptyState}</Fragment>;

  return <DataList items={sortedAndFiltered.map(beansToDataListItem)} />;
};

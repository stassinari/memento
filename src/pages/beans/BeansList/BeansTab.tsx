import { BeakerIcon, FireIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { type QueryConstraint } from "firebase/firestore";
import React, { ReactNode } from "react";
import "twin.macro";
import { ListCard } from "../../../components/ListCard";
import { BeanIcon } from "../../../components/icons/BeanIcon";
import { useCollectionQuery } from "../../../hooks/firestore/useCollectionQuery";
import { useFirestoreCollectionRealtime } from "../../../hooks/firestore/useFirestoreCollectionRealtime";
import { type Beans } from "../../../types/beans";
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
      (a.roastDate?.toDate() ?? 0) < (b.roastDate?.toDate() ?? 0) ? 1 : -1
    )
    .filter(removeFrozen ? isNotFrozenOrIsThawed : () => true);

  if (sortedAndFiltered.length === 0) return <>{EmptyState}</>;

  return (
    <ul tw="grid gap-4 sm:grid-cols-2">
      {sortedAndFiltered.map((beans) => (
        <li key={beans.id}>
          <ListCard
            linkTo={`/beans/${beans.id ?? ""}`}
            footerSlot={
              <ListCard.Footer text="Roasted 18 days ago" Icon={<BeanIcon />} />
            }
          >
            <div tw="flex">
              <div tw="flex-grow">
                <ListCard.Title>{beans.name}</ListCard.Title>
                <ListCard.Row>
                  <ListCard.RowIcon>
                    <FireIcon />
                  </ListCard.RowIcon>
                  {beans.roaster}
                </ListCard.Row>
                {beans.origin === "single-origin" ? (
                  <>
                    {beans.country && (
                      <ListCard.Row>
                        <ListCard.RowIcon>
                          <MapPinIcon />
                        </ListCard.RowIcon>
                        {beans.country}
                      </ListCard.Row>
                    )}
                    {beans.process && (
                      <ListCard.Row>
                        <ListCard.RowIcon>
                          <BeakerIcon />
                        </ListCard.RowIcon>
                        {beans.process}
                      </ListCard.Row>
                    )}
                  </>
                ) : (
                  <ListCard.Row>
                    <ListCard.RowIcon>
                      <MapPinIcon />
                    </ListCard.RowIcon>
                    Blend
                  </ListCard.Row>
                )}
              </div>
            </div>
          </ListCard>
        </li>
      ))}
    </ul>
  );
};

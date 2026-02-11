import { BeakerIcon, FireIcon, MapPinIcon } from "@heroicons/react/16/solid";
import { BeanIconSolid } from "~/components/icons/BeanIconSolid";
import { ListCard } from "~/components/ListCard";
import { Beans } from "~/db/types";
import { getTimeAgo } from "~/util";

type BeansCardProps = {
  beans: Beans;
};

export const BeansCard = ({ beans }: BeansCardProps) => {
  return (
    <ListCard
      linkTo={`/beans/$beansId`}
      footerSlot={
        beans.roastDate ? (
          <ListCard.Footer
            text={`Roasted ${getTimeAgo(beans.roastDate)}`}
            Icon={<BeanIconSolid />}
          />
        ) : undefined
      }
    >
      <div className="flex">
        <div className="grow">
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
  );
};

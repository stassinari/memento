import { BeakerIcon, FireIcon, MapPinIcon } from "@heroicons/react/16/solid";
import { useRef } from "react";
import { BeanIconSolid } from "./icons/BeanIconSolid";
import { ListCard } from "./ListCard";

const skeletonStyles =
  "animate-pulse bg-gray-300 rounded-sm text-transparent text-xs py-0.5 bg-clip-content";

const randomChars = (min: number, max: number) =>
  "x".repeat(Math.floor(Math.random() * (max - min + 1)) + min);

export const CardSkeleton = () => {
  const chars = useRef({
    title: randomChars(13, 34),
    firstRow: randomChars(5, 21),
    secondRow: randomChars(8, 34),
    thirdRow: randomChars(5, 13),
    footer: randomChars(13, 21),
  });

  return (
    <ListCard
      footerSlot={
        <ListCard.Footer Icon={<BeanIconSolid />}>
          <span aria-hidden="true" className={skeletonStyles}>
            {chars.current.footer}
          </span>
        </ListCard.Footer>
      }
    >
      <div className="flex">
        <div className="grow">
          <ListCard.Title>
            <span aria-hidden="true" className={skeletonStyles}>
              {chars.current.title}
            </span>
          </ListCard.Title>
          <ListCard.Row>
            <ListCard.RowIcon>
              <FireIcon />
            </ListCard.RowIcon>
            <span aria-hidden="true" className={skeletonStyles}>
              {chars.current.firstRow}
            </span>
          </ListCard.Row>
          <ListCard.Row>
            <ListCard.RowIcon>
              <MapPinIcon />
            </ListCard.RowIcon>
            <span aria-hidden="true" className={skeletonStyles}>
              {chars.current.secondRow}
            </span>
          </ListCard.Row>
          <ListCard.Row>
            <ListCard.RowIcon>
              <BeakerIcon />
            </ListCard.RowIcon>
            <span aria-hidden="true" className={skeletonStyles}>
              {chars.current.thirdRow}
            </span>
          </ListCard.Row>
        </div>
      </div>
    </ListCard>
  );
};

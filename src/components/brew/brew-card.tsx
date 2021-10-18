import React, { FunctionComponent } from "react";
import { Brew } from "../../database/types/brew";
import Card, { CardRating } from "../card";
import BeanIcon from "../icons/bean";

interface Props {
  brew: Brew;
  beansLabel?: string | null;
}

const BrewCard: FunctionComponent<Props> = ({ brew, beansLabel }) => (
  <Card
    title={brew.method}
    link={`/brews/${brew.id}`}
    aside={
      !!brew.rating && (
        <CardRating variant={brew.rating >= 6 ? "primary" : "secondary"}>
          {brew.rating}
        </CardRating>
      )
    }
    secondLine={beansLabel || undefined}
    SecondLineIcon={BeanIcon}
    date={brew.date}
    datePrefix="Brewed on"
  />
);

export default BrewCard;

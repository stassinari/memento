import { Chip } from "@material-ui/core";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import React, { FunctionComponent } from "react";
import Card, { CardRating } from "../card";
import BeanIcon from "../icons/bean";
interface Props {
  espresso: Espresso;
  beansLabel?: string;
}

const NewChip = (
  <Chip label="NEW" size="small" color="primary" icon={<NewReleasesIcon />} />
);

const EspressoCard: FunctionComponent<Props> = ({ espresso, beansLabel }) => {
  const rating =
    espresso.rating && espresso.rating !== 0 ? espresso.rating : undefined;
  const profileName = espresso.profileName
    ? espresso.profileName
    : "Unknown profile";
  return espresso.partial ? (
    // just added decent case
    <Card
      link={`/espresso/${espresso.id}`}
      title={profileName}
      aside={<CardRating variant="primary">{NewChip}</CardRating>}
      date={espresso.date}
      datePrefix="Pulled on"
    />
  ) : espresso.fromDecent ? (
    // custom card for decent shots
    <Card
      title={profileName}
      secondLine={beansLabel}
      SecondLineIcon={BeanIcon}
      link={`/espresso/${espresso.id}`}
      aside={
        rating && (
          <CardRating variant={rating >= 6 ? "primary" : "secondary"}>
            {rating}
          </CardRating>
        )
      }
      date={espresso.date}
      datePrefix="Pulled on"
    />
  ) : (
    // manually added case
    <Card
      link={`/espresso/${espresso.id}`}
      aside={
        rating && (
          <CardRating variant={rating >= 6 ? "primary" : "secondary"}>
            {rating}
          </CardRating>
        )
      }
      secondLine={beansLabel}
      SecondLineIcon={BeanIcon}
      date={espresso.date}
      datePrefix="Pulled on"
    />
  );
};

export default EspressoCard;

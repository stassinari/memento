import React from "react";

import { Action } from "./ButtonWithDropdown";
import { Card, DescriptionListRow } from "./Card";

interface DetailsCardProps {
  title: string;
  action?: Action;
  rows: DescriptionListRow[];
}

export const DetailsCard = ({
  title,
  action,
  rows,
}: DetailsCardProps) => (
  <Card.Container>
    <Card.Header title={title} action={action} />
    <Card.Content>
      <Card.DescriptionList rows={rows} />
    </Card.Content>
  </Card.Container>
);

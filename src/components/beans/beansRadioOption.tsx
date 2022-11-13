import React from "react";
import { Beans } from "../../types/beans";
import { getTimeAgo } from "../../util";
import { InputRadioCardsOption } from "../InputRadioCards";

export const beansRadioOption = (beans: Beans): InputRadioCardsOption => ({
  value: `beans/${beans.id}`,
  left: { top: beans.name, bottom: beans.roaster },
  right: {
    top: beans.roastDate && (
      <React.Fragment>
        Roasted{" "}
        <time dateTime={beans.roastDate?.toDate().toLocaleDateString()}>
          {getTimeAgo(beans.roastDate.toDate())}
        </time>
      </React.Fragment>
    ),
    bottom: beans.origin === "single-origin" ? beans.country : "Blend",
  },
});

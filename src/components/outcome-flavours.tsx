import React, { useState } from "react";
import { Button, Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import SimpleSlider from "../components/simple-slider";

const useStyles = makeStyles((theme) => {
  return {
    expandableButton: {
      marginTop: theme.spacing(1),
    },
  };
});

const OutcomeFlavours = () => {
  const classes = useStyles();

  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => setIsExpanded((prev) => !prev);

  return (
    <>
      <Button
        className={classes.expandableButton}
        variant="outlined"
        onClick={handleClick}
        endIcon={
          isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
        }
      >
        {isExpanded ? "Hide tasting notes" : "Show tasting notes"}
      </Button>
      <Collapse in={isExpanded}>
        <SimpleSlider name="tastingScores.aroma" label="Aroma" />
        <SimpleSlider name="tastingScores.acidity" label="Acidity" />
        <SimpleSlider name="tastingScores.sweetness" label="Sweetness" />
        <SimpleSlider name="tastingScores.body" label="Body" />
        <SimpleSlider name="tastingScores.finish" label="Finish" />
      </Collapse>
    </>
  );
};

export default OutcomeFlavours;

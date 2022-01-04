import React, { useState } from "react";
import { Button, Collapse } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

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

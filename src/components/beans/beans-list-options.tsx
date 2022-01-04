import TuneIcon from "@mui/icons-material/Tune";
import {
  FormControlLabel,
  FormGroup,
  IconButton,
  Popover,
  Switch,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent, useState } from "react";

interface Props {
  showFrozen: boolean;
  setShowFrozen: React.Dispatch<React.SetStateAction<boolean>>;
  showFinished: boolean;
  setShowFinished: React.Dispatch<React.SetStateAction<boolean>>;
}

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
      justifyContent: "flex-end",
    },
    popover: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
  };
});

const BeansListOptions: FunctionComponent<Props> = ({
  showFrozen,
  showFinished,
  setShowFrozen,
  setShowFinished,
}) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "sort-and-filter-beans" : undefined;

  return (
    <>
      <div className={classes.root}>
        <IconButton aria-describedby={id} onClick={handleClick}>
          <TuneIcon />
        </IconButton>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className={classes.popover}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={showFrozen}
                  onChange={() => setShowFrozen(!showFrozen)}
                  name="showFrozen"
                />
              }
              label="Show frozen"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={showFinished}
                  onChange={() => setShowFinished(!showFinished)}
                  name="showFinished"
                />
              }
              label="Show finished"
            />
          </FormGroup>
        </div>
      </Popover>
    </>
  );
};

export default BeansListOptions;

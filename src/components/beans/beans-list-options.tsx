import ClearIcon from "@mui/icons-material/Clear";
import TuneIcon from "@mui/icons-material/Tune";
import {
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Popover,
  Switch,
  TextField,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent, useState } from "react";

interface Props {
  showFrozen: boolean;
  setShowFrozen: React.Dispatch<React.SetStateAction<boolean>>;
  showFinished: boolean;
  setShowFinished: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const useStyles = makeStyles((theme) => {
  return {
    root: {
      display: "flex",
      justifyContent: "flex-end",
    },
    popover: {
      width: theme.spacing(32),
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
  searchQuery,
  setSearchQuery,
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

  const handleClear = () => setSearchQuery("");

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

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
          <TextField
            id="beans-search"
            sx={{ my: 1, width: "100%" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            label="Search beans"
            size="small"
            variant="outlined"
            InputProps={{
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={handleClear}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

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

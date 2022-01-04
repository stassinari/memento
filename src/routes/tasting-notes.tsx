import {
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import AddIcon from "@mui/icons-material/Add";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import React, { useState } from "react";
import Layout from "../components/layout";
import tastingNotes from "../database/tasting-notes";
import { ITastingNotes } from "../database/types/common";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

function TastingNotes() {
  const classes = useStyles();

  const [currentMenu, setCurrentMenu] = useState<ITastingNotes[] | undefined>(
    tastingNotes
  );
  const [menuHistory, setMenuHistory] = useState<ITastingNotes[][]>([]);
  const [notesList, setNotesList] = useState(["Testing", "Moar testing"]);

  console.log("currentMenu", currentMenu);
  console.log("history", menuHistory);

  const setOnClick = (group: ITastingNotes) => {
    if (group.children) {
      return () => {
        let newHistory = [...menuHistory];
        newHistory.push(currentMenu ? currentMenu : []);
        setMenuHistory(newHistory);
        setCurrentMenu(group.children);
      };
    } else {
      return () => {
        if (!notesList.includes(group.name)) {
          setNotesList([...notesList, group.name]);
        }
      };
    }
  };
  const handleBack = () => {
    // @ts-ignore
    setCurrentMenu(...menuHistory.slice(-1));
    setMenuHistory(menuHistory.slice(0, menuHistory.length - 1));
  };

  const handleDelete = (chipToDelete: string) => () => {
    setNotesList((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  if (!currentMenu) {
    return null;
  }

  return (
    <Layout title="Tasting notes *EXPERIMENT*">
      <Paper>
        <Paper variant="outlined" component="ul" className={classes.root}>
          {notesList.map((note) => {
            return (
              <li key={note}>
                <Chip
                  label={note}
                  onDelete={handleDelete(note)}
                  className={classes.chip}
                />
              </li>
            );
          })}
        </Paper>

        <List>
          <ListItem
            button
            onClick={handleBack}
            disabled={menuHistory.length ? false : true}
          >
            <ListItemText primary="Back" />
            <ListItemSecondaryAction>
              <IconButton edge="start" size="large">
                <ChevronLeftIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          {currentMenu.map((group) => (
            <ListItem key={group.name} button onClick={setOnClick(group)}>
              <ListItemText primary={group.name} />
              <ListItemSecondaryAction>
                <IconButton edge="end" size="large">
                  {group.children ? <ChevronRightIcon /> : <AddIcon />}
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Layout>
  );
}

export default TastingNotes;

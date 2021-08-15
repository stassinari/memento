import {
  Box,
  Chip,
  makeStyles,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import EventIcon from "@material-ui/icons/Event";
import React, { FunctionComponent } from "react";
import useCommonStyles from "../../../config/use-common-styles";
import { areBeansFrozen, areBeansThawed } from "../../../utils/beans";
import { renderDate } from "../../../utils/dates";
import { capitalise } from "../../../utils/string";
import { roastLevelLabels } from "../beans-add/fields/roast-level";

interface Props {
  beans: Beans;
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
  roaster: {
    fontSize: "1.25rem",
  },
  label: {
    color: theme.palette.text.secondary,
  },
  icon: {
    fontSize: "0.875rem",
    marginRight: theme.spacing(0.5),
    color: theme.palette.text.secondary,
  },
  chip: {
    marginTop: theme.spacing(1),
  },
}));

const BeansRoastInfo: FunctionComponent<Props> = ({ beans }) => {
  const commonStyles = useCommonStyles();
  const classes = useStyles();

  const showFrozenChip = areBeansFrozen(beans) || areBeansThawed(beans);

  const roastLevel =
    !!beans.roastLevel && roastLevelLabels[beans.roastLevel].label;
  const roastStileAndLevel = [capitalise(beans.roastStyle), roastLevel]
    .filter((s) => !!s)
    .join(" - ");
  const roastingNotes = beans.roastingNotes.join(", ");
  const roastDate = beans.roastDate;

  const hideRoastInfo =
    !roastStileAndLevel && !roastingNotes && !roastDate && !showFrozenChip;

  return (
    <>
      <Typography variant="h5" className={commonStyles.pageTitle}>
        {beans.name}
      </Typography>
      <Typography className={classes.roaster} gutterBottom>
        {beans.roaster}
      </Typography>

      {!hideRoastInfo && (
        <Paper className={classes.root}>
          {roastStileAndLevel && (
            <Typography gutterBottom>{roastStileAndLevel}</Typography>
          )}
          {beans.roastingNotes.length > 0 && (
            <Typography gutterBottom>{roastingNotes}</Typography>
          )}
          {roastDate && (
            <Box alignItems="center" display="flex">
              <EventIcon className={classes.icon} />
              <Typography variant="body2">
                <span className={classes.label}>Roasted on</span>{" "}
                {renderDate(roastDate)}
              </Typography>
            </Box>
          )}

          {showFrozenChip && (
            <Tooltip
              leaveTouchDelay={3000}
              enterTouchDelay={50}
              title={
                <>
                  <span>Frozen on {renderDate(beans.freezeDate)}</span>
                  {beans.thawDate && (
                    <>
                      <br />
                      <span>Thawed on {renderDate(beans.thawDate)}</span>
                    </>
                  )}
                </>
              }
            >
              <Chip
                color="secondary"
                label={areBeansThawed(beans) ? "Thawed" : "Frozen"}
                size="small"
                icon={<AcUnitIcon />}
                className={classes.chip}
              />
            </Tooltip>
          )}
        </Paper>
      )}
    </>
  );
};

export default BeansRoastInfo;

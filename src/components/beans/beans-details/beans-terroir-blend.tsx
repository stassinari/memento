import {
  Divider,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import React, { FunctionComponent } from "react";
import useCommonStyles from "../../../config/use-common-styles";
import { Beans, BeansBlendPart } from "../../../database/types/beans";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  gridItem: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    "&:last-child": {
      paddingBottom: theme.spacing(2),
    },
  },
  name: {
    fontSize: "1.25rem",
  },
  divider: {
    marginTop: theme.spacing(2),
  },
  bold: {
    fontWeight: 600,
  },
  label: {
    fontStyle: "italic",
    color: theme.palette.text.secondary,
  },
}));

interface Props {
  beans: Beans;
}

const BeansTerroirBlend: FunctionComponent<Props> = ({ beans }) => {
  const commonStyles = useCommonStyles();
  const classes = useStyles();
  const theme = useTheme();
  const isBreakpointXs = useMediaQuery(theme.breakpoints.down('sm'));

  const blend = beans.blend;

  const gridSize = blend?.length === 1 ? 12 : blend?.length === 2 ? 6 : 4;

  return (
    <>
      <Typography variant="h5" gutterBottom className={commonStyles.listTitle}>
        Blend composition
      </Typography>
      <Paper className={classes.root}>
        <Grid container>
          {blend &&
            blend.map((item: BeansBlendPart, index: number) => {
              const name = item.name;
              const country = item.country;
              const percentage = item.percentage;

              const procezz = item.process;
              const varietals = item.varietals && item.varietals.join(", ");

              return (
                <Grid
                  item
                  xs={12}
                  sm={gridSize}
                  key={index}
                  className={classes.gridItem}
                >
                  <Typography className={classes.name}>{name}</Typography>
                  <Typography className={classes.bold}>{country}</Typography>
                  {percentage && <Typography>{percentage}%</Typography>}

                  <Typography variant="body2">
                    {[procezz, varietals].filter((s) => !!s).join(" - ")}
                  </Typography>
                  {isBreakpointXs && index !== blend.length - 1 && (
                    <Divider className={classes.divider} />
                  )}
                </Grid>
              );
            })}
        </Grid>
      </Paper>
    </>
  );
};

export default BeansTerroirBlend;

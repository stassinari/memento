import {
  Divider,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import React, { FunctionComponent } from "react";
import useCommonStyles from "../../config/use-common-styles";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    padding: theme.spacing(2),
  },
  name: {
    fontSize: "1.25rem",
  },
  divider: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
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
  const isBreakpointXs = useMediaQuery(theme.breakpoints.down("xs"));

  const blend = beans.blend;

  const gridSize = blend?.length === 1 ? 12 : blend?.length === 2 ? 6 : 4;

  return (
    <Paper className={commonStyles.table}>
      <Grid container>
        {blend &&
          blend.map((item: BeansBlendPart, index: number) => {
            const name = item.name;
            const country = item.country;
            const percentage = item.percentage;

            const procezz = item.process;
            const varietals = item.varietals && item.varietals.join(", ");

            return (
              <>
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
                </Grid>

                {isBreakpointXs && (
                  <Grid item xs={12}>
                    {index !== blend.length - 1 && (
                      <Divider className={classes.divider} />
                    )}
                  </Grid>
                )}
              </>
            );
          })}
      </Grid>
    </Paper>
  );
};

export default BeansTerroirBlend;

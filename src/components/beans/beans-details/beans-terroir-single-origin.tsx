import { Divider, Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import React, { FunctionComponent } from "react";
import useCommonStyles from "../../../config/use-common-styles";
import countriesMap from "../../../database/countries";
import { renderDate } from "../../../utils/dates";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  terroir: {
    padding: theme.spacing(2),
  },
  countryContainer: {
    position: "relative",
    width: "100%",
    padding: theme.spacing(2),
  },
  countryFlag: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "25%",
    opacity: 0.85,
    borderRadius: 4,
  },
  countryMap: {
    width: "100%",
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  bold: {
    fontWeight: 600,
  },
  label: {
    color: theme.palette.text.secondary,
  },
}));

interface Props {
  beans: Beans;
}

const BeansTerroirSingleOrigin: FunctionComponent<Props> = ({ beans }) => {
  const commonStyles = useCommonStyles();
  const classes = useStyles();
  const theme = useTheme();

  const country = beans.country;
  const region = beans.region;
  const altitude = beans.altitude;
  const farmer = beans.farmer;
  const harvestDate = beans.harvestDate;
  const procezz = beans.process;
  const varietals = beans.varietals && beans.varietals.join(", ");

  const hideComponent =
    !country &&
    !region &&
    !altitude &&
    !farmer &&
    !harvestDate &&
    !procezz &&
    !varietals;

  const showDivider =
    (!!country || !!region || !!altitude || !!farmer || !!harvestDate) &&
    (procezz || varietals.length > 0);

  if (hideComponent) {
    return null;
  }

  return (
    <>
      <Typography variant="h5" gutterBottom className={commonStyles.listTitle}>
        Single-origin terroir
      </Typography>
      <Paper className={classes.root}>
        <Grid container>
          {country && (
            <Grid item xs={4}>
              <div className={classes.countryContainer}>
                <img
                  src={`${process.env.PUBLIC_URL}/images/maps/${
                    theme.isDark ? "dark" : "light"
                  }/${countriesMap[country].toLowerCase()}.svg`}
                  className={classes.countryMap}
                  alt={`${country} map outline`}
                />
                <img
                  src={`${process.env.PUBLIC_URL}/images/flags/${countriesMap[
                    country
                  ].toLowerCase()}.svg`}
                  className={classes.countryFlag}
                  alt={`${country} flag`}
                />
              </div>
            </Grid>
          )}
          <Grid item xs={8} className={classes.terroir}>
            <Typography className={classes.bold}>{country}</Typography>
            <Typography variant="body2" gutterBottom>
              {region} {altitude && <span>({altitude} masl)</span>}
            </Typography>
            {farmer && (
              <Typography variant="body2" gutterBottom>
                <span className={classes.label}>Grown by</span> {farmer}
              </Typography>
            )}
            {harvestDate && (
              <Typography variant="body2" gutterBottom>
                <span className={classes.label}>Harvested in</span>{" "}
                {renderDate(harvestDate, "MMMM yyyy")}
              </Typography>
            )}
            {showDivider && <Divider className={classes.divider} />}
            <Typography gutterBottom>
              {[procezz, varietals].filter((s) => !!s).join(" - ")}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default BeansTerroirSingleOrigin;

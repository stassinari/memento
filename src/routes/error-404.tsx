import React, { FunctionComponent } from "react";
import { Box, Typography } from "@mui/material";

import makeStyles from '@mui/styles/makeStyles';

import stain from "../static/coffee-stain.png";
import Layout from "../components/layout";

const useStyles = makeStyles(() => {
  return {
    image: {
      width: "100%",
    },
  };
});

const Error404: FunctionComponent = () => {
  const classes = useStyles();
  return (
    <Layout title="Not found">
      <Box textAlign="center" mt={8}>
        <img src={stain} alt="Coffee stain" className={classes.image} />
        <Typography variant="h1">404</Typography>
        <Typography variant="subtitle1" gutterBottom>
          The page you're looking for doesn't exist.
        </Typography>
      </Box>
    </Layout>
  );
};

export default Error404;

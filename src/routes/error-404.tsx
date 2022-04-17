import { Box, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { FunctionComponent } from "react";
import { SpiltCoffee } from "../components/icons/SpiltCoffee";
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
      <Box textAlign="center" mt={12}>
        <div
          style={{
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "48px",
          }}
        >
          <SpiltCoffee />
        </div>
        <Typography variant="h1">404</Typography>
        <Typography variant="subtitle1" gutterBottom>
          The page you're looking for doesn't exist.
        </Typography>
      </Box>
    </Layout>
  );
};

export default Error404;

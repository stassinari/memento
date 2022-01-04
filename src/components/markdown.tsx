import { Box } from "@mui/material";
import Link from "@mui/material/Link";
import { Theme } from "@mui/material/styles";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import Typography from "@mui/material/Typography";
import ReactMarkdown from "markdown-to-jsx";
import React, { FunctionComponent } from "react";

const styles = (theme: Theme) =>
  createStyles({
    listItem: {
      marginTop: theme.spacing(1),
    },
  });

const useStyles = makeStyles((theme) => ({
  root: {
    "& p:last-child": {
      marginBottom: 0,
    },
  },
}));

const options = {
  overrides: {
    h1: {
      component: Typography,
      props: {
        gutterBottom: true,
        variant: "h5",
      },
    },
    h2: { component: Typography, props: { gutterBottom: true, variant: "h6" } },
    h3: {
      component: Typography,
      props: { gutterBottom: true, variant: "subtitle1" },
    },
    h4: {
      component: Typography,
      props: { gutterBottom: true, variant: "subtitle2", paragraph: true },
    },
    p: { component: Typography, props: { paragraph: true, variant: "body2" } },
    a: { component: Link },
    li: {
      component: withStyles(styles)(({ classes, ...props }: any) => (
        <li className={classes.listItem}>
          <Typography component="span" variant="body2" {...props} />
        </li>
      )),
    },
  },
};

interface Props {
  md: string;
}

const Markdown: FunctionComponent<Props> = ({ md }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ReactMarkdown options={options} children={md} />
    </div>
  );
};

export const PoweredBy: FunctionComponent = () => (
  <Box marginBottom={2}>
    <Typography variant="caption" color="textSecondary">
      Powered by{" "}
      <Link
        href="https://www.markdownguide.org/"
        color="inherit"
        underline="always"
        target="_blank"
        rel="noreferrer noopener"
      >
        Markdown
      </Link>
    </Typography>
  </Box>
);

export default Markdown;

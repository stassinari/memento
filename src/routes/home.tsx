import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  makeStyles,
  Paper,
} from "@material-ui/core";
import ErrorIcon from "@material-ui/icons/Error";
import { format } from "date-fns";
import React, { FunctionComponent } from "react";
import { Link, useHistory } from "react-router-dom";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { SpeedDial } from "../components/fab";
import BeanBagIcon from "../components/icons/bean-bag";
import TamperIcon from "../components/icons/tamper";
import V60Icon2 from "../components/icons/v60";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import { SkeletonHomePage } from "../components/skeletons";
import { Beans } from "../database/types/beans";
import { Brew } from "../database/types/brew";
import { Espresso } from "../database/types/espresso";
import {
  buildBeansIdLabelMap,
  buildBeansLabel,
  buildBeansSecondaryLabel,
  filterBeans,
} from "../utils/beans";
import { toDate } from "../utils/dates";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(2),
    paddingBottom: 0,
  },
  seeAllLink: {
    margin: theme.spacing(2),
    marginTop: 0,
  },
  card: {
    marginBottom: theme.spacing(2),
  },
}));

interface EmptyListPlaceholderProps {
  filterLabel?: string;
  type: string;
}

const EmptyListPlaceholder: FunctionComponent<EmptyListPlaceholderProps> = ({
  type,
  filterLabel,
}) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar>
        <ErrorIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={`Your ${
        filterLabel ? filterLabel : "most recent"
      } ${type} will appear here.`}
    />
  </ListItem>
);

const Home: FunctionComponent = () => {
  const { data: userData } = useUser();
  const userId = userData?.uid;

  const history = useHistory();
  const classes = useStyles();

  const brewsQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("brews")
    .orderBy("date", "desc")
    .limit(5);
  const { status: brewsStatus, data: brews } = useFirestoreCollectionData<Brew>(
    brewsQuery,
    {
      idField: "id",
    }
  );

  const espressosQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("espresso")
    .orderBy("date", "desc")
    .limit(5);
  const { status: espressosStatus, data: espressos } =
    useFirestoreCollectionData<Espresso>(espressosQuery, {
      idField: "id",
    });

  const beansQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans")
    .orderBy("roastDate", "desc");
  const { status: beansStatus, data: beans } =
    useFirestoreCollectionData<Beans>(beansQuery, {
      idField: "id",
    });

  if (!userId) return null;

  const beansIdLabelMap = buildBeansIdLabelMap(beans);

  const title = "Home";

  if (
    brewsStatus === "loading" ||
    espressosStatus === "loading" ||
    beansStatus === "loading"
  ) {
    return (
      <>
        <PageProgress />
        <Layout title={title}>
          <SkeletonHomePage />
        </Layout>
      </>
    );
  }

  return (
    <Layout title={title}>
      {beans.length > 0 && <SpeedDial />}
      <Paper className={classes.card}>
        <List dense subheader={<ListSubheader>Latest brews</ListSubheader>}>
          {brews.length === 0 ? (
            <EmptyListPlaceholder type="brews" />
          ) : (
            brews.map((brew) => {
              const firstLine = [
                brew.method,
                brew.beans?.id && beansIdLabelMap[brew.beans?.id],
              ].join(" - ");
              let secondLine = format(toDate(brew.date), "yyyy/MM/dd @ HH:mm");
              if (brew.rating) {
                secondLine = secondLine + " - " + brew.rating + "/10 ☆";
              }
              return (
                <ListItem
                  key={brew.id}
                  button
                  onClick={() => history.push(`/brews/${brew.id}`)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <V60Icon2 />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={firstLine} secondary={secondLine} />
                </ListItem>
              );
            })
          )}
        </List>
        <Button
          className={classes.seeAllLink}
          color="primary"
          component={Link}
          to="/brews"
        >
          See recent brews
        </Button>
      </Paper>

      <Paper className={classes.card}>
        <List dense subheader={<ListSubheader>Latest espressos</ListSubheader>}>
          {espressos.length === 0 ? (
            <EmptyListPlaceholder type="espressos" />
          ) : (
            espressos.map((espresso) => {
              const firstLine = espresso.fromDecent
                ? espresso.profileName
                : espresso.beans?.id
                ? `${[
                    beansIdLabelMap[espresso.beans?.id],
                    espresso.actualWeight,
                  ].join(" - ")}g/${espresso.beansWeight}g ⇨ ${
                    espresso.actualTime
                  }s
            `
                : undefined;
              let secondLine = format(
                toDate(espresso.date),
                "yyyy/MM/dd @ HH:mm"
              );
              if (espresso.rating) {
                secondLine = secondLine + " - " + espresso.rating + "/10 ☆";
              }
              return (
                <ListItem
                  key={espresso.id}
                  button
                  onClick={() => history.push(`/espresso/${espresso.id}`)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <TamperIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={firstLine} secondary={secondLine} />
                </ListItem>
              );
            })
          )}
        </List>
        <Button
          className={classes.seeAllLink}
          color="primary"
          component={Link}
          to="/espresso"
        >
          See recent espressos
        </Button>
      </Paper>

      <Paper>
        <List dense subheader={<ListSubheader>Open beans</ListSubheader>}>
          {beans.length === 0 ? (
            <EmptyListPlaceholder type="beans" filterLabel="open bags of" />
          ) : (
            filterBeans(beans)
              .filter((b) => !b.isFinished)
              .map((bean) => (
                <ListItem
                  key={bean.id}
                  button
                  onClick={() => history.push(`/beans/${bean.id}`)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <BeanBagIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={buildBeansLabel(bean, true)}
                    secondary={buildBeansSecondaryLabel(bean)}
                  />
                </ListItem>
              ))
          )}
        </List>
        <Button
          className={classes.seeAllLink}
          color="primary"
          component={Link}
          to="/beans"
        >
          See all beans
        </Button>
      </Paper>
    </Layout>
  );
};
export default Home;

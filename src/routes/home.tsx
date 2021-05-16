import React, { FunctionComponent } from "react";
import { useHistory, Link } from "react-router-dom";
import {
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  makeStyles,
  ListSubheader,
} from "@material-ui/core";
import { format } from "date-fns";

import ErrorIcon from "@material-ui/icons/Error";

import {
  buildBeansIdLabelMap,
  buildBeansLabel,
  buildBeansSecondaryLabel,
  filterBeans,
} from "../utils/beans";
import V60Icon2 from "../components/icons/v60";
import { toDate } from "../utils/dates";
import { SpeedDial } from "../components/fab";
import TamperIcon from "../components/icons/tamper";
import BeanBagIcon from "../components/icons/bean-bag";
import Layout from "../components/layout";
import { SkeletonHomePage } from "../components/skeletons";
import PageProgress from "../components/page-progress";
import { useUser, useFirestore, useFirestoreCollectionData } from "reactfire";

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
    .collection("beans");
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
              const firstLine = `${brew.method} - ${
                beansIdLabelMap[brew.beans!.id]
              }`;
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
          See all brews
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
                : `${beansIdLabelMap[espresso.beans?.id]} - ${
                    espresso.actualWeight
                  }g/${espresso.beansWeight}g ⇨ ${espresso.actualTime}s
            `;
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
          See all espressos
        </Button>
      </Paper>

      <Paper>
        <List dense subheader={<ListSubheader>Open beans</ListSubheader>}>
          {beans.length === 0 ? (
            <EmptyListPlaceholder type="beans" filterLabel="open bags of" />
          ) : (
            filterBeans(beans).map((bean) => (
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

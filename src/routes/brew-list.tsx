import {
  Drawer,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import FilterListIcon from "@material-ui/icons/FilterList";
import { subDays, subMonths, subWeeks } from "date-fns/esm";
import firebase from "firebase/app";
import React, { FunctionComponent, useState } from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import Card, { CardRating } from "../components/card";
import { EmptyBeans, EmptyList } from "../components/empty-states";
import Fab from "../components/fab";
import FilterSort from "../components/filter-sort";
import BeanIcon from "../components/icons/bean";
import Layout from "../components/layout";
import LoadingButton from "../components/loading-button";
import PageProgress from "../components/page-progress";
import SkeletonListPage from "../components/skeletons";
import useCommonStyles from "../config/use-common-styles";
import { buildBeansIdLabelMap } from "../utils/beans";
import { keys } from "../utils/typescripts";

const FIRST_LOAD_LIMIT = 10;

const filterBrews = (
  brews: Brew[] | undefined,
  filters: Record<string, string[]>
) => {
  if (!brews) return [];
  let filteredBrews: Brew[] = brews;
  keys(filters).forEach((field) => {
    if (filters[field].length === 0) return;
    filteredBrews = filteredBrews.filter((brew: any) => {
      // hardcoded because beans is a Firestore documentSnapshot
      if (field === "beans") {
        return filters[field].includes(brew[field].id);
      }
      return filters[field].includes(brew[field]);
    });
  });
  return filteredBrews;
};

const sortBrews = (brews: Brew[] | undefined, sorting: string) => {
  if (!brews) return [];
  const [field, direction] = sorting.split("/");
  if (direction === "desc") {
    return brews.sort((a: any, b: any) =>
      a[field] > b[field] ? -1 : b[field] > a[field] ? 1 : 0
    );
  } else if (direction === "asc") {
    return brews.sort((a: any, b: any) =>
      a[field] > b[field] ? 1 : b[field] > a[field] ? -1 : 0
    );
  }
  return brews;
};

const BrewList: FunctionComponent = () => {
  const {
    data: { uid: userId },
  } = useUser();

  const commonStyles = useCommonStyles();
  const theme = useTheme();
  const isBreakpointXs = useMediaQuery(theme.breakpoints.down("xs"));

  const [limit, setLimit] = useState(FIRST_LOAD_LIMIT);
  const [loadAll, setLoadAll] = useState(false);

  const [drawerState, setDrawerState] = useState(false);

  const [sorting, setSorting] = useState<string>("date/desc");
  const [filters, setFilters] = useState<Record<string, string[]>>({
    method: [],
    beans: [],
  });

  const brewsQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("brews")
    .orderBy("date", "desc")
    .limit(limit);
  const { status: brewsStatus, data: brews } = useFirestoreCollectionData<Brew>(
    brewsQuery,
    {
      idField: "id",
    }
  );

  const beansQuery = useFirestore()
    .collection("users")
    .doc(userId)
    .collection("beans");
  const { status: beansStatus, data: beans } =
    useFirestoreCollectionData<Beans>(beansQuery, {
      idField: "id",
    });

  const filteredSortedBrews = filterBrews(sortBrews(brews, sorting), filters);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = subDays(today, 1);
  const lastWeek = subWeeks(today, 1);
  const lastMonth = subMonths(today, 1);

  const todaysBrews = filteredSortedBrews.filter(
    (brew) =>
      (brew.date as firebase.firestore.Timestamp).toMillis() > today.getTime()
  );

  const yesterdaysBrews = filteredSortedBrews.filter(
    (brew) =>
      (brew.date as firebase.firestore.Timestamp).toMillis() >
        yesterday.getTime() &&
      (brew.date as firebase.firestore.Timestamp).toMillis() < today.getTime()
  );

  const lastWeeksBrews = filteredSortedBrews.filter(
    (brew) =>
      (brew.date as firebase.firestore.Timestamp).toMillis() >
        lastWeek.getTime() &&
      (brew.date as firebase.firestore.Timestamp).toMillis() <
        yesterday.getTime()
  );

  const lastMonthsBrews = filteredSortedBrews.filter(
    (brew) =>
      (brew.date as firebase.firestore.Timestamp).toMillis() >
        lastMonth.getTime() &&
      (brew.date as firebase.firestore.Timestamp).toMillis() <
        lastWeek.getTime()
  );

  const allLists = [
    {
      title: "Today",
      brews: todaysBrews,
    },
    {
      title: "Yesterday",
      brews: yesterdaysBrews,
    },
    {
      title: "Last week",
      brews: lastWeeksBrews,
    },
    {
      title: "Last month",
      brews: lastMonthsBrews,
    },
  ];

  const beansIdLabelMap = buildBeansIdLabelMap(beans);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      )
        return;

      setDrawerState(open);
    };

  const title = "Brews";

  if ((brewsStatus === "loading" && !loadAll) || beansStatus === "loading") {
    return (
      <>
        <PageProgress />
        <Layout title={title} maxWidth="md">
          <SkeletonListPage sidebar={true} />
        </Layout>
      </>
    );
  }

  const FilterSidebar = () => (
    <FilterSort
      brews={brews}
      beans={beans}
      sorting={sorting}
      setSorting={setSorting}
      filters={filters}
      setFilters={setFilters}
    />
  );

  return (
    <Layout title={title} maxWidth="md">
      <Fab
        disabled={beans.length === 0}
        link="/brews/add/step0"
        label="Add brew"
      />
      {isBreakpointXs && (
        <div className={commonStyles.actionsButton}>
          <IconButton
            color="inherit"
            disabled={brews.length === 0}
            onClick={toggleDrawer(true)}
          >
            <FilterListIcon />
          </IconButton>
        </div>
      )}
      {beans.length === 0 ? (
        <EmptyBeans type="brews" />
      ) : brews.length === 0 ? (
        <EmptyList type="brews" />
      ) : (
        <Grid container spacing={4}>
          {!isBreakpointXs && (
            <Grid item sm={4}>
              <FilterSidebar />
            </Grid>
          )}
          <Grid item xs={12} sm={8}>
            {allLists.map(
              (list) =>
                list.brews.length > 0 && (
                  <div key={list.title}>
                    <Typography
                      variant="h5"
                      gutterBottom
                      className={commonStyles.listTitle}
                    >
                      {list.title}
                    </Typography>

                    <Grid container direction={"column"} spacing={2}>
                      {list.brews.map((brew) => (
                        <Grid item key={brew.id}>
                          <Card
                            title={brew.method}
                            link={`/brews/${brew.id}`}
                            aside={
                              brew.rating && (
                                <CardRating
                                  variant={
                                    brew.rating >= 6 ? "primary" : "secondary"
                                  }
                                >
                                  {brew.rating}
                                </CardRating>
                              )
                            }
                            secondLine={
                              brew.beans && beansIdLabelMap[brew.beans.id]
                            }
                            SecondLineIcon={BeanIcon}
                            date={brew.date}
                            datePrefix="Brewed on"
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                )
            )}
            {(!loadAll || brewsStatus === "loading") &&
              brews.length >= FIRST_LOAD_LIMIT && (
                <LoadingButton
                  type="brews"
                  isLoading={brewsStatus === "loading"}
                  handleClick={() => {
                    setLoadAll(true);
                    setLimit(10000);
                  }}
                />
              )}
          </Grid>
        </Grid>
      )}
      {isBreakpointXs && (
        <Drawer anchor="right" open={drawerState} onClose={toggleDrawer(false)}>
          <FilterSidebar />
        </Drawer>
      )}
    </Layout>
  );
};

export default BrewList;

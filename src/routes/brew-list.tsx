import { Drawer, Grid, IconButton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import React, { FunctionComponent, useState } from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import BrewCard from "../components/brew/brew-card";
import { EmptyBeans, EmptyList } from "../components/empty-states";
import Fab from "../components/fab";
import FilterSort from "../components/filter-sort";
import Layout from "../components/layout";
import PageProgress from "../components/page-progress";
import SkeletonListPage from "../components/skeletons";
import useCommonStyles from "../config/use-common-styles";
import { Beans } from "../database/types/beans";
import { Brew } from "../database/types/brew";
import { buildBeansIdLabelMap } from "../utils/beans";
import { keys } from "../utils/typescripts";

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
  const isBreakpointXs = useMediaQuery(theme.breakpoints.down('sm'));

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
    .orderBy("date", "desc");
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

  if (brewsStatus === "loading" || beansStatus === "loading") {
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
            size="large">
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
            <Grid container spacing={2}>
              {filteredSortedBrews.map((brew) => (
                <Grid item xs={12} key={brew.id}>
                  <BrewCard
                    brew={brew}
                    beansLabel={
                      (brew.beans &&
                        brew.beans.id &&
                        beansIdLabelMap[brew.beans.id]) ||
                      undefined
                    }
                  />
                </Grid>
              ))}
            </Grid>
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

import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequireNoAuth } from "./components/auth/RequireNoAuth";
import { Layout } from "./components/Layout";
import { NotificationContainer } from "./components/NotificationContainer";
import { useInitUser } from "./hooks/useInitUser";
import { BeansClone } from "./pages/beans/BeansClone";
import { BeansEdit } from "./pages/beans/BeansEdit";
import { BrewClone } from "./pages/brews/BrewClone";
import { BrewEditDetails } from "./pages/brews/BrewEditDetails";
import { BrewEditOutcome } from "./pages/brews/BrewEditOutcome";
// import { BeansAdd } from "./pages/BeansAdd";
// import { BeansDetails } from "./pages/BeansDetails";
// import { BeansList } from "./pages/BeansList";
import { BrewsList } from "./pages/brews/BrewsList";
import { DesignLibrary } from "./pages/DesignLibrary";
import { DrinksPage } from "./pages/DrinksPage";
import { DecentEspressoAddDetails } from "./pages/espresso/DecentEspressoAddDetails";
import { DecentEspressoEditDetails } from "./pages/espresso/DecentEspressoEditDetails";
import { EspressoClone } from "./pages/espresso/EspressoClone";
import { EspressoEditDetails } from "./pages/espresso/EspressoEditDetails";
import { EspressoEditOutcome } from "./pages/espresso/EspressoEditOutcome";
// import { LogIn } from "./pages/LogIn";
import { BrewsTableWrapper } from "./pages/brews/BrewsTable";
import { DecentUpload } from "./pages/DecentUpload";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Settings } from "./pages/Settings";
import { TastingsPage } from "./pages/TastingsPage";

const BeansAdd = React.lazy(async () => await import("./pages/beans/BeansAdd"));
const BeansDetails = React.lazy(
  async () => await import("./pages/beans/BeansDetails")
);
const BeansList = React.lazy(
  async () => await import("./pages/beans/BeansList/BeansList")
);

const BrewsAdd = React.lazy(async () => await import("./pages/brews/BrewsAdd"));
const BrewDetails = React.lazy(
  async () => await import("./pages/brews/BrewDetails")
);

const EspressoList = React.lazy(
  async () => await import("./pages/espresso/EspressoList")
);
const EspressoDetails = React.lazy(
  async () => await import("./pages/espresso/EspressoDetails")
);
const EspressoAdd = React.lazy(
  async () => await import("./pages/espresso/EspressoAdd")
);

const LogIn = React.lazy(async () => await import("./pages/LogIn"));

export const App = () => {
  const isUserLoading = useInitUser();

  if (isUserLoading) return null;

  return (
    <Suspense fallback={<div>Initializing...</div>}>
      <NotificationContainer />
      <BrowserRouter>
        <Routes>
          {/* Add routes that display no matter the auth status */}
          <Route path="*" element={<NotFound />} />

          {/* Add routes that require the user NOT to be logged in */}
          <Route element={<RequireNoAuth />}>
            <Route path="login" element={<LogIn />} />
          </Route>

          {/* Add routes that REQUIRE the user to be logged in */}
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />

              {/* Beans */}
              <Route path="beans" element={<BeansList />} />
              <Route path="beans/add" element={<BeansAdd />} />
              <Route path="beans/:beansId" element={<BeansDetails />} />
              <Route path="beans/:beansId/edit" element={<BeansEdit />} />
              <Route path="beans/:beansId/clone" element={<BeansClone />} />

              <Route path="drinks" element={<DrinksPage />} />

              {/* Brews */}
              <Route path="drinks/brews" element={<BrewsList />} />
              <Route path="drinks/brews/add" element={<BrewsAdd />} />
              <Route path="drinks/brews/:brewId" element={<BrewDetails />} />
              <Route
                path="drinks/brews/:brewId/edit"
                element={<BrewEditDetails />}
              />
              <Route
                path="drinks/brews/:brewId/outcome"
                element={<BrewEditOutcome />}
              />
              <Route
                path="drinks/brews/:brewId/clone"
                element={<BrewClone />}
              />

              {/* Espresso */}

              <Route path="drinks/espresso" element={<EspressoList />} />
              <Route
                path="drinks/espresso/:espressoId"
                element={<EspressoDetails />}
              />
              <Route path="drinks/espresso/add" element={<EspressoAdd />} />
              <Route
                path="drinks/espresso/:espressoId/edit"
                element={<EspressoEditDetails />}
              />
              <Route
                path="drinks/espresso/:espressoId/decent/add"
                element={<DecentEspressoAddDetails />}
              />
              <Route
                path="drinks/espresso/:espressoId/decent/edit"
                element={<DecentEspressoEditDetails />}
              />
              <Route
                path="drinks/espresso/:espressoId/outcome"
                element={<EspressoEditOutcome />}
              />
              <Route
                path="drinks/espresso/:espressoId/clone"
                element={<EspressoClone />}
              />

              <Route path="decent-upload" element={<DecentUpload />} />

              <Route path="drinks/tastings" element={<TastingsPage />} />

              <Route path="settings" element={<Settings />} />

              <Route path="design-library" element={<DesignLibrary />} />
            </Route>
            <Route element={<Layout fullWidth />}>
              <Route
                path="drinks/brews/table"
                element={<BrewsTableWrapper />}
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

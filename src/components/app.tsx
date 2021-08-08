import { ThemeProvider, useMediaQuery } from "@material-ui/core";
import React, { createContext, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { FirebaseAppProvider } from "reactfire";
import config from "../config/firebase-config";
import buildTheme, { ThemePreference } from "../config/mui-theme";
import Account from "../routes/account";
import BeansAdd from "../routes/beans-add";
import BeansDetails from "../routes/beans-details";
import BeansList from "../routes/beans-list";
import BeansUpdate from "../routes/beans-update";
import BrewAdd from "../routes/brew-add";
import BrewDetails from "../routes/brew-details";
import BrewList from "../routes/brew-list";
import BrewOutcome from "../routes/brew-outcome";
import BrewRecent from "../routes/brew-recent";
import BrewUpdate from "../routes/brew-update";
import Error404 from "../routes/error-404";
import EspressoAdd from "../routes/espresso-add";
import EspressoDecentAdd from "../routes/espresso-decent";
import EspressoDecentUpload from "../routes/espresso-decent-upload";
import EspressoDetails from "../routes/espresso-details";
import EspressoList from "../routes/espresso-list";
import EspressoOutcome from "../routes/espresso-outcome";
import EspressoUpdate from "../routes/espresso-update";
import Home from "../routes/home";
import Login from "../routes/login";
import ResetPassword from "../routes/reset-password";
import SignUp from "../routes/sign-up";
import TastingAdd from "../routes/tasting-add";
import TastingList from "../routes/tasting-list";
import TastingNotes from "../routes/tasting-notes";
import TastingPrep from "../routes/tasting-prep";
import TastingRatings from "../routes/tasting-ratings";
import PrivateRoute from "./auth/private-route";
import PublicRoute from "./auth/public-routes";

interface ThemeContextProps {
  themePref: ThemePreference;
  setThemePref: React.Dispatch<React.SetStateAction<ThemePreference>>;
}

export const ThemeContext = createContext<Partial<ThemeContextProps>>({});

const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const localTheme = localStorage.getItem("theme");
  const defaultTheme =
    localTheme && ["light", "dark", "auto"].includes(localTheme)
      ? (localTheme as ThemePreference)
      : "auto";
  const [themePref, setThemePref] = useState<ThemePreference>(defaultTheme);
  const themeForMui =
    themePref === "auto" ? (prefersDarkMode ? "dark" : "light") : themePref;

  return (
    <FirebaseAppProvider firebaseConfig={config}>
      <ThemeContext.Provider value={{ themePref, setThemePref }}>
        <ThemeProvider theme={buildTheme(themeForMui)}>
          <BrowserRouter>
            <Switch>
              {/* ACCOUNT */}
              <PrivateRoute path="/account" page={Account} />
              <PublicRoute path="/login" page={Login} />
              <PublicRoute path="/sign-up" page={SignUp} />
              <PrivateRoute
                path="/guest-sign-up"
                page={SignUp}
                pageProps={{ isGuest: true }}
              />
              <PublicRoute path="/reset-password" page={ResetPassword} />
              {/* BREWS */}
              <PrivateRoute path="/brews/add" page={BrewAdd} />
              <PrivateRoute path="/brews/all" page={BrewList} />
              <PrivateRoute
                path="/brews/:id/clone"
                page={BrewUpdate}
                pageProps={{ clone: true }}
              />
              <PrivateRoute exact path="/brews/:id" page={BrewDetails} />
              <PrivateRoute
                exact
                path="/brews/:id/outcome"
                page={BrewOutcome}
              />
              <PrivateRoute
                path="/brews/:id/edit"
                page={BrewUpdate}
                pageProps={{ update: true }}
              />
              <PrivateRoute exact path="/brews" page={BrewRecent} />
              {/* EPSRESSO */}
              <PrivateRoute exact path="/espresso" page={EspressoList} />
              <PrivateRoute exact path="/espresso/:id" page={EspressoDetails} />
              <PrivateRoute
                exact
                path="/espresso/:id/outcome"
                page={EspressoOutcome}
              />
              <PrivateRoute
                path="/espresso/:id/clone"
                page={EspressoUpdate}
                pageProps={{ clone: true }}
              />
              <PrivateRoute
                path="/espresso/:id/edit"
                page={EspressoUpdate}
                pageProps={{ update: true }}
              />
              <PrivateRoute path="/espresso/add" page={EspressoAdd} />
              <PrivateRoute
                exact
                path="/espresso/:id/decent"
                page={EspressoDecentAdd}
              />
              <PrivateRoute
                exact
                path="/decent-upload"
                page={EspressoDecentUpload}
              />
              <PrivateRoute
                path="/espresso/:id/decent/edit"
                page={EspressoDecentAdd}
                pageProps={{ update: true }}
              />
              {/* BEANS */}
              <PrivateRoute exact path="/beans" page={BeansList} />
              <PrivateRoute exact path="/beans/add" page={BeansAdd} />
              <PrivateRoute
                exact
                path="/beans/:id/clone"
                page={BeansUpdate}
                pageProps={{ clone: true }}
              />
              <PrivateRoute exact path="/beans/:id" page={BeansDetails} />
              <PrivateRoute
                exact
                path="/beans/:id/edit"
                page={BeansUpdate}
                pageProps={{ update: true }}
              />
              <PrivateRoute exact path="/" page={Home} />
              {/* TASTINGS */}
              <PrivateRoute exact path="/tastings" page={TastingList} />
              <PrivateRoute path="/tastings/add" page={TastingAdd} />
              <PrivateRoute
                exact
                path="/tastings/:id/prep"
                page={TastingPrep}
              />
              <PrivateRoute
                path="/tastings/:id/ratings"
                page={TastingRatings}
              />
              {/* EXPERIMENTS */}
              <PrivateRoute exact path="/tasting-notes" page={TastingNotes} />
              {/* 404 */}
              <Route exact path="/404">
                <Error404 />
              </Route>
              <Route>
                <Error404 />
              </Route>
            </Switch>
          </BrowserRouter>
        </ThemeProvider>
      </ThemeContext.Provider>
    </FirebaseAppProvider>
  );
};

export default App;

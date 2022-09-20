import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./components/auth/RequireAuth";
import { RequireNoAuth } from "./components/auth/RequireNoAuth";
import { Layout } from "./components/Layout";
import { useInitUser } from "./hooks/useInitUser";
import { BeansClone } from "./pages/BeansClone";
import { BeansEdit } from "./pages/BeansEdit";
// import { BeansAdd } from "./pages/BeansAdd";
// import { BeansDetails } from "./pages/BeansDetails";
// import { BeansList } from "./pages/BeansList";
import { BrewsPage } from "./pages/BrewsPage";
import { DesignLibrary } from "./pages/DesignLibrary";
import { DrinksPage } from "./pages/DrinksPage";
import { EspressosPage } from "./pages/EspressosPage";
// import { LogIn } from "./pages/LogIn";
import { NotFound } from "./pages/NotFound";
import { Profile } from "./pages/Profile";
import { TastingsPage } from "./pages/TastingsPage";

const BeansAdd = React.lazy(() => import("./pages/BeansAdd/BeansAdd"));
const BeansDetails = React.lazy(() => import("./pages/BeansDetails"));
const BeansList = React.lazy(() => import("./pages/BeansList/BeansList"));
const LogIn = React.lazy(() => import("./pages/LogIn"));

const queryClient = new QueryClient();

export const App = () => {
  const isUserLoading = useInitUser();
  if (isUserLoading) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div>Initializing...</div>}>
        <BrowserRouter>
          <Routes>
            {/* Add routes that display no matter the auth status */}
            <Route path="*" element={<NotFound />} />

            {/* Add routes that require the user NOT to be logged in */}
            <Route element={<RequireNoAuth />}>
              <Route path="login" element={<LogIn />} />
            </Route>

            {/* Add routes that REQUIRE the user to be logged in */}
            <Route path="/" element={<Layout />}>
              <Route element={<RequireAuth />}>
                <Route path="/" element={<Homepage />} />
                <Route path="beans" element={<BeansList />} />
                <Route path="beans/add" element={<BeansAdd />} />
                <Route path="beans/:beansId" element={<BeansDetails />} />
                <Route path="beans/:beansId/edit" element={<BeansEdit />} />
                <Route path="beans/:beansId/clone" element={<BeansClone />} />

                <Route path="drinks" element={<DrinksPage />} />
                <Route path="drinks/brews" element={<BrewsPage />} />
                <Route path="drinks/espressos" element={<EspressosPage />} />
                <Route path="drinks/tastings" element={<TastingsPage />} />

                <Route path="profile" element={<Profile />} />

                <Route path="design-library" element={<DesignLibrary />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </QueryClientProvider>
  );
};

const Homepage = () => <div>Dis da homepage, brah</div>;

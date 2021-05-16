import React, { FunctionComponent } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import useAuth from "../../utils/useAuth";

interface Props extends RouteProps {
  page: React.ElementType;
  pageProps?: Record<string, any>;
}

const PublicRoute: FunctionComponent<Props> = ({ page: Page, ...rest }) => {
  const auth = useAuth();

  if (!auth.initializing) {
    if (auth.authenticated) {
      return <Redirect to="/" />;
    } else {
      return <Route {...rest} render={(props) => <Page {...props} />} />;
    }
  } else {
    return null;
  }
};

export default PublicRoute;

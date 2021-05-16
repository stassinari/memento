import React, { FunctionComponent } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";

import useAuth from "../../utils/useAuth";

interface Props extends RouteProps {
  page: React.ElementType;
  pageProps?: Record<string, any>;
}

const PrivateRoute: FunctionComponent<Props> = ({
  page: Page,
  pageProps,
  ...rest
}) => {
  const auth = useAuth();

  if (!auth.initializing) {
    if (auth.authenticated) {
      return (
        <Route
          {...rest}
          render={({ staticContext, ...props }) => (
            <Page {...props} {...pageProps} />
          )}
        />
      );
    } else {
      return <Redirect to="/login" />;
    }
  } else {
    return null;
  }
};

export default PrivateRoute;

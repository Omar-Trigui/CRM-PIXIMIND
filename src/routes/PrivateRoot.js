import React from "react";
import { Route, Redirect } from "react-router-dom";

function PrivateRoute({
  component: Component,
  Authentification,
  hello,
  scopes,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) => {
        // 1- Redirect to login if not logged in
        if (!Authentification.isAuthenticated()) {
          return Authentification.login();
        }
        // 2- Verify if user has group
        if (!Authentification.hasGroup()) {
          return <Redirect to="/addGroup" />;
        }

        // 3-Render Components
        return <Component Authentification={Authentification} {...props} />;
      }}
    />
  );
}

export default PrivateRoute;

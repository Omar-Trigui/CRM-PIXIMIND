import React from "react";
import { Route } from "react-router-dom";

function RestrictedRoot({
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
        // 2-Render Components
        return <Component Authentification={Authentification} {...props} />;
      }}
    />
  );
}

export default RestrictedRoot;

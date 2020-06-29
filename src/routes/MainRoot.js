import React, { Component } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import PrivateRoot from "./PrivateRoot";
import RestrictedRoot from "./RestrictedRoot";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/login/Login";
import Dashboard from "../pages/Dashboard";
import Register from "../pages/Register/register";
import Auth from "../services/Auth";
import addGroup from "../pages/addGroup";
import CallBack from "../pages/Callback/Callback";
import Profile from "../pages/Dashboard/profile"
import InviteUser from "../pages/inviteUser";
import Group from "../pages/Dashboard/Group";
import history from "../services/history";
import Pipeline from '../UIKIT/pipeLine/Pipeline'
export default class MainRoot extends Component {
  constructor(props) {
    super(props);
    this.Authentification = new Auth(history);
  }
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/test" component={Pipeline} />
          <Route
            exact
            path="/login"
            render={(props) => (
              <Login Authentification={this.Authentification} {...props} />
            )}
          />
          <Route
            path="/acceptInvitation/:email/:group_id"
            render={(props) => (
              <InviteUser Authentification={this.Authentification} {...props} />
            )}
          />
          <Route
            exact
            path="/callback"
            render={(props) => (
              <CallBack Authentification={this.Authentification} {...props} />
            )}
          />
          <Route
            exact
            path="/register"
            render={(props) => (
              <Register Authentification={this.Authentification} {...props} />
            )}
          />
          <PrivateRoot
            path="/dashboard"
            component={Dashboard}
            Authentification={this.Authentification}
          />
          <PrivateRoot
            path="/profile"
            component={Profile}
            Authentification={this.Authentification}
          />
          <PrivateRoot
            path="/settings"
            component={Group}
            Authentification={this.Authentification}
          />
          <RestrictedRoot
            path="/addGroup"
            component={addGroup}
            Authentification={this.Authentification}
          />
        </Switch>
      </Router>
    );
  }
}

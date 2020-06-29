import React, { Component } from "react";

export default class LandingPage extends Component {
  componentDidMount() {
    this.props.history.push("/login");
  }

  render() {
    return <div>LandingPage</div>;
  }
}


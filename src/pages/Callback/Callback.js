import React, { Component } from "react";
import loading from "./loading.svg";
import queryString from "query-string";
import jwtDecode from "jwt-decode";
import { connect } from "react-redux";
class Callback extends Component {
  componentDidMount() {
    var query = queryString.parse(this.props.location.search);
    if (query.token) {
      let token = query.token;
      let userInfo = jwtDecode(query.token);
      if (userInfo.status === 200) {
        const userId = userInfo._id;
        const {
          expiresAt,
          email,
          role,
          profileImage,
          name,
          group,
          birthDate,
          phoneNumber,
        } = userInfo;
        let user = {
          userId,
          email,
          name,
          role,
          profileImage,
          birthDate,
          phoneNumber,
        };
        setTimeout(
          () => {
            let action1 = {
              type: "SET_AUTH",
              data: user,
            };
            this.props.dispatch(action1);
            let action2 = {
              type: "SET_GROUP",
              data: group,
            };
            this.props.dispatch(action2);
            this.props.Authentification.handelAuthentication({
              expiresAt,
              token,
              group,
            });
          },

          5000
        );
      } else {
        this.setState({ errorMsg: "User Not found!" });
      }
    }
  }
  render() {
    const style = {
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "white",
    };

    return (
      <div style={style}>
        <img src={loading} alt="loading" />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    Auth: state.Auth,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => {
      dispatch(action);
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Callback);

import React, { Component } from "react";
import "antd/dist/antd.css";
import logincss from "./login.module.css";
import loginImg from "./google.svg";
import { Link } from "react-router-dom";
import { Row, Col, Card, Form, Input, Button } from "antd";
import { connect } from "react-redux";
import axios from "axios"; 
import ReactTypingEffectDemo from "./ReactTypingEffectDemo";
const _accessToken = localStorage.getItem("access_token");

class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMsg: "",
    };
  }
  componentDidMount() {
    if (_accessToken) {
      this.props.history.push("/dashboard");
    }
    let action = {
      type: "USER_LOGOUT",
      data: undefined,
    };
    this.props.dispatch(action);
  }
  handelGoogleAuth = () => {
    this.props.Authentification.logout();
    window.location = `${process.env.REACT_APP_BACKEND_URL}/auth/google`;
  };

  handleSubmit = () => {
    //this.props.Authentification.logout();
    const data = {
      email: this.state.email,
      password: this.state.password,
    };
    const url = `${process.env.REACT_APP_BACKEND_URL}/auth/login`;
    return axios
      .post(url, data)
      .then((response) => {
        const {
          userId,
          expiresAt,
          email,
          token,
          role,
          profileImage,
          name,
          group,
          birthDate,
          phoneNumber,
        } = response.data;

        let user = {
          userId,
          email,
          name,
          role,
          profileImage,
          birthDate,
          phoneNumber,
        };

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
      })
      .catch((err) => {
        console.log(err.response.data);

        this.setState({ errorMsg: err.response.data });
      });
  };

  render() {
    return (
      <Row>
        <Col
          xs={0}
          sm={0}
          md={8}
          lg={8}
          xl={8}
          style={{ height: "100vh" }}
          className={logincss.left}></Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Card className={logincss.cardRegister}>
            <h1 className={logincss.title}>Log in</h1>
            <div className={logincss.divLogin}>
              <Form className="login-form">
                <label className={logincss.labelForm}>Email</label>
                <Form.Item>
                  <Input
                    type="email"
                    placeholder="email"
                    onChange={(event) => {
                      this.setState({ email: event.target.value });
                    }}
                  />
                </Form.Item>

                <label className={logincss.labelForm}>Password</label>
                <Form.Item>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    onChange={(event) => {
                      this.setState({ password: event.target.value });
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    onClick={() => this.handleSubmit()}
                    type="primary"
                    htmlType="submit"
                    className={logincss.loginFormButton}>
                    <span style={{ fontSize: 16, fontWeight: 600 }}>
                      Log In
                    </span>
                  </Button>
                </Form.Item>

                <p style={{ color: "red" }} className={logincss.signupTxt}>
                  {this.state.errorMsg}
                </p>
                <p
                  className={logincss.signupTxtTypingEffect}
                  style={{ fontWeight: 600 }}>
                  <ReactTypingEffectDemo />
                </p>

                <Button
                  className={logincss.shadow}
                  onClick={() => this.handelGoogleAuth()}>
                  <img
                    src={loginImg}
                    className={logincss.googleImg}
                    alt="wallpaper"></img>
                  <span style={{ paddingLeft: 10 }}>Log in with Google </span>
                </Button>

                <br />
                <br />
                <p className={logincss.signupTxt}>
                  Don't have an account ?
                  <Link to="/register" className={logincss.link}>
                    {" "}
                    Sign up
                  </Link>
                </p>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>
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
export default connect(mapStateToProps, mapDispatchToProps)(login);

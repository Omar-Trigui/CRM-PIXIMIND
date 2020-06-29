import React, { Component } from "react";
import registercss from "./register.module.css";
import { Tooltip, Row, Col, Card, Form, Input, Button } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
const _accessToken = localStorage.getItem("access_token");
class Register extends Component {
  state = {
    full_name: "",
    email: "",
    password: "",
    validatePasswordStatus: "",
    validateFullNameStatus: "",
    error: "",
    full_name1Color: "#5A6351",
  };
  componentDidMount() {
    if (_accessToken) {
      this.props.history.push("/dashboard");
    }
  }
  handleSubmit = () => {
    const user = {
      name: this.state.full_name,
      email: this.state.email,
      password: this.state.password,
    };
    console.log(user);

    const url = `${process.env.REACT_APP_BACKEND_URL}/auth/register`;
    return axios
      .post(url, user)
      .then((response) => {
        this.props.Authentification.login();
      })
      .catch((err) => {
        if (err.response.status == 405) {
          this.setState({ errorMsg: "email already exists" });
        } else {
          this.setState({
            errorMsg: "something went wrong, please verify your credentials ",
          });
        }
      });
  };

  // handelChangeFullName(event) {
  //   let FullName = event.target.value;
  //   if (FullName.length >= 6) {
  //     this.setState({
  //       validateFullNameStatus: "success",
  //       full_name1Color: "#66CD00",
  //     });
  //   } else {
  //     this.setState({ validateFullNameStatus: "error" });
  //   }
  // }
  // handelChangePassword(event) {
  //   let password = event.target.value;
  //   if (
  //     this.hasUperCase(password) &&
  //     !this.hasSpecialCaracter(password) &&
  //     this.hasNumber(password) &&
  //     this.hasLowerCase(password) &&
  //     password.length >= 6
  //   ) {
  //     this.setState({ validatePasswordStatus: "success" });
  //   } else {
  //     this.setState({ validatePasswordStatus: "error" });
  //   }
  // }
  // hasUperCase(str) {
  //   return /[A-Z]/.test(str);
  // }
  // hasLowerCase(str) {
  //   return /[a-z]/.test(str);
  // }
  // hasSpecialCaracter(str) {
  //   return /[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]/.test(str);
  // }
  // hasNumber(str) {
  //   return /[0-9]/.test(str);
  // }
  // Passwordcontent = (
  //   <div style={{ fontSize: 12 }}>
  //     <h4 style={{ color: "black" }}>Password guidance </h4>
  //     <p>Numbers</p>

  //     <p>Lower Caracter</p>
  //     <p>Uper case</p>
  //     <p>Min 8 Caracter</p>
  //   </div>
  // );

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
          className={registercss.left}></Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Card className={registercss.cardRegister}>
            <h1 className={registercss.title}>Sign up</h1>
            <div className={registercss.divLogin}>
              <Form className="login-form" layout="vertical">
                {/* <Form.Item validateStatus={this.state.validateFullNameStatus}>
                  <InputText
                    label="Name"
                    placeholder="Full name"
                    validate={this.state.validateFullNameStatus}
                    onChange={(event) => {
                      this.handelChangeFullName(event);
                      this.setState({ full_name: event.target.value });
                    }}
                  />
                </Form.Item> */}
                {/* <Form.Item>
                  <InputText
                    label="Email"
                    type="Email"
                    placeholder="Add your Email"
                    onChange={(event) => {
                      this.setState({ email: event.target.value });
                    }}
                  />
                </Form.Item> */}
                <Form.Item
                  name="nickname"
                  label={
                    <span>
                      Nickname&nbsp;
                      <Tooltip title="What do you want others to call you?">
                        <QuestionCircleOutlined />
                      </Tooltip>
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please input your nickname!",
                      whitespace: true,
                      min: 6,
                    },
                  ]}>
                  <Input
                    onChange={(event) => {
                      this.setState({ full_name: event.target.value });
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "The input is not valid E-mail!",
                    },
                  ]}>
                  <Input
                    onChange={(event) => {
                      this.setState({ email: event.target.value });
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                    {
                      pattern:
                        "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d^a-zA-Z0-9].{5,50}$",
                      message:
                        "Minimum eight characters, at least one letter, one number !",
                    },
                  ]}
                  hasFeedback>
                  <Input.Password
                    onChange={(event) => {
                      this.setState({ password: event.target.value });
                    }}
                  />
                </Form.Item>
                {/* <Popover
                  placement="leftTop"
                  content={this.Passwordcontent}
                  trigger="click">
                  <Form.Item validateStatus={this.state.validatePasswordStatus}>
                    <UIKIT_INPUT_PASSWORD
                      label="Password"
                      placeholder="Password"
                      validate={this.state.validatePasswordStatus}
                      onChange={(event) => {
                        this.handelChangePassword(event);
                        this.setState({ password: event.target.value });
                      }}
                    />
                  </Form.Item>
                </Popover> */}

                {/* <p style={{ color: "red" }}>{this.state.errorMsg}</p> */}
                <Form.Item>
                  {/* <UIKITBUTTON
                    text={"Sign up"}
                    disabledbtn={
                      !(
                        this.state.validatePasswordStatus === "success" &&
                        this.state.validateFullNameStatus === "success"
                      )
                    }
                    action={() => this.handleSubmit()}
                  /> */}
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      onClick={() => this.handleSubmit()}>
                      Sign up
                    </Button>
                  </Form.Item>
                  <p style={{ color: "#808080", paddingTop: "10px" }}>
                    Already a member ?{" "}
                    <Link
                      to="/login"
                      style={{ color: "#27AAD8", fontWeight: "bold" }}>
                      Log in
                    </Link>
                  </p>
                </Form.Item>
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
    auth: state.auth,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => {
      dispatch(action);
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);

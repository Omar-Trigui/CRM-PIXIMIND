//@flow
import React, { Component } from "react";
import { Row, Col, Card, Form, Input, Typography, Button } from "antd";
import inviteUsercss from "./inviteUser.module.css";
import Invite from "../../assets/images/invite";
import InputText from "../../UIKIT/InputText";
import axios from "axios";
import { connect } from "react-redux";
const { Text } = Typography;
const _accessToken = localStorage.getItem("access_token");
class index extends Component {
  state = {
    password: "",
    full_name: "",
  };
  componentDidMount() {
    if (_accessToken) {
      document.getElementById("root").innerHTML =
        "please logout from your Account ..";
    }
  }
  handleSubmit = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/group/acceptInvitation`;
    const data = {
      email: this.props.match.params.email,
      group_id: this.props.match.params.group_id,
      password: this.state.password,
      full_name: this.state.full_name,
    };

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
        console.log(err.message);
      });
  };
  render() {
    return (
      <Row style={{ overflow: "hidden" }}>
        <Col xs={0} sm={0} md={8} lg={8} xl={8} style={{ height: "100vh" }}>
          <Invite />
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={16}>
          <Card className={inviteUsercss.cardRegister}>
            <h1 className={inviteUsercss.title}>Complete your credential</h1>
            <div className={inviteUsercss.divLogin}>
              <Form>
                <Text className={inviteUsercss.labelForm}>Full Name : </Text>
                <Form.Item
                  name="Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your name!",
                    },
                  ]}
                  hasFeedback>
                  <InputText
                    onChange={(event) => {
                      this.setState({ full_name: event.target.value });
                    }}
                  />
                </Form.Item>
                <Text className={inviteUsercss.labelForm}>Password : </Text>
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                  hasFeedback>
                  <Input.Password />
                </Form.Item>
                <Text className={inviteUsercss.labelForm}>
                  Confirm your Password :{" "}
                </Text>
                <Form.Item
                  name="confirm"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }

                        return Promise.reject(
                          "The two passwords that you entered do not match!"
                        );
                      },
                    }),
                  ]}>
                  <Input.Password
                    onChange={(event) => {
                      this.setState({
                        password: event.target.value,
                      });
                    }}
                  />
                </Form.Item>
                <Row gutter={16}>
                  <Col span={24}>
                    <Button type="primary" block onClick={this.handleSubmit}>
                      Proceed Registration
                    </Button>
                  </Col>
                </Row>
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
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch: (action) => {
      dispatch(action);
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(index);

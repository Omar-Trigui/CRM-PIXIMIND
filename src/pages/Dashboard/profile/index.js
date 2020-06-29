import React, { Component } from "react";
import { connect } from "react-redux";
import NavBar from "../NavBar";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  Divider,
  Upload,
  Form,
  Input,
  Space,
  Layout,
  Breadcrumb,
  DatePicker,
  message,
} from "antd";
import {
  LockOutlined,
  PaperClipOutlined,
  UserOutlined,
  UploadOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons";

import moment from "moment";
const { Content } = Layout;
const _accessToken = localStorage.getItem("access_token");
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
const success = () => {
  message.success("your profile was updated succesffuly");
};

const error = () => {
  message.error("There was an error ");
};
class index extends Component {
  state = {
    imageUrl: this.props.user.profileImage,
    image: this.props.user.profileImage,
    name: this.props.user.name,
    email: this.props.user.email,
    number: this.props.user.phoneNumber,
    birthDate: this.props.user.birthDate,
    password: null,
  };

  handleChange = (info) => {
    if (info.file.status === "done") {
      this.setState({ image: info.file.originFileObj });
      getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl: imageUrl,
        })
      );
    }
  };

  onChange = (date, dateString) => {
    this.setState({ birthDate: dateString });
  };
  handleSubmit = () => {
    const data = new FormData();

    data.append("name", this.state.name);
    data.append("email", this.state.email);

    if (this.state.image !== this.props.user.profileImage) {
      data.append("myFile", this.state.image);
    }

    data.append("birthDate", this.state.birthDate);
    data.append("number", this.state.number);
    data.append("password", this.state.password);
    data.append("contactID", this.props.user.userId);

    const url = `${process.env.REACT_APP_BACKEND_URL}/auth/updateUser`;

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status == 200) {
          success();
          const updatedUser = {
            email: this.state.email,
            name: this.state.name,
            profileImage: response.message.profileImage,
            birthDate: this.state.birthDate,
            phoneNumber: this.state.number,
            userId: this.props.user.userId,
            role: this.props.user.role,
          };
          let action = {
            type: "SET_AUTH",
            data: updatedUser,
          };
          this.props.dispatch(action);
        } else {
          error();
        }
      })
      .catch((err) => console.error("Error:", err));
  };
  render() {
    const { logout } = this.props.Authentification;
    const { imageUrl } = this.state;
  
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className="site-layout">
          <NavBar
            logout={logout}
            name={this.props.user.name}
            image={this.props.user.profileImage}
          />

          <Content style={{ margin: "0 16px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>
                <Link to="/dashboard">
                  <HomeOutlined />
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Profile</Breadcrumb.Item>
            </Breadcrumb>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 400, minWidth: 500 }}>
              <Space size={100}>
                <Space direction="vertical" align="center">
                  <Avatar
                    style={{
                      backgroundColor: "#cccccc",
                      verticalAlign: "middle",
                    }}
                    src={imageUrl}
                    size={100}></Avatar>

                  <Upload
                    onChange={this.handleChange}
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76">
                    <Button>
                      <UploadOutlined /> Change
                    </Button>
                  </Upload>
                </Space>
                <Form name="horizontal_login" layout="inline">
                  <Form.Item label="username">
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="Username"
                      onChange={(event) => {
                        this.setState({
                          name: event.target.value,
                        });
                      }}
                      value={this.state.name}
                    />
                  </Form.Item>
                  <Form.Item
                    label="email"
                    rules={[
                      {
                        type: "email",
                      },
                    ]}>
                    <Input
                      prefix={<MailOutlined className="site-form-item-icon" />}
                      style={{ width: 250 }}
                      type="text"
                      placeholder="email"
                      onChange={(event) => {
                        this.setState({
                          email: event.target.value,
                        });
                      }}
                      value={this.state.email}
                    />
                  </Form.Item>
                </Form>
              </Space>

              <Divider orientation="left">
                Info <PaperClipOutlined />
              </Divider>
              <Form name="horizontal_login" layout="inline">
                <Form.Item label="phone number">
                  <Input
                    prefix={<PhoneOutlined className="site-form-item-icon" />}
                    type="number"
                    placeholder="Phone Number"
                    onChange={(event) => {
                      this.setState({
                        number: event.target.value,
                      });
                    }}
                    value={this.state.number}
                  />
                </Form.Item>
                <Form.Item label="birth date">
                  {this.state.birthDate === "" ||
                  this.state.birthDate == undefined ? (
                    <DatePicker onChange={this.onChange} />
                  ) : (
                    <DatePicker
                      onChange={this.onChange}
                      value={moment(this.state.birthDate, "YYYY-MM-DD")}
                    />
                  )}
                </Form.Item>
              </Form>

              <Divider orientation="left">
                Password <LockOutlined />
              </Divider>
              <Form name="horizontal_login" layout="inline">
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                  hasFeedback>
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label="Confirm Password"
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
              </Form>
              <Divider dashed />
              <Button type="primary" onClick={this.handleSubmit}>
                Update Profile
              </Button>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user.Auth,
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

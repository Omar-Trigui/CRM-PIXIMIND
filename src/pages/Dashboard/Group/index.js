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
  message,
  Timeline,
  Tag,
} from "antd";
import axios from "axios";
import {
  SendOutlined,
  UserOutlined,
  UploadOutlined,
  MailOutlined,
  HomeOutlined,
  SyncOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
const _accessToken = localStorage.getItem("access_token");
const { Content } = Layout;
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
const success = () => {
  message.success("your profile was updated succesffuly");
};
const successSendEmail = () => {
  message.success("your ivitation was sent succesffuly");
};

const error = () => {
  message.error("There was an error ");
};
const errorSendEmail = (text) => {
  message.error(text);
};

class index extends Component {
  state = {
    name: "",
    website: "",
    image: "",
    imageUrl: "",
    users: [],
    existedUsers: [],
    invitedUser: "",
  };
  componentWillMount() {
    this.getGroupByID();
    this.getUsersByGroup();
  }
  getUsersByGroup = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/group/getUsersByGroup`;
    const data = { group_id: this.props.user.group };
    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };

    return axios
      .post(url, data, config)
      .then((response) => {
        this.setState({ existedUsers: response.data.users });
      })
      .catch((err) => {
        console.log(err);
      });
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
  inviteUser = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/group/inviteUsers`;
    const data = {
      group_id: this.props.user.group,
      email: this.props.user.Auth.email,
      name: this.props.user.Auth.name,
      inviteUser: this.state.invitedUser,
    };
    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };

    return axios
      .post(url, data, config)
      .then(() => {
        successSendEmail();
        this.setState({
          users: [...this.state.users, this.state.invitedUser],
        });
      })
      .catch((err) => {
        errorSendEmail(err.response.data.message);
      });
  };
  handelSubmit = () => {
    const data = new FormData();

    data.append("website", this.state.website);
    data.append("name", this.state.name);
    data.append("groupId", this.props.user.group);

    if (this.state.image !== `${process.env.REACT_APP_BACKEND_URL}/undefined`) {
      data.append("myFile", this.state.image);
    }

    const url = `${process.env.REACT_APP_BACKEND_URL}/api/group/editGroup`;

    fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === 200) {
          success();
        } else {
          error();
        }
      })
      .catch((err) => console.error("Error:", err));
  };
  getGroupByID = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/group/getGroupById`;
    const data = { groupId: this.props.user.group };
    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };

    return axios
      .post(url, data, config)
      .then((response) => {
        this.setState({
          name: response.data.group.name,
          website: response.data.group.website,
          imageUrl:
            process.env.REACT_APP_BACKEND_URL + "/" + response.data.group.photo,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  render() {
    const { logout } = this.props.Authentification;
    const { name, website, imageUrl } = this.state;
    console.log(name);
    console.log("this.state.name");
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className="site-layout">
          <NavBar
            logout={logout}
            name={this.props.user.Auth.name}
            image={this.props.user.Auth.profileImage}
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
                  <Form.Item label="name">
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="name"
                      onChange={(event) => {
                        this.setState({
                          name: event.target.value,
                        });
                      }}
                      value={name}
                    />
                  </Form.Item>
                  <Form.Item label="website">
                    <Input
                      prefix={<MailOutlined className="site-form-item-icon" />}
                      style={{ width: 250 }}
                      type="text"
                      placeholder="website"
                      onChange={(event) => {
                        this.setState({
                          website: event.target.value,
                        });
                      }}
                      value={website}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={this.handelSubmit}>
                      Save
                    </Button>
                  </Form.Item>
                </Form>
              </Space>

              <Divider orientation="left">
                Invite Sub users <SendOutlined />
              </Divider>
              <Space direction="vertical" size={20}>
                <Form name="horizontal_login" layout="inline">
                  <Form.Item label="email">
                    <Input
                      prefix={<MailOutlined className="site-form-item-icon" />}
                      style={{ width: 250 }}
                      type="text"
                      placeholder="enter user email"
                      onChange={(event) => {
                        this.setState({
                          invitedUser: event.target.value,
                        });
                      }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      onClick={this.inviteUser}>
                      Save
                    </Button>
                  </Form.Item>
                </Form>
                <Timeline>
                  {this.state.existedUsers.map((user, key) => (
                    <Timeline.Item>
                      {user.email}{" "}
                      <Tag icon={<CheckCircleOutlined />} color="success">
                        Accepted
                      </Tag>
                    </Timeline.Item>
                  ))}
                  {this.state.users.map((user, key) => (
                    <Timeline.Item>
                      {user}{" "}
                      <Tag icon={<SyncOutlined spin />} color="warning">
                        waiting to accept
                      </Tag>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Space>
            </div>
          </Content>
        </Layout>
      </Layout>
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

import React, { Component } from "react";
import {
  Layout,
  Breadcrumb,
  Form,
  Input,
  Row,
  Col,
  Select,
  Button,
  notification,
  message,
  Modal,
  Space,
  Avatar,
  Upload,
} from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { HomeOutlined, UploadOutlined } from "@ant-design/icons";
const { Option } = Select;
const { Content } = Layout;
const _accessToken = localStorage.getItem("access_token");
const openNotificationWithIcon = (type) => {
  notification[type]({
    message: "Contact updated",
    description: "This Contact was updated succesfully",
  });
};
const ERROR = (text) => {
  message.error(text);
};
const success = (text) => {
  message.success(text);
};
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}
class updateContact extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    users: [],
    tags: [],
    email: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    phoneNumber: "",
    owner: "",
    leadStatus: "",
    lifeCycle: "",
    LeadStatusOptions: [],
    image: "",
    imageUrl: "",
    Newtags: "",
  };
  componentWillMount() {
    this.getContactDetails();
    this.getLeadStatusOptions();
  }
  componentDidMount() {
    this.getUsersByGroup();
  }
  handleTagChange = (value) => {
    this.setState({
      Newtags: value,
    });
  };
  getLeadStatusOptions = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/leadStatus.json`;

    return axios
      .get(url)
      .then((response) => {
        console.log(response.data.status);

        this.setState({ LeadStatusOptions: response.data.status });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleSubmit = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/contact/updateContact`;
    console.log(this.state.Newtags);

    // const data = {
    //   email: this.state.email,
    //   firstName: this.state.firstName,
    //   lastName: this.state.lastName,
    //   jobTitle: this.state.jobTitle,
    //   phoneNumber: this.state.phoneNumber,
    //   contactOwner: this.state.owner,
    //   leadStatus: this.state.leadStatus,
    //   lifecycleStage: this.state.lifeCycle,
    //   groupId: this.props.user.group,
    //   contactID: this.props.match.params.id,
    // };
    const data = new FormData();
    data.append("email", this.state.email);
    data.append("firstName", this.state.firstName);
    data.append("lastName", this.state.lastName);
    data.append("jobTitle", this.state.jobTitle);
    data.append("phoneNumber", this.state.phoneNumber);
    data.append("contactOwner", this.state.owner);
    data.append("leadStatus", this.state.leadStatus);
    data.append("lifecycleStage", this.state.lifeCycle);
    data.append("groupId", this.props.user.group);
    data.append("tags", this.state.Newtags);
    data.append("myFile", this.state.image);
    data.append("contactID", this.props.match.params.id);

    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };
    return axios
      .post(url, data, config)
      .then((response) => {
        this.getContactDetails();
        openNotificationWithIcon("success");
      })
      .catch((err) => {
        this.setState({ errorMsg: "User Not found!" });
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
  getContactDetails = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/contact/getContactByID`;
    const data = { ContactID: this.props.match.params.id };
    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };
    return axios
      .post(url, data, config)
      .then((response) => {
        const resUser = response.data.contact;
        console.log(resUser.tags.length);
        const children = [];
        resUser.tags.map((tag) => {
          children.push(<Option key={tag}>{tag}</Option>);
        });

        console.log(children);

        this.setState({
          email: resUser.email,
          firstName: resUser.firstName,
          lastName: resUser.lastName,
          jobTitle: resUser.jobTitle,
          phoneNumber: resUser.phoneNumber,
          owner: resUser.contactOwner,
          leadStatus: resUser.leadStatus,
          lifeCycle: resUser.lifecycleStage,
          tags: [...this.state.tags, children],
          imageUrl: process.env.REACT_APP_BACKEND_URL + "/" + resUser.photo,
        });
        //console.log(this.state.tags);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
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
        this.setState({ users: response.data.users });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  setModal2Visible(modal2Visible) {
    this.setState({ modal2Visible });
  }
  setNewLeadStatus = () => {
    console.log(this.state.newLeadStatus);

    const url = `${process.env.REACT_APP_BACKEND_URL}/api/contact/addLeadStatusOption`;
    const data = { LeadStatus: this.state.newLeadStatus };
    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };
    axios
      .post(url, data, config)
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          this.getLeadStatusOptions();
          success("leadStatus added succefully");
        } else {
          ERROR("there was an error");
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  };
  render() {
    const { imageUrl } = this.state;
    return (
      <Content style={{ margin: "0 16px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <Link to="/dashboard">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/dashboard/contact">Contacts</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Contact</Breadcrumb.Item>
          <Breadcrumb.Item>Update</Breadcrumb.Item>
        </Breadcrumb>
        <Modal
          title="Add Lead Status"
          centered
          visible={this.state.modal2Visible}
          onOk={() => this.setModal2Visible(false)}
          onCancel={() => this.setModal2Visible(false)}>
          <Form name="horizontal_login" layout="inline">
            <Form.Item label="Lead Status">
              <Input
                style={{ width: 290 }}
                type="text"
                placeholder="Lead Status"
                onChange={(event) => {
                  this.setState({
                    newLeadStatus: event.target.value,
                  });
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => this.setNewLeadStatus()}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 360 }}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Email">
                  <Input
                    placeholder="Please enter contact email"
                    onChange={(event) => {
                      this.setState({
                        email: event.target.value,
                      });
                    }}
                    value={this.state.email}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="First Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a valid First name",
                    },
                  ]}>
                  <Input
                    placeholder="Please enter contact First name"
                    onChange={(event) => {
                      this.setState({
                        firstName: event.target.value,
                      });
                    }}
                    value={this.state.firstName}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Last Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a valid Last name",
                    },
                  ]}>
                  <Input
                    placeholder="Please enter contact Last name"
                    onChange={(event) => {
                      this.setState({
                        lastName: event.target.value,
                      });
                    }}
                    value={this.state.lastName}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Job Title">
                  <Input
                    placeholder="Please enter contact Job Title"
                    onChange={(event) => {
                      this.setState({
                        jobTitle: event.target.value,
                      });
                    }}
                    value={this.state.jobTitle}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Phone Number">
                  <Input
                    placeholder="Please enter contact Phone Number"
                    onChange={(event) => {
                      this.setState({
                        phoneNumber: event.target.value,
                      });
                    }}
                    value={this.state.phoneNumber}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Owner"
                  rules={[
                    {
                      required: true,
                      message: "Please select an owner",
                    },
                  ]}>
                  <Select
                    placeholder={this.state.owner}
                    onChange={(value) => this.setState({ owner: value })}
                    value={this.state.owner}>
                    {this.state.users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Lead Status"
                  rules={[
                    {
                      required: true,
                      message: "Please select a Lead Status",
                    },
                  ]}>
                  <Select
                    placeholder="Please select a Lead Status"
                    onChange={(value) => this.setState({ leadStatus: value })}
                    value={this.state.lifeCycle}>
                    {this.state.LeadStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                    <Option>
                      <a
                        type="primary"
                        onClick={() => this.setModal2Visible(true)}>
                        Add Lead Status
                      </a>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Lifecycle Stage">
                  <Select
                    placeholder="Please select an Lifecycle Stage"
                    onChange={(value) => this.setState({ lifeCycle: value })}
                    value={this.state.lifeCycle}>
                    <Option value="Subscriber">Subscriber</Option>
                    <Option value="Marketing">Marketing</Option>
                    <Option value="qualified">qualified</Option>
                    <Option value="lead">lead</Option>
                    <Option value="Opportunity">Opportunity</Option>
                    <Option value="Customer">Customer</Option>
                    <Option value="Evangelist">Evangelist</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Tags">
                  <Select
                    mode="tags"
                    style={{ width: "100%" }}
                    placeholder="Tags Mode"
                    onChange={this.handleTagChange}>
                    {this.state.tags}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item>
                  <label>Upload contact image</label>
                  <br />
                  <br />
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
                  </Space>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Button type="primary" block onClick={this.handleSubmit}>
                  Update Contact
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Content>
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
export default connect(mapStateToProps, mapDispatchToProps)(updateContact);

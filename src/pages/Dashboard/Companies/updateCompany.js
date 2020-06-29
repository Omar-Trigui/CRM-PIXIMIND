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
} from "antd";
import industryList from "./industry.json";
import typeList from "./type.json";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { HomeOutlined } from "@ant-design/icons";
const { Option } = Select;
const { Content } = Layout;
const _accessToken = localStorage.getItem("access_token");
const openNotificationWithIcon = (type) => {
  notification[type]({
    message: "Company updated",
    description: "This Contact was updated succesfully",
  });
};

class updateCompany extends Component {
 

  state = {
    users: [],

    name: "",
    companyOwner: "",
    contactOwner: "",
    groupId: "",
    industry: "",
    phoneNumber: "",
    type: "",
    city: "",
    postaleCode: "",
    numberOfEmployees: "",
    annualRevenue: "",
    Description: "",
    Linkedin: "",
  };
  componentWillMount() {
    this.getContactDetails();
  }
  componentDidMount() {
    this.getUsersByGroup();
  }
  handleSubmit = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/company/updateContact`;
    const data = {
      name: this.state.name,
      companyOwner: this.state.companyOwner,
      industry: this.state.industry,
      phoneNumber: this.state.phoneNumber,
      type: this.state.type,
      city: this.state.city,
      postaleCode: this.state.postaleCode,
      numberOfEmployees: this.state.numberOfEmployees,
      annualRevenue: this.state.annualRevenue,
      Description: this.state.Description,
      Linkedin: this.state.Linkedin,
      groupId: this.props.user.group,
      contactOwner: this.props.user.Auth.userId,
      contactID: this.props.match.params.id,
    };

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
  getContactDetails = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/company/getContactByID`;
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

        this.setState({
          name: resUser.name,
          companyOwner: resUser.contactOwner,
          industry: resUser.industry,
          phoneNumber: resUser.phoneNumber,
          type: resUser.type,
          city: resUser.city,
          postaleCode: resUser.postaleCode,
          numberOfEmployees: resUser.numberOfEmployees,
          annualRevenue: resUser.annualRevenue,
          Description: resUser.Description,
          Linkedin: resUser.Linkedin,
          groupId: resUser.group,
          contactOwner: resUser.userId,
        });
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

  render() {
    return (
      <Content style={{ margin: "0 16px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <Link to="/dashboard">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/dashboard/companies">Companies</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Companie</Breadcrumb.Item>
          <Breadcrumb.Item>Update</Breadcrumb.Item>
        </Breadcrumb>

        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 360 }}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter company name",
                    },
                  ]}>
                  <Input
                    placeholder="Please enter Company name"
                    onChange={(event) => {
                      this.setState({
                        name: event.target.value,
                      });
                    }}
                    value={this.state.name}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Owner">
                  <Select
                    placeholder="Please select an owner"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(value) => this.setState({ companyOwner: value })}
                    value={this.state.companyOwner}>
                    {this.state.users.map((user) => (
                      <option key={user._d} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="industry">
                  <Select
                    placeholder="Please select an industry"
                    onChange={(industry) => {
                      this.setState({ industry: industry });
                    }}
                    value={this.state.industry}>
                    {industryList.industries.map((industry, key) => (
                      <option key={key} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="type">
                  <Select
                    placeholder="Please select type"
                    onChange={(type) => {
                      this.setState({ type: type });
                    }}
                    value={this.state.type}>
                    {typeList.types.map((type, key) => (
                      <option key={key} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="phone Number">
                  <Input
                    placeholder="Please enter Company phone Number"
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
                <Form.Item label="city">
                  <Input
                    placeholder="Please enter Company city"
                    onChange={(event) => {
                      this.setState({
                        city: event.target.value,
                      });
                    }}
                    value={this.state.city}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="postale Code">
                  <Input
                    placeholder="Please enter Company postale Code"
                    onChange={(event) => {
                      this.setState({
                        postaleCode: event.target.value,
                      });
                    }}
                    value={this.state.postaleCode}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="number Of Employees">
                  <Input
                    placeholder="Please enter Company number Of Employees"
                    onChange={(event) => {
                      this.setState({
                        numberOfEmployees: event.target.value,
                      });
                    }}
                    value={this.state.numberOfEmployees}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="annual Revenue">
                  <Input
                    placeholder="Please enter Company annual Revenue"
                    onChange={(event) => {
                      this.setState({
                        annualRevenue: event.target.value,
                      });
                    }}
                    value={this.state.annualRevenue}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Description">
                  <Input
                    placeholder="Please enter Company annual Description"
                    onChange={(event) => {
                      this.setState({
                        Description: event.target.value,
                      });
                    }}
                    value={this.state.Description}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Linkedin">
                  <Input
                    placeholder="Please enter Company Linkedin"
                    onChange={(event) => {
                      this.setState({
                        Linkedin: event.target.value,
                      });
                    }}
                    value={this.state.Linkedin}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Button type="primary" block onClick={this.handleSubmit}>
                  Update Companie
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
export default connect(mapStateToProps, mapDispatchToProps)(updateCompany);

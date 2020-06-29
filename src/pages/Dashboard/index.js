import React, { Component } from "react";
import { Layout, Statistic, Row, Col, Card, Empty, message } from "antd";
import { Route, Switch } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Contact from "./Contact";
import Deals from "./Deals";
import UpdateContact from "./Contact/updateContact";
import UpdateCompany from "./Companies/updateCompany";
import Companies from "./Companies";
import { connect } from "react-redux";
import axios from "axios";
import "./Dasboard.css";
import {
  ApiOutlined,
  TeamOutlined,
  BankOutlined,
  UserOutlined,
} from "@ant-design/icons";
const _accessToken = localStorage.getItem("access_token");
const { Header, Footer, Sider } = Layout;

class index extends Component {
  state = {
    contactNumber: "",
    companyNumber: "",
    userNumber: "",
    dealsNumber: "",
  };
  componentDidMount() {
    this.getContactNumber();
    this.getCompanyNumber();
    this.getUsersByGroup();
    this.fetchDeals();
  }
  getCompanyNumber = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/company/companyNumber`;
    const data = {
      group_id: this.props.user.group,
    };
    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };

    return axios
      .post(url, data, config)
      .then((response) => {
        this.setState({ companyNumber: response.data.result });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  fetchDeals = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/deal/getDealsByGroupID`;
    const data = { group_id: this.props.user.group };
    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };
    return axios
      .post(url, data, config)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);

          this.setState({ dealsNumber: response.data.length });
          let action = {
            type: "SET_NEW_DEALS",
            data: response.data,
          };
          this.props.dispatch(action);
        } else {
          message.error("Error fetching deals");
        }
      })
      .catch((err) => {
        console.log(err);
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
        this.setState({ userNumber: response.data.users.length });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  getContactNumber = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/contact/contactNumber`;
    const data = {
      group_id: this.props.user.group,
    };
    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };

    return axios
      .post(url, data, config)
      .then((response) => {
        this.setState({ contactNumber: response.data.result });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  render() {
    const { logout } = this.props.Authentification;

    return (
      <Layout style={{ minHeight: "100vh" }}>
        <SideBar />
        <Layout className="site-layout">
          <NavBar
            logout={logout}
            name={this.props.user.Auth.name}
            image={this.props.user.Auth.profileImage}
          />
          <Switch>
            <Route exact path="/dashboard/contact" component={Contact} />
            <Route exact path="/dashboard/deals" component={Deals} />
            <Route exact path="/dashboard/companies" component={Companies} />
            <Route
              exact
              path="/dashboard/contact/update/:id"
              component={UpdateContact}
            />
            <Route
              exact
              path="/dashboard/companie/update/:id"
              component={UpdateCompany}
            />
          </Switch>

          {this.props.location.pathname === "/dashboard" && (
            <div>
              <Row gutter={16} style={{ margin: "10px" }}>
                <Col className="gutter-row" span={6}>
                  <Card>
                    <Statistic
                      title="Contacts"
                      value={this.state.contactNumber}
                      valueStyle={{ color: "#1890ff" }}
                      prefix={<TeamOutlined style={{ fontSize: "45px" }} />}
                    />
                  </Card>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Card>
                    <Statistic
                      title="Companies"
                      value={this.state.companyNumber}
                      valueStyle={{ color: "#1890ff" }}
                      prefix={<BankOutlined style={{ fontSize: "45px" }} />}
                    />
                  </Card>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Card>
                    <Statistic
                      title="members"
                      value={this.state.userNumber}
                      valueStyle={{ color: "#1890ff" }}
                      prefix={<UserOutlined style={{ fontSize: "45px" }} />}
                    />
                  </Card>
                </Col>
                <Col className="gutter-row" span={6}>
                  <Card>
                    <Statistic
                      title="Deals"
                      value={this.state.dealsNumber}
                      valueStyle={{ color: "#1890ff" }}
                      prefix={<ApiOutlined style={{ fontSize: "45px" }} />}
                    />
                  </Card>
                </Col>
              </Row>
              <Row gutter={24} style={{ margin: "10px" }}>
                <Col className="gutter-row" span={12}>
                  <Card style={{ height: "300px" }}>
                    <Empty style={{ paddingTop: "10%" }} />
                  </Card>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Card style={{ height: "300px" }}>
                    <Empty style={{ paddingTop: "10%" }} />
                  </Card>
                </Col>
              </Row>
              <Row gutter={24} style={{ margin: "10px" }}>
                <Col className="gutter-row" span={12}>
                  <Card style={{ height: "300px" }}>
                    <Empty style={{ paddingTop: "10%" }} />
                  </Card>
                </Col>
                <Col className="gutter-row" span={12}>
                  <Card style={{ height: "300px" }}>
                    <Empty style={{ paddingTop: "10%" }} />
                  </Card>
                </Col>
              </Row>
            </div>
          )}
          <Footer style={{ textAlign: "center" }}>Piximind ©2020</Footer>
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

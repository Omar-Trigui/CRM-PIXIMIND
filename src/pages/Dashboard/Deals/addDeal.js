import React, { Component } from "react";
import {
  Avatar,
  Space,
  Form,
  Input,
  Divider,
  Rate,
  DatePicker,
  Row,
  Col,
  Drawer,
  Button,
  Select,
} from "antd";
import {
  PlusOutlined,
  TagsOutlined,
  UserOutlined,
  EuroCircleOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import axios from "axios";
const _accessToken = localStorage.getItem("access_token");
const { Option } = Select;
class addDeal extends Component {
  state = {
    visible: false,
    users: [],
    contacts: [],
    companies: [],
    dealName: "",
    dealAmount: "",
    dealStage: "",
    dealOwner: "",
    closeDate: "",
    companyID: "",
    contactID: "",
    rate: "",
   
  };
  componentWillMount() {
    this.getUsersByGroup();
    this.getContactbyGroup();
    this.getCompanybygroup();
     
  }
  
  handleSubmit = () => {
    const {
      dealName,
      dealAmount,
      dealStage,
      rate,
      closeDate,
      dealOwner,
      companyID,
      contactID,
    } = this.state;
    const data = {
      dealName: dealName,
      dealAmount: dealAmount,
      dealStage: dealStage,
      rate: rate,
      closeDate: closeDate,
      dealOwner: dealOwner,
      companyID: companyID,
      contactID: contactID,
      groupId: this.props.user.group,
    };
    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/deal/addDeal`;
    axios
      .post(url, data, config)
      .then((response) => {
        console.log(response.data);
        let action = {
          type: "SET_DEAL",
          data: response.data,
        };
        this.props.dispatch(action);
        this.onClose();
        
      })
      .catch((err) => {
        console.log(err);
      });
  };
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  getCompanybygroup = () => {
    const myData = [];
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/company/getContacts`;
    const data = { groupId: this.props.user.group };
    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };
    axios
      .post(url, data, config)
      .then((response) => {
       
        let companies = response.data.result;
        for (let i = 0; i < companies.length; i++) {
          myData.push({
            id: companies[i]._id,
            name: companies[i].name,
            photo: companies[i].photo,
          });
        }
      
        this.setState({ companies: myData });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  getContactbyGroup = () => {
    const myData = [];
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/contact/getContacts`;
    const data = { group_id: this.props.user.group };
    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };
    axios
      .post(url, data, config)
      .then((response) => {
        let contacts = response.data.result;
        for (let i = 0; i < contacts.length; i++) {
          myData.push({
            id: contacts[i]._id,
            name: contacts[i].firstName + " " + contacts[i].lastName,
            photo: contacts[i].photo,
          });
        }
        this.setState({ contacts: myData });
      })
      .catch(function (error) {
        console.log(error);
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
        console.log(err);
      });
  };
  render() {
    return (
      <>
        <Drawer
          title="Create a new Contact"
          width={650}
          onClose={this.onClose}
          visible={this.state.visible}
          headerStyle={{
            backgroundImage:
              "linear-gradient(to right, RGB(109, 194, 197) , RGB(54, 184, 233))",
            color: "#CCCCCC",
          }}
          bodyStyle={{ paddingBottom: 80 }}
          footer={
            <div
              style={{
                textAlign: "right",
              }}>
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={() => this.handleSubmit()} type="primary">
                Submit
              </Button>
            </div>
          }>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="DealName" label="Deal Name">
                  <Input
                    placeholder="Please enter Deal Name"
                    onChange={(event) => {
                      this.setState({
                        dealName: event.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="DealAmount" label="Deal Amount">
                  <Input
                    placeholder="Please enter Deal Amount"
                    prefix={<EuroCircleOutlined />}
                    type="number"
                    onChange={(event) => {
                      this.setState({
                        dealAmount: event.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="dealStage" label="Deal Stage">
                  <Select
                    placeholder="Please select the Deal Stage"
                    onChange={(value) => this.setState({ dealStage: value })}>
                    <Option value="new">New</Option>
                    <Option value="Qualified">Qualified</Option>
                    <Option value="Propostion">Propostion</Option>
                    <Option value="Won">Won</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="dealOwner" label="Deal owner">
                  <Select
                    placeholder="Please select an owner"
                    onChange={(value) => this.setState({ dealOwner: value })}>
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
                <Form.Item name="closeDate" label="Close Date">
                  <DatePicker
                    bordered={false}
                    style={{ width: "100%" }}
                    onChange={(date, dateString) => {
                      this.setState({ closeDate: dateString });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="rate" label="Rate">
                  <Rate onChange={(value) => this.setState({ rate: value })} />
                </Form.Item>
              </Col>
            </Row>
            <Divider orientation="left">
              Associate deal with <TagsOutlined />
            </Divider>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="company" label="Company">
                  <Select
                    placeholder="Please select the Company"
                    size={"large"}
                    onChange={(value) => this.setState({ companyID: value })}>
                    {this.state.companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        <Space align="center">
                          <Avatar
                            icon={<UserOutlined />}
                            style={{ marginBottom: "20%" }}
                            src={
                              company.photo ? (
                                `${process.env.REACT_APP_BACKEND_URL}/${company.photo}`
                              ) : (
                                <UserOutlined />
                              )
                            }
                          />{" "}
                          {company.name}
                        </Space>
                      </option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="contact" label="contact">
                  <Select
                    placeholder="Please select the contact"
                    size={"large"}
                    onChange={(value) => this.setState({ contactID: value })}>
                    {this.state.contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        <Space align="center">
                          <Avatar
                            icon={<UserOutlined />}
                            style={{ marginBottom: "20%" }}
                            src={
                              contact.photo ? (
                                `${process.env.REACT_APP_BACKEND_URL}/${contact.photo}`
                              ) : (
                                <UserOutlined />
                              )
                            }
                          />{" "}
                          {contact.name}
                        </Space>
                      </option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
        <Button
          key="1"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => this.showDrawer()}>
          Add Deal
        </Button>
      </>
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
export default connect(mapStateToProps, mapDispatchToProps)(addDeal);

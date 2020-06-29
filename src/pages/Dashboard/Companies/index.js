import React, { Component } from "react";
import {
  Layout,
  Upload,
  Breadcrumb,
  Form,
  Input,
  Popconfirm,
  notification,
  message,
  Table,
  Modal,
  Row,
  Col,
  Drawer,
  Button,
  Select,
  PageHeader,
} from "antd";

import "./style.css";
import {
  DownloadOutlined,
  FileExcelOutlined,
  PlusOutlined,
  InboxOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import axios from "axios";
import { connect } from "react-redux";
import industryList from "./industry.json";
import typeList from "./type.json";
const { Option } = Select;
const { Content } = Layout;
const _accessToken = localStorage.getItem("access_token");
const openNotificationWithIcon = (type) => {
  notification[type]({
    message: "Contacts Added",
    description: "Your contacts was added from your excel sheet succesfully",
  });
};
const error = () => {
  message.error("Please enter the required information");
};
class index extends Component {
  state = {
    data: [],
    pagination: {},
    users: [],
    loading: false,
    size: "large",
    visible: false,
    loadingModal: false,
    visibleModal: false,
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

    columns: [
      {
        title: "name",
        dataIndex: "name",
      },

      {
        title: "industry",
        dataIndex: "industry",
      },
      {
        title: "phone Number",
        dataIndex: "phoneNumber",
      },
      {
        title: "type",
        dataIndex: "type",
      },
      {
        title: "city",
        dataIndex: "city",
      },
      {
        title: "postale Code",
        dataIndex: "postaleCode",
      },
      {
        title: "number Of Employees",
        dataIndex: "numberOfEmployees",
      },
      {
        title: "annual Revenue",
        dataIndex: "annualRevenue",
      },
      {
        title: "Description",
        dataIndex: "Description",
      },
      {
        title: "Linkedin",
        dataIndex: "Linkedin",
        render: (text, record) => <a href={record.Linkedin}>{record.name}</a>,
      },
      {
        title: "creationDate",
        dataIndex: "creationDate",
        render: (text, record) =>
          record.creationDate.substring(0, record.creationDate.indexOf("T")),
      },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: (text, record) => (
          <p>
            <Popconfirm
              title="Are you sure？"
              okText="Yes"
              onConfirm={() => this.deleteContacts(record._id)}
              cancelText="No">
              <a>delete</a>
            </Popconfirm>
            &nbsp;&nbsp;&nbsp;
            <a onClick={() => this.updateContact(record._id)}>update</a>
          </p>
        ),
      },
    ],
  };

  updateContact = (id) => {
    this.props.history.push("/dashboard/companie/update/" + id);
  };
  formFile = (e) => {
    if (e.event !== undefined && e.file.originFileObj !== undefined) {
      this.setState({ excel: e.file.originFileObj });
    }
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  deleteContacts = (id) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/company/deleteContact`;
    const data = { ContactID: id };
    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };

    axios
      .post(url, data, config)
      .then((response) => {
        this.fetch();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  downloadFile = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/company/getTemplate`;
    window.open(url, "_blank");
  };
  downloadBackup = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/company/ExportContact?id=${this.props.user.group}&accessToken=${_accessToken}&userId=${this.props.user.Auth.userId}`;
    window.open(url, "_blank");
  };
  fetchIndustryList = () => {
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
        let contactList = [];
        response.data.result.map((contact) => {
          let name = contact.firstName + " " + contact.lastName;
          contactList.push({ id: contact._id, name: name });
        });
        this.setState({ users: contactList });
      })
      .catch(function (err) {
        // handle error
        console.log(err);
      })
    
  };

  componentDidMount() {
    this.fetch();
    this.fetchIndustryList();
    console.log(process.env.DBSTRING);
    
  }
  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  };

  handleOk = () => {
    this.setState({ loadingModal: true });
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/company/uploadContactSheet`;

    const data = new FormData();
    data.append("contactOwner", this.props.user.Auth.userId);
    data.append("groupId", this.props.user.group);
    data.append("myFile", this.state.excel);

    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };

    axios
      .post(url, data, config)
      .then((response) => {
        this.fetch();
        console.log(response);
        this.setState({
          loadingModal: false,
          visibleModal: false,
        });
        openNotificationWithIcon("success");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleCancel = () => {
    this.setState({ visibleModal: false });
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
  handleSubmit = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/company/addCompany`;
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
    };
    const config = {
      headers: {
        Authorization: "Bearer " + _accessToken,
      },
    };

    return axios
      .post(url, data, config)
      .then((response) => {
        console.log(response.data);
        this.fetch();

        this.onClose();
      })
      .catch((err) => {
        if (err.response.status == 404) {
          error();
        }
      });
  };
  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      results: pagination.pageSize,
      page: pagination.current,
      sortField: sorter.field,
      sortOrder: sorter.order,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    const myData = [];
    this.setState({ loading: true });
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
        for (let i = 0; i < response.data.result.length; i++) {
          myData.push({
            key: i + 1,
            ...response.data.result[i],
          });
        }

        this.setState({ data: myData, loading: false });
      })
      .catch(function (err) {
        // handle error
        console.log(err.message);
      })
   
  };

  render() {
    const { visibleModal, loadingModal, loading } = this.state;

    return (
      <Content style={{ margin: "0 16px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <Link to="/dashboard">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Contacts</Breadcrumb.Item>
          <Breadcrumb.Item>Companies</Breadcrumb.Item>
        </Breadcrumb>
        {/* Import data from excel */}
        <Modal
          visible={visibleModal}
          title="Import Contact Data"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Return
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loadingModal}
              onClick={this.handleOk}>
              Submit
            </Button>,
          ]}>
          <Form>
            <Form.Item>
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={this.formFile}
                noStyle>
                <Upload.Dragger name="files">
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload.
                  </p>
                </Upload.Dragger>
              </Form.Item>
              <a onClick={this.downloadFile}>Download template</a>
            </Form.Item>
          </Form>
        </Modal>
        {/* create new Company */}

        <Drawer
          title="Create a new Company"
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
                <Form.Item
                  label="name"
                  name="name"
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
                    onChange={(value) =>
                      this.setState({ companyOwner: value })
                    }>
                    {this.state.users.map((user) => (
                      <option key={user.id} value={user.id}>
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
                    }}>
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
                    }}>
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
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
        {/* options  */}
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 360 }}>
          <div className="site-page-header-ghost-wrapper">
            <PageHeader
              extra={[
                <Button
                  key="3"
                  icon={<DownloadOutlined />}
                  onClick={this.downloadBackup}>
                  Download Backup
                </Button>,
                <Button
                  key="2"
                  icon={<FileExcelOutlined />}
                  onClick={this.showModal}>
                  Import
                </Button>,
                <Button
                  key="1"
                  type="primary"
                  shape="round"
                  icon={<PlusOutlined />}
                  onClick={this.showDrawer}>
                  Add Company
                </Button>,
              ]}></PageHeader>
          </div>
          <Table
            columns={this.state.columns}
            dataSource={this.state.data}
            loading={loading}
            onChange={this.handleTableChange}
          />
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
export default connect(mapStateToProps, mapDispatchToProps)(index);

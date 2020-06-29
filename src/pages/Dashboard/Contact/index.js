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
  Space,
  Tag,
  Avatar,
} from "antd";
import { Table } from "antd";
import Highlighter from "react-highlight-words";

import "./style.css";
import {
  DownloadOutlined,
  FileExcelOutlined,
  PlusOutlined,
  InboxOutlined,
  HomeOutlined,
  SearchOutlined,
  UserOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Modal, Row, Col, Drawer, Button, Select } from "antd";

import axios from "axios";
import { connect } from "react-redux";
import { PageHeader } from "antd";
const { Option } = Select;
const { Content } = Layout;
const _accessToken = localStorage.getItem("access_token");
const openNotificationWithIcon = (type) => {
  notification[type]({
    message: "Contacts Added",
    description: "Your contacts was added from your excel sheet succesfully",
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
    email: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    phoneNumber: "",
    owner: "",
    leadStatus: "",
    lifeCycle: "",
    excel: "",
    searchText: "",
    searchedColumn: "",
    LeadStatusOptions: [],
    selectedRowKeys: [],
    tags: [],
    tag: "",
    newLeadStatus: "",
    modal2Visible: false,
    image: null,
    loadingImage: false,
    imageUrl: null,
  };
  componentDidMount() {
    this.fetch();
    this.getUsersByGroup();
    this.getLeadStatusOptions();
  }
  handleImageChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({ loadingImage: true });
      return;
    }
    if (info.file.status === "done") {
      this.setState({ image: info.file.originFileObj });
      getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl: imageUrl,
          loadingImage: false,
        })
      );
    }
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
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };
  onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  updateContact = (id) => {
    this.props.history.push("/dashboard/contact/update/" + id);
  };
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}>
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });
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
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/contact/deleteContact`;
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
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/contact/getTemplate`;
    window.open(url, "_blank");
  };
  downloadBackup = () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/contact/ExportContact?id=${this.props.user.group}&accessToken=${_accessToken}&userId=${this.props.user.Auth.userId}`;
    window.open(url, "_blank");
  };
  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  };
  handleOk = () => {
    this.setState({ loadingModal: true });
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/contact/uploadContactSheet`;

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

        this.setState({
          loadingModal: false,
          visibleModal: false,
        });
        openNotificationWithIcon("success");
        // window.location = "/dashboard/contact";
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
    const data = new FormData();
    if (this.state.firstName && this.state.lastName && this.state.owner) {
      data.append("email", this.state.email);
      data.append("firstName", this.state.firstName);
      data.append("lastName", this.state.lastName);
      data.append("jobTitle", this.state.jobTitle);
      data.append("phoneNumber", this.state.phoneNumber);
      data.append("contactOwner", this.state.owner);
      data.append("leadStatus", this.state.leadStatus);
      data.append("lifecycleStage", this.state.lifeCycle);
      data.append("groupId", this.props.user.group);
      data.append("tags", this.state.tags);
      data.append("myFile", this.state.image);

      const url = `${process.env.REACT_APP_BACKEND_URL}/api/contact/addContact`;
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + _accessToken,
        },
        body: data,
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.status === 201) {
            this.fetch();
            this.onClose();
          } else {
            message.error("Something went wrong please retry");
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      message.error("please fill the required input");
    }
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
  fetch = () => {
    const myData = [];
    this.setState({ loading: true });
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
        for (let i = 0; i < response.data.result.length; i++) {
          myData.push({
            key: i + 1,
            ...response.data.result[i],
          });
        }
        console.log(myData);

        this.setState({ data: myData, loading: false });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
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
  handleTagChange = (value) => {
    this.setState({
      tags: value,
    });
  };
  render() {
    const columns = [
      {
        title: "photo",
        dataIndex: "photo",
        render: (text, record) => (
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{ marginBottom: "20%" }}
            src={
              text ? (
                `${process.env.REACT_APP_BACKEND_URL}/${text}`
              ) : (
                <UserOutlined />
              )
            }
          />
        ),
      },
      {
        title: "email",
        dataIndex: "email",
        ...this.getColumnSearchProps("email"),
      },
      {
        title: "First Name",
        dataIndex: "firstName",
        ...this.getColumnSearchProps("firstName"),
      },
      {
        title: "Last Name",
        dataIndex: "lastName",
        ...this.getColumnSearchProps("lastName"),
      },
      {
        title: "Job Title",
        dataIndex: "jobTitle",
      },
      {
        title: "Phone Number",
        dataIndex: "phoneNumber",
      },
      {
        title: "tags",
        dataIndex: "tags",
        render: (text, record) =>
          text.map((tags) => {
            return <Tag color="#108ee9">{tags}</Tag>;
          }),
      },
      {
        title: "Lead Status",
        dataIndex: "leadStatus",
      },
      {
        title: "Life cycle Stage",
        dataIndex: "lifecycleStage",
      },
      {
        title: "Creation Date",
        dataIndex: "creationDate",
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
    ];
    const {
      visibleModal,
      loadingModal,
      loading,
      selectedRowKeys,
      imageUrl,
    } = this.state;
    const uploadButton = (
      <div>
        {this.state.loadingImage ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        {
          key: "odd",
          text: "Select Odd Row",
          onSelect: (changableRowKeys) => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, indexOdd) => {
              if (indexOdd % 2 !== 0) {
                return false;
              }
              return true;
            });
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        },
        {
          key: "even",
          text: "Select Even Row",
          onSelect: (changableRowKeys) => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((key, indexEven) => {
              if (indexEven % 2 !== 0) {
                return true;
              }
              return false;
            });
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        },
      ],
    };
    return (
      <Content style={{ margin: "0 16px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <Link to="/dashboard">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Contacts</Breadcrumb.Item>
          <Breadcrumb.Item>Contact</Breadcrumb.Item>
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
                <Form.Item name="Email" label="Email">
                  <Input
                    placeholder="Please enter contact email"
                    onChange={(event) => {
                      this.setState({
                        email: event.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="First Name"
                  label="First Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a valid First name",
                    },
                  ]}>
                  <Input
                    name="First Name"
                    placeholder="Please enter contact First name"
                    onChange={(event) => {
                      this.setState({
                        firstName: event.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="Last Name"
                  label="Last Name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter a valid Last name",
                    },
                  ]}>
                  <Input
                    name="Last Name"
                    placeholder="Please enter contact Last name"
                    onChange={(event) => {
                      this.setState({
                        lastName: event.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="Job Title" label="Job Title">
                  <Input
                    placeholder="Please enter contact Job Title"
                    onChange={(event) => {
                      this.setState({
                        jobTitle: event.target.value,
                      });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="Phone Number" label="Phone Number">
                  <Input
                    placeholder="Please enter contact Phone Number"
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
                <Form.Item
                  name="owner"
                  label="Owner"
                  rules={[
                    {
                      required: true,
                      message: "Please select an owner",
                    },
                  ]}>
                  <Select
                    placeholder="Please select an owner"
                    onChange={(value) => this.setState({ owner: value })}>
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
                <Form.Item name="Lead Status" label="Lead Status">
                  <Select
                    placeholder="Please select a Lead Status"
                    onChange={(value) => this.setState({ leadStatus: value })}>
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
                <Form.Item name="Lifecycle Stage" label="Lifecycle Stage">
                  <Select
                    placeholder="Please select an Lifecycle Stage"
                    onChange={(value) => this.setState({ lifeCycle: value })}>
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
                    onChange={this.handleTagChange}></Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item>
                  <label>Upload contact image</label>
                  <br />
                  <br />
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={this.handleImageChange}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: "50%" }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
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
                  Add Contact
                </Button>,
              ]}></PageHeader>
          </div>
          <Table
            columns={columns}
            dataSource={this.state.data}
            loading={loading}
            onChange={this.handleTableChange}
            rowSelection={rowSelection}
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

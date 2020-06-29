import React, { Component } from "react";
import {
  Layout,
  Breadcrumb,
  Menu,
  Dropdown,
  Input,
  Space,
  PageHeader,
} from "antd";
import Pipeline from "../../../UIKIT/pipeLine/Pipeline";
import {
  HomeOutlined,
  MenuOutlined,
  DownOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import AddDeal from "./addDeal";
import { connect } from "react-redux";
const { Search } = Input;
const { Content } = Layout;
const menu = (
  <Menu>
    <Menu.Item key="0">
      <a href="http://www.alipay.com/">1st menu item</a>
    </Menu.Item>
    <Menu.Item key="1">
      <a href="http://www.taobao.com/">2nd menu item</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);
class index extends Component {

  render() {
    return (
      <Content style={{ margin: "0 16px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>
            <Link to="/dashboard">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Sales</Breadcrumb.Item>
          <Breadcrumb.Item>Deals</Breadcrumb.Item>
        </Breadcrumb>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 560 }}>
          <PageHeader
            extra={[
              <Space align="center" size={"large"}>
                <Dropdown overlay={menu} trigger={["click"]}>
                  <a
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}>
                    <FilterOutlined />
                    Filter <DownOutlined />
                  </a>
                </Dropdown>
                <Dropdown overlay={menu} trigger={["click"]}>
                  <a
                    className="ant-dropdown-link"
                    onClick={(e) => e.preventDefault()}>
                    <MenuOutlined /> Group By <DownOutlined />
                  </a>
                </Dropdown>
                <AddDeal />
                

                <Search
                  placeholder="input search text"
                  style={{ width: 500 }}
                  onSearch={(value) => console.log(value)}
                  enterButton
                />
              </Space>,
            ]}></PageHeader>

          <Pipeline groupid={this.props.user.group}/>
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
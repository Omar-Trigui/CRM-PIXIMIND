import React, { Component } from "react";
import { Menu, Dropdown } from "antd";

import {
  SettingOutlined,
  LogoutOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
export default class Settings extends Component {
  
  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <span>
            <Link to="/profile" style={{ color: "#767676" }}>
              <UserOutlined /> Profile
            </Link>
          </span>
        </Menu.Item>
        <Menu.Item key="1">
          <span>
            <Link to="/settings" style={{ color: "#767676" }}>
              <ShopOutlined /> Settings
            </Link>
          </span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3" onClick={this.props.logout}>
          <LogoutOutlined />
          <span>Logout</span>
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
        <a onClick={(e) => e.preventDefault()}>
          <SettingOutlined
            style={{
              color: "#828383",
              fontSize: "17px",
              paddingTop: "10px",
            }}
          />
        </a>
      </Dropdown>
    );
  }
}

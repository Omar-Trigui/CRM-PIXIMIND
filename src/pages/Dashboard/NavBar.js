import React from "react";
import { Layout, Menu, Avatar, Space, Divider, Badge } from "antd";
import Settings from "./Settings";
import { UserOutlined, NotificationOutlined } from "@ant-design/icons";

const { Header } = Layout;

const NavBar = (props) => {
  return (
    <Header className="site-layout-background">
      <Menu
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        style={{ float: "right" }}>
        <Space size="middle">
          <Settings logout={props.logout} />
          <Badge count={5} offset={[3, -2]}>
            <NotificationOutlined />
          </Badge>
          <Divider
            type="vertical"
            style={{
              borderColor: "#000000 ",
              color: "#000000 !important",
              fontWeight: "bolder",
              height: "30px",
            }}
          />
          <Avatar
            icon={<UserOutlined />}
            style={{ marginBottom: "20%" }}
            src={props.image}
          />
          <span style={{ fontWeight: "bold" }}>{props.name}</span>
        </Space>
      </Menu>
    </Header>
  );
};

export default NavBar;

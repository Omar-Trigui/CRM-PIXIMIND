import React from "react";
import {
  TeamOutlined,
  BarChartOutlined,
  CommentOutlined,
  FundProjectionScreenOutlined,
  RobotOutlined,
  SolutionOutlined,
  DingdingOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;
const { Sider } = Layout;
export default function SideBar() {
  return (
    <Sider collapsible>
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
        <Menu.Item>
          <DingdingOutlined style={{ fontSize: "25px", color: "white" }} />
          <span
            style={{
              fontSize: "25px",
              color: "white",
              fontFamily: "Pacifico",
            }}>
            InBound
          </span>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/dashboard">
            <BarChartOutlined style={{ fontSize: "25px", color: "white" }} />
            <span>Dashbord</span>
          </Link>
        </Menu.Item>

        <SubMenu
          key="sub1"
          title={
            <span>
              <TeamOutlined style={{ fontSize: "25px", color: "white" }} />
              <span>Contacts</span>
            </span>
          }>
          <Menu.Item key="2">
            <Link to="/dashboard/contact">Contact</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/dashboard/companies">Companies</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu
          key="sub4"
          title={
            <span>
              <FundProjectionScreenOutlined
                style={{ fontSize: "25px", color: "white" }}
              />
              <span>Sales</span>
            </span>
          }>
          <Menu.Item key="8">
            <Link to="/dashboard/deals">Deals</Link>
          </Menu.Item>
          <Menu.Item key="9">Tasks</Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          title={
            <span>
              <CommentOutlined style={{ fontSize: "25px", color: "white" }} />
              <span>Conversation</span>
            </span>
          }>
          <Menu.Item key="4">Inbox</Menu.Item>
          <Menu.Item key="5">Template</Menu.Item>
        </SubMenu>

        <Menu.Item key="10">
          <RobotOutlined style={{ fontSize: "25px", color: "white" }} />
          <span>Automation</span>
        </Menu.Item>
        <Menu.Item key="11">
          <SolutionOutlined style={{ fontSize: "25px", color: "white" }} />
          <span>Raports</span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

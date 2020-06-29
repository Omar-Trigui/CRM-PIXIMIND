import React, { Component } from "react";
import { Layout, Breadcrumb } from "antd";
const { Content } = Layout;
export default class index extends Component {

  render() {
    return (
      <Content style={{ margin: "0 16px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Contacts</Breadcrumb.Item>
          <Breadcrumb.Item>Companies</Breadcrumb.Item>
        </Breadcrumb>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 360 }}>
          Companies
        </div>
      </Content>
    );
  }
}

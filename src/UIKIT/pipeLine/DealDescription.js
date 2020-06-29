import React, { Component } from "react";
import { Rate } from "antd";
import { Typography, Space } from "antd";
import { EuroOutlined } from "@ant-design/icons";
const { Text, Link } = Typography;
export default class DealDescription extends Component {
  render() {
    return (
      <div>
        <Space direction="vertical">
          <Text style={{ fontSize: 18 }}>{this.props.Customer}</Text>
          <Text style={{ fontSize: 18 }}>
            {this.props.Revenue} <EuroOutlined />{" "}
          </Text>
          <Rate value={this.props.Ratevalue} disabled />
        </Space>
      </div>
    );
  }
}

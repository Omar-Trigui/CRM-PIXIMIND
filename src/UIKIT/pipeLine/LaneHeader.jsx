import React, { Component } from 'react'
import { Typography} from "antd";
const { Text } = Typography;
export class LaneHeader extends Component {
    render() {  
        return (
          <div>
            <Text style={{ fontSize: 12 }}>{this.props.TotalRevenue}{" "}‎€ </Text>
            <Text style={{ fontSize: 12 }}>/</Text>
            <Text style={{ fontSize: 12  }}>{this.props.TotalDeals}</Text>
          </div>
        );
    }
}

export default LaneHeader

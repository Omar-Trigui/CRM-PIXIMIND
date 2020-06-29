import React, { Component } from "react";
import { Popover, Row, Col, Card, Form, Input, Button } from "antd";
import VisibilityOnIcon from '../../assets/icons/VisibilityOnIcon'
import VisibilityOffIcon from '../../assets/icons/VisibilityOffIcon'
export default class UIKIT_INPUT_PASSWORD extends Component {
  state = {
    requiredMissing: "false",
    uperCaseColor: "#B3B3B3",
    SpecialCaracterColor: "#B3B3B3",
    hasNumberColor: "#B3B3B3",
    eightCaracterColor: "#B3B3B3"
  };
  passwordIcon=()=>{
    if(this.state.type=="text"){
        return(
            <button
                onClick={()=>{this.changeState("password")}}
                style={{backgroundColor:'transparent',margin:0,padding:0,height:24,border:'none',width:24}}
            >
                <VisibilityOnIcon />
            </button> 
        )
    }

    return(
        <button
            onClick={()=>{this.changeState("text")}}
            style={{backgroundColor:'transparent',margin:0,padding:0,height:24,border:'none',width:24}}
        >
            <VisibilityOffIcon />
        </button> 
    )
}
  handelChangePassword(event) {
    let password = event.target.value;
    this.setState({ test: "#5FB563" });
    if (
      this.hasUperCase(password) &&
      this.hasSpecialCaracter(password) &&
      this.hasNumber(password)
    ) {
      this.setState({ requiredMissing: "true" });
    } else {
      this.setState({ validateStatus: "error" });
      this.setState({ requiredMissing: "false" });
    }
    if (this.hasUperCase(password)) {
      this.setState({ uperCaseColor: "#5FB563" });
    }
    // this.setState({ full_name: event.target.value });

    // let name = event.target.value;

    // if (name.length < 6) {
    //   console.log("should have more the 6 caracter");
    //   this.setState({ full_name_status: validateMessagesFullNameWrong });
    //   this.setState({ full_name_statusFeedBack: false });
    // } else {
    //   this.setState({ full_name_status: validateMessagesFullNameCorrect });
    //   this.setState({ full_name_statusFeedBack: true });
    // }
  }
  hasUperCase(str) {
    return /[A-Z]/.test(str);
  }
  hasSpecialCaracter(str) {
  
      return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
   
  }
  hasNumber(str) {
    
    return /[0-9]/.test(str);
  }
  content = (
    <div style={{ fontSize: 12 }}>
      <h4 style={{ color: "black" }}>Password guidance</h4>
      <p style={{ color: this.state.hasNumberColor }}>Numbers</p>
      <p style={{ color: this.state.SpecialCaracterColor }}>
        Has special Caracter
      </p>
      <p style={{ color: this.state.uperCaseColor }}>Uper case</p>
      <p style={{ color: this.state.eightCaracterColor }}>Min 8 Caracter</p>
    </div>
  );
  render() {
    return (
      <Popover placement="leftTop" content={this.content} trigger="click">
        <Form.Item>
          <Input.Password
            type="password"
            placeholder="Enter your password"
            suffix={this.passwordIcon()}
            onChange={event => this.handelChangePassword(event)}
          />
        </Form.Item>
      </Popover>
    );
  }
}

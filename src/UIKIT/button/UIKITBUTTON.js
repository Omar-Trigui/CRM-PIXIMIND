import React, { Component } from "react";
import logincss from "../../pages/login/login.module.css";


export default class UIKITBUTTON extends Component {
  _RenderBtn() {
    const isdisabled = this.props.disabledbtn;

    if (isdisabled) {
      return (
        <button
          onClick={() => this.props.action()}
          type="primary"
          
          className={logincss.loginFormButtonDisabled}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "white",
              paddingTop: "7px"
            }}
          >
            {this.props.text}
          </span>
        </button>
      );
    } else {
      return (
        <button
          onClick={() => this.props.action()}
          type="primary"
          htmlType="submit"
          className={logincss.loginFormButton}
          disabled={this.props.disabled}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "white",
              paddingTop: "7px"
            }}
          >
            {this.props.text}
          </span>
        </button>
      );
    }
  }
  render() {
    return <React.Fragment>{this._RenderBtn()}</React.Fragment>;
  }
}

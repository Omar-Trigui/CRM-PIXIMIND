import React from "react";
import { Input, Typography } from "antd";
import ErrorIcon from "../../assets/icons/ErrorIcon";
import SuccessIcon from "../../assets/icons/SuccessIcon";
import inputPasswordCss from "./inputPassword.module.css";
import VisibilityOnIcon from "../../assets/icons/VisibilityOnIcon";
import VisibilityOffIcon from "../../assets/icons/VisibilityOffIcon";

const { Text } = Typography;

class InputPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "password",
    };
  }
  static defaultProps = {
    addonAfter: null,
    addonBefore: null,
    defaultValue: null,
    disabled: false,
    id: null,
    maxLength: null,
    prefix: null,
    size: "default",
    suffix: null,
    value: null,
    onChange: null,
    onPressEnter: null,
    allowClear: false,
    inputClassName: "inpuText",
    lablelClassName: "inputTextLabel",
    errorLabelClassName: "errorLabel",
    placeholder: null,
    valid: null,
    label: "",
    errorMessage: "",
  };

  render() {
    return (
      <div className="inputContainer">
        <Text className={inputPasswordCss.labelForm}>{this.props.label}</Text>

        <Input
          style={{ borderRadius: "5px" }}
          addonAfter={this.props.addonAfter}
          addonBefore={this.props.addonBefore}
          defaultValue={this.props.defaultValue}
          disabled={this.props.disabled}
          id={this.props.id}
          maxLength={this.props.maxLength}
          prefix={this.props.prefix}
          size={this.props.size}
          type={this.state.type}
          onChange={this.props.onChange}
          onPressEnter={this.props.onPressEnter}
          allowClear={this.props.allowClear}
          className={[
            this.props.inputClassName,

            this.props.valid === false
              ? inputPasswordCss.errorInput
              : this.props.valid === true
              ? inputPasswordCss.validInput
              : inputPasswordCss.defaultInput,
          ]}
          placeholder={this.props.placeholder}
          suffix={[this.passwordIcon()]}
        />
        <Text
          className={this.props.errorLabelClassName}
          style={{ display: this.props.errorMessage ? null : "none" }}>
          {this.props.errorMessage}
        </Text>
      </div>
    );
  }

  changeState = (type) => {
    this.setState({
      type: type,
    });
  };

  passwordIcon = () => {
    if (this.state.type === "text") {
      return (
        <div
          style={{ display: "flex", flexWrap: "wrap", alignContent: "center" }}>
          <button
            onClick={() => {
              this.changeState("password");
            }}
            style={{
              backgroundColor: "transparent",
              marginRight: "10px",
              height: 24,
              border: "none",
              width: 24,
            }}>
            <VisibilityOnIcon />
          </button>
          {this.props.validate === "success" ? (
            <SuccessIcon />
          ) : this.props.validate === "error" ? (
            <ErrorIcon />
          ) : null}
        </div>
      );
    }

    return (
      <div
        style={{ display: "flex", flexWrap: "wrap", alignContent: "center" }} >
        <button
          onClick={() => {
            this.changeState("text");
          }}
          style={{
            backgroundColor: "transparent",
            marginRight: "10px",
            height: 24,
            border: "none",
            width: 24,
          }}>
          <VisibilityOffIcon />
        </button>
        {this.props.validate === "success" ? (
          <SuccessIcon />
        ) : this.props.validate === "error" ? (
          <ErrorIcon />
        ) : null}
      </div>
    );
  };
}

export default InputPassword;

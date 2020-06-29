import React from "react";
import { Input, Typography } from "antd";
import inputTextcss from "./inputText.module.css";
import ErrorIcon from "../../assets/icons/ErrorIcon";
import SuccessIcon from "../../assets/icons/SuccessIcon";


const { Text } = Typography;
class InputText extends React.Component {
 
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
    type: "text",
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
    errorMessage: ""
  };

  render() {
    return (
      <div className="inputContainer">
        <Text className={inputTextcss.labelForm}>{this.props.label}</Text>
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
          type={this.props.type}
          onChange={this.props.onChange}
          onPressEnter={this.props.onPressEnter}
          allowClear={this.props.allowClear}
          className={[
            this.props.inputClassName,
            this.props.valid === false
              ? "errorInput"
              : this.props.valid === true
              ? "validInput"
              : null,
          ]}
          placeholder={this.props.placeholder}
          suffix={[this.validate()]}
        />
        <Text
          className={this.props.errorLabelClassName}
          style={{ display: this.props.errorMessage ? null : "none" }}>
          {this.props.errorMessage}
        </Text>
      </div>
    );
  }
  validate = () => {
    if (this.props.validate === "success") {
      return <SuccessIcon />;
    } else if (this.props.validate === "error") {
      return <ErrorIcon/>;
    }
  };
}

export default InputText;

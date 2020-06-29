import React from "react";
class VisibilityOnIcon extends React.Component {
  static defaultProps = {
    className: "inputIcon",
    size: 20,
  };

  render() {
    return (
      <div
        className={this.props.className}
        style={{ width: this.props.size, height: this.props.size }}>
        <svg
          id="baseline-visibility-24px"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24">
          <path
            id="Tracé_579"
            data-name="Tracé 579"
            d="M0,0H24V24H0Z"
            fill="none"
          />
          <path
            id="Tracé_580"
            data-name="Tracé 580"
            d="M12,4.5A11.827,11.827,0,0,0,1,12a11.817,11.817,0,0,0,22,0A11.827,11.827,0,0,0,12,4.5ZM12,17a5,5,0,1,1,5-5A5,5,0,0,1,12,17Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,12,9Z"
          />
        </svg>
      </div>
    );
  }
}

export default VisibilityOnIcon;

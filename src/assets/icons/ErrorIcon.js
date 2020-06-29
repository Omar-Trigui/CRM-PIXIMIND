import React from 'react';
class ErrorIcon extends React.Component{


  static defaultProps = {
    className:"inputIcon",
    size:22,
}

  render(){
    return(
      <div
        className={this.props.className}
        style={{width:this.props.size,height:this.props.size}}
      >
      <svg id="baseline-error-24px" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 {this.props.size} {this.props.size}">
        <path id="Tracé_602" data-name="Tracé 602" d="M0,0H24V24H0Z" fill="none"/>
        <path id="Tracé_603" data-name="Tracé 603" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm1,15H11V15h2Zm0-4H11V7h2Z" fill="rgba(198,40,40,0.9)"/>
      </svg>
      </div>
    )
  }
}

export default ErrorIcon;
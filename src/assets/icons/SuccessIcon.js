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
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <path id="Tracé_198" data-name="Tracé 198" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM10,17,5,12l1.41-1.41L10,14.17l7.59-7.59L19,8Z" transform="translate(-2 -2)" fill="rgba(78,173,83,0.9)"/>
</svg>
      </div>
    )
  }
}

export default ErrorIcon;
import React from "react";

class Alert extends React.Component {
  render() {
    return (
      <div id="alert">
        <div className="message">
          <p>{this.props.alert.message}</p>
          {this.props.alert.buttons.map((button, index) => (
            <button key={index} onClick={button.action}>
              {button.text}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export default Alert;

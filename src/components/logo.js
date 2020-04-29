import React from "react";
import { ReactComponent as WooflyLogo } from "../img/woofly-logo.svg";

class Logo extends React.Component {
  render() {
    return <WooflyLogo onClick={this.props.goHome} className="woofly-logo" />;
  }
}

export default Logo;

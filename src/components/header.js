import React from "react";
import Logo from "./logo.js";

class Header extends React.Component {

  render() {
    return (
      <header>
				<Logo />
        <span>Sit. Stay. Find your new best friend.</span>
      </header>
    );
  }
}

export default Header;

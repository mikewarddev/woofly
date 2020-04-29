import React from "react";

class Loader extends React.Component {
  render() {
    if (this.props.mainLoader) {
      return (
        <div id="main-loader">
          <img alt="Loading" src="main-load.gif" />
          <p>Fetching...</p>
        </div>
      );
    } else {
      return <img className="loader" alt="Loading" src="loading.gif" />;
    }
  }
}

export default Loader;

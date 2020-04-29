import React from "react";
import Alert from "./alert.js";
import Search from "./search.js";
import Results from "./results.js";

class Main extends React.Component {
  render() {
    return (
      <div id="main">
        {this.props.alert ? (
          <Alert
            alert={this.props.alert}
            showAlert={this.props.showAlert}
          />
        ) : null}
        {this.props.results.length === 0 ? (
          <Search
            types={this.props.types}
            search={this.props.search}
            searchParams={this.props.searchParams}
            setSearchParams={this.props.setSearchParams}
            toggleActiveSearch={this.props.toggleActiveSearch}
          />
        ) : (
          <Results
            results={this.props.results}
            search={this.props.search}
            showOverlay={this.props.showOverlay}
            searchParams={this.props.searchParams}
            goHome={this.props.goHome}
          />
        )}
      </div>
    );
  }
}

export default Main;

import React from "react";
import Logo from "./logo.js";
import Search from "./search.js";
import { ReactComponent as SearchIcon } from "../../node_modules/bootstrap-icons/icons/search.svg";
import { ReactComponent as CloseIcon } from "../../node_modules/bootstrap-icons/icons/x-circle-fill.svg";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canSearch: false
    };
  }

  toggleSearch() {
    document.body.classList.toggle("no-scroll");
    this.setState({
      canSearch: !this.state.canSearch
    });
  }

  render() {
    return (
      <div
        className={this.state.canSearch ? "search-bar expanded" : "search-bar"}
      >
        <Logo goHome={this.props.goHome} />
        <div className="search-toggle" onClick={this.toggleSearch.bind(this)}>
          {!this.state.canSearch ? <SearchIcon /> : <CloseIcon />}
        </div>
        {this.state.canSearch ? (
          <Search
            types={this.props.types}
            searchParams={this.props.searchParams}
            setSearchParams={this.props.setSearchParams}
            toggleSearch={this.toggleSearch.bind(this)}
            toggleActiveSearch={this.props.toggleActiveSearch}
          />
        ) : null}
        {/*<div className='copyright'>Copyright ©2020 Mike Ward</div>*/}
      </div>
    );
  }
}

export default SearchBar;

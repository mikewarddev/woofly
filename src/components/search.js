import React from "react";

class Search extends React.Component {
  render() {
    return (
      <div className='search'>
        <div className="search-criteria">
          <div className="type-container">
            <label>I'm looking for a</label>
            <select
              className="type-select"
              defaultValue={
                this.props.searchParams ? this.props.searchParams.type : null
              }
            >
              {this.props.types.map((type, index) => (
                <option
                  key={index}
                  value={type.name
                    .toLowerCase()
                    .replace(/(& |,)/g, "")
                    .replace(/(\s)/g, "-")}
                >
                  {type.name}
                </option>
              ))}
            </select>
          </div>
          <div className="locale-container">
            <label>Around this area</label>
            <input
              className="locale"
              type="text"
              defaultValue={
                this.props.searchParams ? this.props.searchParams.locale : null
              }
            />
            <p className="distance">
              Within <input type="radio" name="distance" value={5} /> 5{" "}
              <input type="radio" name="distance" value={10} /> 10{" "}
              <input type="radio" name="distance" value={25} /> 25{" "}
              <input type="radio" name="distance" value={50} /> 50 Miles
            </p>
          </div>
        </div>
        <div
          className="submit"
          onClick={() => {
            this.props.toggleActiveSearch();
            this.props.setSearchParams(true);
            if (this.props.toggleSearch) {
              this.props.toggleSearch();
            }
          }}
        >
          Search
        </div>
      </div>
    );
  }
}

export default Search;

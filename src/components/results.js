import React from "react";
import Loader from "./loader.js";
import Thumbnail from "./thumbnail.js";
import Tile from "./tile.js";

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: null,
      thumbnailView: true
    };
    this.autoLoad = this.autoLoad.bind(this);
    this.switchView = this.switchView.bind(this);
  }

  autoLoad() {
    if (
      window.scrollY + document.querySelector(".search-bar").offsetHeight >
      document.getElementById("main").offsetHeight - window.innerHeight
    ) {
      this.props.search();
      window.removeEventListener("scroll", this.autoLoad);
			this.setState({
				index: null
			})
    }
  }

  switchView(index) {
    let resultIndex = null;
    if (index) {
      resultIndex = index;
    } else {
      let vCenter = window.scrollY + window.innerHeight / 2;
      let results = document.querySelectorAll(".tile, .thumbnail");
      for (let i = 0; i < results.length; i++) {
        if (results[i].offsetTop > vCenter) {
          resultIndex = i - 1;
					break;
        }
      }
    }
    this.setState({
      index: resultIndex,
      thumbnailView: !this.state.thumbnailView
    });
  }

  componentDidMount() {
    window.addEventListener("scroll", this.autoLoad);
  }

  componentDidUpdate() {
    window.addEventListener("scroll", this.autoLoad);

    let results = document.querySelectorAll(".tile, .thumbnail");
    if (this.state.index !== null) {
      let yPos = results[this.state.index].offsetTop - (document.querySelector('.search-bar').offsetHeight / 2);
      if (this.state.thumbnailView) {
        yPos = yPos - window.innerHeight / 2;
      }
      window.scrollTo(0, yPos);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.autoLoad);
  }

  render() {
    let showImage = null;
    if (Number.isInteger(this.props.results.length / 20)) {
      if (this.props.results.length < 20) {
        showImage = false;
      } else {
        if (this.props.results.length >= 20) {
          showImage = true;
        }
      }
    } else {
      showImage = false;
    }

    return (
      <div
        id="results"
        className={this.state.thumbnailView ? "thumbnail-view" : "tile-view"}
      >
        <div id="animals">
          <p className="search-summary">
            Showing <strong>{this.props.searchParams.name}</strong>
            <br />
            within <strong>{this.props.searchParams.distance}</strong> miles of{" "}
            <strong>
              {this.props.searchParams.locale !== "Your Location"
                ? this.props.searchParams.locale
                : "Your Location"}
            </strong>
          </p>
          {this.props.results.map((result, index) =>
            this.state.thumbnailView ? (
              <Thumbnail
                key={index}
                result={result}
                resultIndex={index}
                switchView={this.switchView}
              />
            ) : (
              <Tile key={index} result={result} />
            )
          )}
        </div>
        <div className="message">
          {showImage ? (
            <Loader mainLoader={false} />
          ) : (
            <div>
              <h3 className="message">
                It looks like that's all we could find
              </h3>
              <div className="button" onClick={this.props.goHome}>
                Try Another Search
              </div>
            </div>
          )}
        </div>
        <div className="search-tools">
          <div className="search-tool view">
            <span className="search-tool-name">View</span>
            {this.state.thumbnailView ? (
              <svg
                className="bi bi-card-list tile-icon"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                  this.switchView(null);
                }}
              >
                <path
                  fillRule="evenodd"
                  d="M14.5 3h-13a.5.5 0 00-.5.5v9a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-9a.5.5 0 00-.5-.5zm-13-1A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h13a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0014.5 2h-13z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M5 8a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7A.5.5 0 015 8zm0-2.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0 5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5z"
                  clipRule="evenodd"
                />
                <circle cx="3.5" cy="5.5" r=".5" />
                <circle cx="3.5" cy="8" r=".5" />
                <circle cx="3.5" cy="10.5" r=".5" />
              </svg>
            ) : (
              <svg
                className="bi bi-list-ul thumbnail-icon"
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                  this.switchView(null);
                }}
              >
                <path
                  fillRule="evenodd"
                  d="M5 11.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm-3 1a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2zm0 4a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Results;

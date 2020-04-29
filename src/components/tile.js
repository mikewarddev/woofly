import React from "react";
import { ReactComponent as Xicon } from "../../node_modules/bootstrap-icons/icons/x.svg";
import { ReactComponent as CheckIcon } from "../../node_modules/bootstrap-icons/icons/check.svg";

class Tile extends React.Component {
  render() {
    let tileWidth = document.getElementById("results").offsetWidth + "px";

    return (
      <div className="tile">
        <div
          className="tile-image"
          style={{
            backgroundImage:
              "url('" +
              (this.props.result.photos[0] !== undefined
                ? this.props.result.photos[0]["full"]
                : "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/47704338/1/?bust=1585940134&amp;width=600") +
              "')",
            height: tileWidth
          }}
        />
        <h1>{this.props.result.name}</h1>
        <div className="profile-info">
          <p className="age-breed">
            {this.props.result.age + ", " + this.props.result.breeds.primary}
          </p>
          <p>{this.props.result.description}</p>
          <ul className="environment">
            {Object.entries(this.props.result.environment).map(
              ([key, value]) => {
                if (value !== null) {
                  return (
                    <li key={key}>
                      {value === true ? (
                        <span className="pro">
                          <CheckIcon /> <span>Good with {key}</span>{" "}
                        </span>
                      ) : (
                        <span className="con">
                          <Xicon /> <span>Not good with {key}</span>
                        </span>
                      )}
                    </li>
                  );
                } else {
                  return null;
                }
              }
            )}
          </ul>
          <ul className="attributes">
            {Object.entries(this.props.result.attributes).map(
              ([key, value]) => {
                return (
                  <li key={key}>
                    {key.replace(/_/g, " ").replace(/spayed /, "Spayed/")}:{" "}
                    {value ? "Yes" : "No"}
                  </li>
                );
              }
            )}
          </ul>
          <a
            className="adopt-btn"
            href={this.props.result.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Adopt {this.props.result.name}
          </a>
        </div>
      </div>
    );
  }
}

export default Tile;

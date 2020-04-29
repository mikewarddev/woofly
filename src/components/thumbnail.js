import React from "react";

class Thumbnail extends React.Component {
	
  render() {
		
    return (
      <div
        className="thumbnail"
        onClick={() => {
          this.props.switchView(this.props.resultIndex);
        }}
      >
        <div
          className="thumbnail-image"
          style={{
            backgroundImage:
              "url('" +
              (this.props.result.photos[0] !== undefined
                ? this.props.result.photos[0]["medium"]
                : "https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/47704338/1/?bust=1585940134&amp;width=600") +
              "')"
          }}
        />
        <p className="thumbnail-info">
          <span className="name">{this.props.result.name}</span>
          <br />
          <span className="byline">
            {this.props.result.age}
            <br />
            {this.props.result.breeds.primary}
            <br />
            {this.props.result.distance < 1
              ? this.props.result.distance.toFixed(1)
              : this.props.result.distance.toFixed(0)}{" "}
            miles away
          </span>
        </p>
      </div>
    );
  }
}

export default Thumbnail;
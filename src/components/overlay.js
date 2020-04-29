import React from "react";
import Alert from "./alert.js";
import Animal from "./animal.js";

class Overlay extends React.Component {
  componentDidMount() {
    let overlay = document.getElementById("overlay");
    overlay.classList.toggle("invisible");
  }

  render() {
    let type = null;
    if (this.props.overlay !== null) {
      type = this.props.overlay.type.toLowerCase();
    }

    return (
      <div id="overlay" className="invisible">
        {(() => {
          switch (type) {
            case "alert":
              return <Alert content={this.props.overlay.content} />;
            case "animal":
							return <Animal profile={this.props.overlay.content.result} showOverlay={this.props.showOverlay}/>;
            default:
              return null;
          }
        })()}
      </div>
    );
  }
}

export default Overlay;

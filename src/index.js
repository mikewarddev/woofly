// Imports ========================================
import React from "react";
import ReactDOM from "react-dom";
import credentials from "./credentials.js";
import "./index.css";
import Loader from "./components/loader.js";
import Header from "./components/header.js";
import SearchBar from "./components/search-bar.js";
import Main from "./components/main.js";
import Footer from "./components/footer.js";

// Components ========================================
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      home: true,
      activeSearch: true,
      alert: null,
      results: []
    };
    this.getToken = this.getToken.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.getUserLocation = this.getUserLocation.bind(this);
    this.setSearchParams = this.setSearchParams.bind(this);
    this.search = this.search.bind(this);
    this.goHome = this.goHome.bind(this);
    this.toggleActiveSearch = this.toggleActiveSearch.bind(this);
  }

  getToken() {
    let app = this;
    fetch("https://api.petfinder.com/v2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      body:
        "grant_type=client_credentials&client_id=" +
        credentials.clientID +
        "&client_secret=" +
        credentials.clientSecret
    })
      .then(function(response) {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }

        response.json().then(function(data) {
          app.setState({
            access_token: data.access_token
          });
          if (!document.location.pathname.match(/\/\d{8}/)) {
            app.getTypes.bind(app, data.access_token);
            app.getTypes(data.access_token);
          } else {
            app.getProfile();
          }
        });
      })
      .catch(error => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }

  getTypes(access_token) {
    let app = this;
    fetch("https://api.petfinder.com/v2/types", {
      headers: {
        Authorization: "Bearer " + access_token
      }
    })
      .then(function(response) {
        if (response.status !== 200) {
          console.log(
            "Looks like there was a problem. Status Code: " + response.status
          );
          return;
        }

        response.json().then(function(data) {
          app.setState({
            activeSearch: false,
            types: data.types
          });
        });
      })
      .catch(error => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }

  showAlert(alert) {
    if (alert !== null) {
      document.body.classList.add("no-scroll");
      this.setState({
        alert: alert,
        activeSearch: false
      });
    } else {
      document.body.classList.remove("no-scroll");
      this.setState({
        activeSearch: false,
        alert: null
      });
    }
  }

  getUserLocation() {
    let index = this;
    index.showAlert({ message: "Getting your location...", buttons: [] });
    navigator.geolocation.getCurrentPosition(showPosition);

    function showPosition(position) {
      if (document.querySelector(".search-bar")) {
        document.querySelector(".search-bar").classList.add("expanded");
      }
      index.setState({
        userLocale: {
          lat: position.coords.latitude,
          long: position.coords.longitude
        }
      });
      document.querySelector(".locale").value = "Your Location";
      index.setSearchParams(true);
    }
  }

  setSearchParams(newSearch) {
    let locale = document.querySelector(".locale").value;

    if (locale !== "") {
      let typeSelect = document.querySelector(".type-select");
      let type = typeSelect.value;
      let name = typeSelect.options[typeSelect.selectedIndex].text;
      switch (name) {
        case "Small & Furry":
        case "Barnyard":
          name = name + " Animals";
          break;
        default:
          name = name + "s";
          break;
      }

      let distance = null;
      let distanceBtns = document.querySelectorAll('input[name="distance"]');
      for (let i = 0; i < distanceBtns.length; i++) {
        if (distanceBtns[i].checked) {
          distance = distanceBtns[i].value;
        }
        if (
          distanceBtns[i] === distanceBtns[distanceBtns.length - 1] &&
          distance == null
        ) {
          distance = 25;
          document.querySelector(
            'input[name="distance"][value="25"]'
          ).checked = true;
        }
      }

      let results = this.state.results;
      if (this.state.searchParams) {
        if (type !== this.state.searchParams.type) {
          results = [];
        }
      }

      this.setState({
        newSearch: true,
        searchParams: {
          distance: distance,
          locale: locale,
          type: type,
          name: name
        },
        results: results
      });
    } else {
      this.showAlert({
        message:
          "Please enter a location order to search. Or we can get your location for you.",
        buttons: [
          {
            action: () => {
              this.getUserLocation();
            },
            text: "Yes, get my location"
          },
          {
            action: () => {
              this.showAlert(null);
            },
            text: "No, thanks. I'll just type it in"
          }
        ]
      });
    }
  }

  search() {
    if (this.state.newSearch) {
      this.setState({
        newSearch: false
      });
    }
    let pageNum = null;
    if (this.state.newSearch) {
      pageNum = 1;
    } else {
      pageNum = getPageNum(this);
    }

    if (pageNum) {
      let app = this;
      let locale = null;
      if (this.state.searchParams.locale !== "Your Location") {
        locale = this.state.searchParams.locale;
      } else {
        locale = this.state.userLocale.lat + "," + this.state.userLocale.long;
      }
      fetch(
        "https://api.petfinder.com/v2/animals?type=" +
          this.state.searchParams.type +
          "&location=" +
          locale +
          "&distance=" +
          this.state.searchParams.distance +
          "&page=" +
          pageNum +
          "&limit=20&sort=distance",
        {
          headers: {
            Authorization: "Bearer " + this.state.access_token
          }
        }
      )
        .then(function(response) {
          if (response.status !== 200) {
            app.showAlert({
              message:
                "We're having trouble finding your location. Would you like us to get your location for you?",
              buttons: [
                {
                  action: () => {
                    app.getUserLocation();
                  },
                  text: "Yes!"
                },
                {
                  action: () => {
                    app.showAlert(null);
                  },
                  text: "No, thanks. I'll just type it in"
                }
              ]
            });
            console.log(
              "Looks like there was a problem. Status Code: " + response.status
            );
            return;
          }

          response.json().then(function(data) {
            if (document.getElementById("alert")) {
              app.showAlert(null);
            }
            if (data.animals.length > 0) {
              app.setState({
                home: false,
                activeSearch: false,
                newSearch: false,
                searchParams: app.state.searchParams,
                results: app.state.results.concat(data.animals)
              });
            } else {
              app.showAlert({
                message:
                  "It looks like we can't find any animals that match your search. Setting a wider distance may help.",
                buttons: [
                  {
                    action: () => {
                      app.showAlert(null);
                    },
                    text: "Okay, thanks!"
                  }
                ]
              });
            }
            //app.props.getBreeds(app.state.searchParams.type);
          });
        })
        .catch(error => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    }

    // Determine which page number to use for API lookup
    function getPageNum(component) {
      let page = component.state.results.length / 20 + 1;
      if (Number.isInteger(page)) {
        return page;
      } else {
        return null;
      }
    }
  }

  toggleActiveSearch() {
    this.setState({
      activeSearch: !this.state.activeSearch
    });
  }

  goHome() {
		document.body.classList.remove('no-scroll');
		window.scrollTo(0, 0);
    this.setState({
      home: true,
      activeSearch: false,
      alert: null,
      results: []
    });
  }

  componentDidMount() {
    this.getToken();
  }

  componentDidUpdate() {
    if (this.state.newSearch && this.state.searchParams) {
      this.search();
    }
  }

  render() {
    return (
      <div id="app" className={this.state.home ? "home" : null}>
        {this.state.home ? (
          <Header />
        ) : (
          <SearchBar
            goHome={this.goHome}
            types={this.state.types}
            searchParams={this.state.searchParams}
            setSearchParams={this.setSearchParams}
            toggleActiveSearch={this.toggleActiveSearch}
          />
        )}
        {!this.state.activeSearch ? (
          <div style={{ height: "100%" }}>
            <Main
              types={this.state.types}
              access_token={this.state.access_token}
              showAlert={this.showAlert}
              getUserLocation={this.getUserLocation}
              setSearchParams={this.setSearchParams}
              searchParams={this.state.searchParams}
              search={this.search}
              results={this.state.results}
              toggleActiveSearch={this.toggleActiveSearch}
              goHome={this.goHome}
              alert={this.state.alert}
            />
            {this.state.home ? <Footer /> : null}
          </div>
        ) : (
          <Loader mainLoader={true} />
        )}
      </div>
    );
  }
}

// Render DOM ========================================
ReactDOM.render(<App />, document.getElementById("root"));

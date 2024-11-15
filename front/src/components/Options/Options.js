import React from "react";
// Import components
import App from "../App";
import TinyLoader from "../TinyLoader/TinyLoader";
// Import styles
import "./Options.css";

export default class Options extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // DATAS
      userLogged: props.userLogged,
      optionsFor: props.for,
      // OPTIONS
      isLoading: false, // Active for all get request
    };
    this.logout = this.logout.bind(this);
  }

  logout() {
    if (window.confirm("You will be logged out...\nAre you sure?")) {
      sessionStorage.clear();
      App.ReloadApp();
    }
  }

  setOptions() {
    const { optionsFor } = this.state;
    // const { optionsFor, userLogged } = this.state;
    if (optionsFor === "Avatar") {
      return (
        <>
          <ul className="options article">
            <li
              className="edit"
              id={"Profile"}
              onClick={this.props.navigateTo}
            >
              <i className="fa-solid fa-user"></i> Profile
            </li>
            <li className="delete" onClick={this.logout}>
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </li>
          </ul>
        </>
      );
    }
    return null; // Return null if no options should be displayed
  }

  render() {
    const { isLoading } = this.state;
    return (
      <>
        {!isLoading ? (
          this.setOptions()
        ) : (
          <ul className="options article">
            <TinyLoader />
          </ul>
        )}
      </>
    );
  }
}

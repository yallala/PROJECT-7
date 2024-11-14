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
      commentId: props.commentId,
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
    const { optionsFor, commentId, userLogged } = this.state;
    switch (optionsFor) {
      case "Avatar":
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
              {userLogged.isAdmin ? (
                <>
                  <li
                    className="edit middle"
                    id={"Admin"}
                    onClick={this.props.navigateTo}
                  >
                    <i className="fa-solid fa-screwdriver-wrench"></i>{" "}
                    Administration
                  </li>
                </>
              ) : null}
              <li className="delete" onClick={this.props.logout}>
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </li>
            </ul>
          </>
        );

      // Comment Edit and Delete
      default:
        return (
          <>
            <ul className="options article">
              <li className="edit" onClick={this.props.onEditClick}>
                <i className="fa-solid fa-pencil"></i> Edit
              </li>
              <li
                className="delete"
                value={commentId}
                onClick={this.props.onDeleteClick}
              >
                <i className="fa-solid fa-trash"></i> Delete
              </li>

              {/* {commentId ? (
                <>
                  <li
                    className="delete"
                    value={commentId}
                    onClick={this.props.onDeleteClick}
                  >
                    <i className="fa-solid fa-trash"></i> Delete
                  </li>
                </>
              ) : (
                <>
                  <li className="delete" onClick={this.props.onDeleteClick}>
                    <i className="fa-solid fa-trash"></i> Delete
                  </li>
                </>
              )} */}
            </ul>
          </>
        );
    }
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

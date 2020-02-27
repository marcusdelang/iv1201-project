import React, { Fragment, useReducer } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import styles from "../resources/styles/signup.js";

class AppNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderLogout() {
    const { changeAppState } = this.props;
    return (
      <Fragment>
        <Button
          className="ls"
          onClick={() => (
            changeAppState("auth", false),
            changeAppState("user", false),
            changeAppState("role", false),
            changeAppState("applicationExists", false),
            localStorage.clear()
          )}
        >
          Logout
        </Button>
      </Fragment>
    );
  }
  /*
  printLocalStorage(){
    console.log("I am happening")
   let keys = Object.keys(localStorage),
    i = keys.length;
    while ( i-- ) {
      console.log(keys[i])
    }
  }
  */

  renderLoggedInUser() {
    const { applicationExists } = this.props.appState;
    if (!applicationExists) {
      return (
        <Fragment>
          <Nav.Link href="/application">Show Application</Nav.Link>
          <Nav.Link href="/createApplication">Create Application</Nav.Link>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Nav.Link href="/application">Show Application</Nav.Link>
        </Fragment>
      );
    }
  }

  renderLoggedInRecruiter() {
    return (
      <Fragment>
        <Nav.Link href="/applications">Show Applications</Nav.Link>
      </Fragment>
    );
  }

  renderLoggedOut() {
    return (
      <Fragment>
        <Nav.Link href="/login">Login</Nav.Link>
        <Nav.Link href="/signup">Signup</Nav.Link>
      </Fragment>
    );
  }

  render() {
    const { appState } = this.props;
    return (
      <div>
        <Navbar
          className="justify-content-between"
          style={{ background: "white" }}
          expand="lg"
        >
          <Navbar.Brand href="/home">RecApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              {!appState.auth && this.renderLoggedOut()}
              {appState.role == 2 && this.renderLoggedInUser()}
              {appState.role == 1 && this.renderLoggedInRecruiter()}
            </Nav>
            {appState.auth && this.renderLogout()}
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default AppNavbar;

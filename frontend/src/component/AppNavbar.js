import React, { Fragment } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

import styles from "../resources/styles/signup.js";


class AppNavbar extends React.Component {

  renderLogout(){
    return(
      <Fragment>
        <Button className='ls' onClick={() => (this.props.changeAppState('auth', false), localStorage.removeItem('auth', false))}>Logout</Button>
      </Fragment>
    );
  }

  renderLoggedIn(){
    return(
      <Fragment>
        <Nav.Link href="/application">Show Application</Nav.Link>
        <Nav.Link href="/createApplication">Create Application</Nav.Link>
      </Fragment>
    );
  }

  renderLoggedOut(){
    return(
      <Fragment>
        <Nav.Link href="/login">Login</Nav.Link>
        <Nav.Link href="/signup">Signup</Nav.Link>
      </Fragment>
    );
  }

  render() {
    return (
      <div>
        <Navbar className="justify-content-between" style={{"background":"white"}}>
          <Navbar.Brand href="/home">RecApp</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            {!this.props.appState.auth && this.renderLoggedOut() || this.renderLoggedIn()}
          </Nav>
            {this.props.appState.auth && this.renderLogout()}
        </Navbar>
      </div>
    );
  }
}

export default AppNavbar;

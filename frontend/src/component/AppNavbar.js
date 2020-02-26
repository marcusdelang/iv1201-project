import React, { Fragment, useReducer } from "react";
import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner'

import styles from "../resources/styles/signup.js";


class AppNavbar extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      role: this.props.appState.role
    }
  }

  renderLogout(){
    return(
      <Fragment>
        <Button className='ls' onClick={() => (this.props.changeAppState('auth', false), localStorage.clear())}>Logout</Button>
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
        return(
          <Fragment>
            <Nav.Link href="/application">Show Application</Nav.Link>
          </Fragment>
        );
      

 {

    }
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
    const {appState} = this.props
    console.log(appState)
    return (
      <div>
        <Navbar className="justify-content-between" style={{"background":"white"}} expand="lg">
          <Navbar.Brand href="/home">RecApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">


          <Nav className="mr-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            {!appState.auth && this.renderLoggedOut() || this.renderLoggedIn()}
          </Nav>
   
            {this.props.appState.auth && this.renderLogout()}
  </Navbar.Collapse>










        </Navbar>
      </div>
    );
  }
}

export default AppNavbar;

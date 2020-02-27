import React from "react";
import Form from "react-bootstrap/Form";
import { Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";

import styles from "../resources/styles/standardLayoutStyles";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  handler = async e => {
    const { id, value } = await e.target;
    this.setState({
      [id]: value
    });
  };

  login = async e => {
    e.preventDefault();
    if (this.state.username !== "" && this.state.password !== "") {
      try {
        const response = await axios.post("/api/login", {
          username: this.state.username,
          password: this.state.password
        });
        const { changeAppState, checkApplicationExist } = this.props;
        changeAppState("auth", response.data.auth);
        changeAppState("user", response.data.user);
        const user = JSON.parse(response.data.user);
        changeAppState("role", user.role);
        checkApplicationExist();
        delete this.state.submitError;
      } catch (error) {
        const { status, data } = error.response;
        if (status === 401 && data.cause === "invalid") {
          this.setState({ submitError: "Incorrect password" });
        } else if (status === 401 && data.cause === "no user") {
          this.setState({ submitError: "User does not exist" });
        } else if (status === 500) {
          this.setState({ submitError: "Server problem, please try again" });
        }
      }
    }
  };
  render() {
    if (this.props.appState.auth) {
      return <Redirect to="/home" />;
    }

    return (
      <div style={styles.container}>
        <Card style={styles.card}>
          <Card.Body>
            <Form onSubmit={this.login}>
              <Form.Label>
                <h1>LOGIN</h1>
              </Form.Label>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  required
                  type="username"
                  placeholder="Username"
                  onChange={this.handler}
                />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Password"
                  onChange={this.handler}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
              <p>{this.state.submitError}</p>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Login;

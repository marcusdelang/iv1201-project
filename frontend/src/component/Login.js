import React from "react";
import Form from "react-bootstrap/Form";
import { Redirect } from "react-router-dom";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";

import styles from "../resources/styles/standardLayoutStyles";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
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
    console.log(this.state);
    if (this.state.username !== "" && this.state.password !== "") {
      const response = await axios.post("/api/login", {
        username: this.state.username,
        password: this.state.password
      });
      this.setState({ status: response.status });
      if (response.status === 401) {
        //   console.log(response.statusText)
      } else if (response.status === 200) {
        this.props.changeAppState("auth", response.data.auth);
        this.props.changeAppState("user", response.data.user);
      }
    } else {
      console.log("invalid input");
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
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Login;

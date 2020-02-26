import React from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";
import axios from "axios";

import styles from "../resources/styles/standardLayoutStyles";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: "",
      ssn: "",
      name: "",
      surname: "",
      errors: {}
    };
  }

  handleChange = async e => {
    const { id, value } = await e.target;
    this.setState({
      [id]: value
    });
  };

  isNumeric(value) {
    return /^-{0,1}\d+$/.test(value);
  }
  validateSSN(ssn) {
    console.log(ssn.length, this.isNumeric(ssn))
    if (!this.isNumeric(ssn) || ssn.length != 10) {
      return { numeric: false, error: "SSN can only be a 10 digit number" };
    } else {
      return { numeric: true, error: null };
    }
  }

  submitForm = async e => {
    e.preventDefault();
    const { numeric, error } = this.validateSSN(this.state.ssn);
    if (!numeric) {
      this.setState({ submitError: error });
      e.stopPropagation();
    } else {
      console.log(this.state);
      const { name, surname, ssn, email, username, password } = this.state;
      try{
        const response = await axios.post("http://localhost:80/api/user", {
          user: {
            name: name,
            surname: surname,
            ssn: ssn,
            email: email,
            username: username,
            password: password
          }
        });
        this.setState({ status: response.status });
        delete this.state.submitError;
      } catch(error){
        console.log(error.response)
      }
      }
  };

  render() {
    if (this.props.appState.auth) {
      return <Redirect to="/home" />;
    } else if (this.state.status === 201) {
      return (
        <Redirect
          to={{
            pathname: "/home",
            state: { signup: "success" }
          }}
        />
      );
    }
    return (
      <div style={styles.container}>
        <Card style={styles.card}>
          <Card.Body>
            <Form onSubmit={this.submitForm}>
              <Form.Label>
                <h1>SIGNUP</h1>
              </Form.Label>
              <Form.Row>
                <Form.Group style={styles.formField} controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    required
                    as="input"
                    type="username"
                    placeholder="username"
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Password"
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Email@domain.com"
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Row>
                <Form.Group style={styles.formField} controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    required
                    type="name"
                    placeholder="Name"
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group style={styles.formField} controlId="surname">
                  <Form.Label>Surname</Form.Label>
                  <Form.Control
                    required
                    type="surname"
                    placeholder="Surname"
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="ssn">
                  <Form.Label>Social Security Number</Form.Label>
                  <Form.Control
                    required
                    type="ssn"
                    placeholder="YYMMDDXXXX"
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </Form.Row>
              <Button variant="primary" type="submit">
                Signup
              </Button>
              <Form.Row>{this.state.submitError}</Form.Row>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Signup;

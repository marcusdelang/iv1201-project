import React from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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

  //checks if a string or a number is a number
  isNumeric(value) {
    return /^-{0,1}\d+$/.test(value);
  }

  //Validates the SSN to 10 digit number
  validateSSN(ssn) {
    if (!this.isNumeric(ssn) || ssn.toString().length !== 10) {
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
      const { name, surname, ssn, email, username, password } = this.state;
      try {
        const response = await axios.post("/api/user", {
          user: {
            name: name,
            surname: surname,
            ssn: ssn,
            email: email,
            username: username,
            password: password
          }
        });
        toast.success("Signup was successful, now log in!", {
          position: toast.POSITION.TOP_CENTER
        });
        this.setState({ status: response.status });
        delete this.state.submitError;
      } catch (error) {
        const { status, data } = error.response;
        if (status === 409) {
          this.setState({ submitError: data.field + " already exists" });
        } else if (status === 500) {
          this.setState({ submitError: "Server problem, try again" });
        }
      }
    }
  };

  render() {
    const {handler} = this.props
    if (this.props.appState.auth || this.state.status === 201) {
      return <Redirect to="/home" />;
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
                    onChange={handler.bind(this)}
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="Password"
                    onChange={handler.bind(this)}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Email@domain.com"
                  onChange={handler.bind(this)}
                />
              </Form.Group>
              <Form.Row>
                <Form.Group style={styles.formField} controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    required
                    type="name"
                    placeholder="Name"
                    onChange={handler.bind(this)}
                  />
                </Form.Group>
                <Form.Group style={styles.formField} controlId="surname">
                  <Form.Label>Surname</Form.Label>
                  <Form.Control
                    required
                    type="surname"
                    placeholder="Surname"
                    onChange={handler.bind(this)}
                  />
                </Form.Group>
                <Form.Group controlId="ssn">
                  <Form.Label>Social Security Number</Form.Label>
                  <Form.Control
                    required
                    type="ssn"
                    placeholder="YYMMDDXXXX"
                    onChange={handler.bind(this)}
                  />
                </Form.Group>
              </Form.Row>
              <Button variant="primary" type="submit">
                Signup
              </Button>
              <Form.Row><p style={styles.error}>{this.state.submitError}</p></Form.Row>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Signup;

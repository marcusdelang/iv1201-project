import React from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {Redirect} from 'react-router-dom';
import axios from 'axios';

import styles from "../resources/styles/standardLayoutStyles";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        username: '',
        password: '',
        email: '',
        ssn: '',
        name: '',
        surname: '',
        validated: false,
        errors: {}
    }
}

handleChange = e => {
    const {id, value} = e.target;
    this.setState({
        [id]: value
    })/*
    if (id === 'ssn') {
            const errors =
                value.length < 10
                    ? 'Has to be a 10 digit number!'
                    : ''
    this.setState({ errors, [id]: value }, () => {
        console.log(errors)
    })
    }  */
}

submitForm = async (e) => {
e.preventDefault();
const form = e.currentTarget;
if (form.checkValidity() === false) {
    e.stopPropagation();       
    this.setState({ validated: true });
} else {
    console.log(this.state)
    const {name, surname, ssn, email, username, password} = this.state
    const response = await axios.post('/api/user', {
        user: {
            name: name,
            surname: surname,
            ssn: ssn,
            email: email,
            username: username,
            password: password
        }
    })            
    this.setState({ validated: false });
    //console.log(this.state)
    //console.log(response.status);
    this.setState({status: response.status})
}
}

  render() {
    if(this.props.appState.auth){
      return <Redirect to="/home" />
    } else if(this.state.status === 201){
      return <Redirect to={{
          pathname: '/home',
          state: { signup: 'success'}
      }} />
  }
    return (
      <div style={styles.container}>
        <Card style={styles.card}>
          <Card.Body>
            <Form onSubmit={this.submitForm}>
            <Form.Label><h1>SIGNUP</h1></Form.Label>
            <Form.Row>
              <Form.Group style={styles.formField} controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control as='input' type="username" placeholder="username" onChange={this.handleChange}  />
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={this.handleChange} />
              </Form.Group>
              </Form.Row>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email@domain.com" onChange={this.handleChange} />
              </Form.Group>
            <Form.Row>
            <Form.Group style={styles.formField}  controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="name" placeholder="Name" onChange={this.handleChange} />
              </Form.Group>
              <Form.Group style={styles.formField}  controlId="surname">
                <Form.Label>Surname</Form.Label>
                <Form.Control type="surname" placeholder="Surname" onChange={this.handleChange} />
              </Form.Group>
              <Form.Group controlId="ssn">
                <Form.Label>Social Security Number</Form.Label>
                <Form.Control type="ssn" placeholder="YYMMDDXXXX" onChange={this.handleChange} />
              </Form.Group>
            </Form.Row>
            <Button variant="primary" type="submit">
          Signup
        </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default Signup;

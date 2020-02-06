import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

const columnMargin = { marginRight: '10px' };

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
        })
        const errors = this.state.errors;

        if (id === 'ssn') {
                errors.ssn =
                    value.length < 10
                        ? 'Has to be a 10 digit number!'
                        : ''
        this.setState({ errors, [id]: value }, () => {
            console.log(errors)
        })
        }

        
    }

submitForm = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
        e.stopPropagation();
        console.log("invalid");
        console.log(this.state)        
        this.setState({ validated: true });
    } else {
        const response = await axios.post('http://130.229.141.80:3001/api/user', {
            user: {
                name: this.state.name,
                surname: this.state.surname,
                ssn: this.state.ssn,
                email: this.state.email,
                username: this.state.username,
                password: this.state.password
            }
        })            
        this.setState({ validated: false });
        console.log(response.status);
        this.setState({status: response.status})
    }
}
render() {
    if(this.state.status === 201){
        return <Redirect to={{
            pathname: '/home',
            state: { signup: 'success'}
        }} />
    }
    return (
        <div>
        <Card style={{ margin: "10vh 25vw 10vh 25vw" }}>
            <Card.Body>
                <Form noValidate validated={this.state.validated} onSubmit={this.submitForm}>
                    <Form.Row>
                        <Form.Group style={columnMargin} as='Col' controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                required
                                as='input' 
                                type="username" 
                                placeholder="Enter username"
                                onChange={this.handleChange} 
                                />
                            <Form.Control.Feedback type="invalid">
                                Please enter a username
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as='Col' controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control required as='input' type="password" placeholder="Password" onChange={this.handleChange} />
                            <Form.Control.Feedback type="invalid">
                                Please enter a password
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as='Col' controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control required as='input' type="email" placeholder="Enter email" onChange={this.handleChange} />
                            <Form.Control.Feedback type="invalid">
                                pleaser choose a valid email
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>

                        <Form.Group style={columnMargin} as='Col' controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control required as='input' placeholder="Enter name" onChange={this.handleChange} />
                            <Form.Control.Feedback type="invalid">
                                please choose a valid
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group style={columnMargin} as='Col' controlId="surname">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control required as='input' placeholder="Enter surname" onChange={this.handleChange} />
                            <Form.Control.Feedback type="invalid">
                                please enter your surname
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group style={columnMargin} as='Col' controlId="ssn">
                            <Form.Label>Social Security Number</Form.Label>
                            <Form.Control isInvalid={this.state.errors} required as="input" placeholder="yymmdd-xxxx" onChange={this.handleChange} />
                            <Form.Control.Feedback type="invalid">
                                {this.state.errors.ssn}
                            </Form.Control.Feedback>
                        </Form.Group>

                    </Form.Row>

                    <Button variant="primary" type="submit" >
                        Submit
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        {this.state.status === 404 || 400 ? <h1> ERROR {this.state.status} </h1> : ''}
        </div>
    );
}
}

export default Signup;
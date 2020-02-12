import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import { thisTypeAnnotation } from '@babel/types';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const columnMargin = { marginRight: '10px' };

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state ={
                username: '',
                password: '',
                status: ''
        }
    }

    componentDidUpdate(){
     //   console.log(this.state)
    }

    onSubmit = async () => {
        if(this.state.username !== '' && this.state.password !== ''){
            const response = await axios.post('http://130.229.159.204:3000/api/login', {
                        username: this.state.username,
                        password: this.state.password
                    }, cookies.get('auth')&&{headers:{
                        'auth': cookies.get('auth')
                    }    
                    });
            this.setState({status: response.status});
            if(response.status === 401){
             //   console.log(response.statusText)
            }
            else if(response.status === 200){
                this.props.changeAppState('auth', response.data.auth);
                this.props.changeAppState('user', response.data.user);
                cookies.set('auth', response.data.auth, {path: '/'});
                cookies.set('user', response.data.user, {path: '/'});
                //this.props.updateAppState();
            }
        } else{
            console.log("invalid input");
        }
    
    }


    render(){
        if(this.state.status === 200){
            return <Redirect to={{
                pathname: '/home',
                state: { login: 'success'}
            }} />
        }
        return(
            <div>
                <Card style={{ }}>
                    <Card.Body>
                        <Form noValidate onSubmit={this.submitForm}>
                            <Form.Row>
                                <Form.Group style={columnMargin} as='Col' controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        required
                                        as='input' 
                                        type="username" 
                                        placeholder="Enter username"
                                        onChange={this.props.handleChange.bind(this)} 
                                        />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a username
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as='Col' controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control  
                                        required as='input' 
                                        type="password" 
                                        placeholder="Password" 
                                        onChange={this.props.handleChange.bind(this)} />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a password
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Button variant="primary" onClick={this.onSubmit} >
                                Submit
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        ); 
    }
}

export default Login;
import React from 'react';
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import FormControl from "react-bootstrap/FormControl";
import { Redirect } from "react-router-dom";

import styles from "../../resources/styles/standardLayoutStyles";
class SelectDay extends React.Component{
    buildDaysArray(numberOfDays){
        let days = new Array(numberOfDays);
        for(let i = 0; i < numberOfDays;i++){
            days.push(i+1);
        }
        return days
    }
    render(){
        return (
            <Form.Group controlId={this.props.controlId} style={styles.formField}>
            <Form.Label>{this.props.label}</Form.Label>
            <Form.Control
              as="select"
              onChange={this.props.handler}
              ref={this.props.ref}
            >
              {this.props.renderOptions(this.buildDaysArray(this.props.days))}
            </Form.Control>
          </Form.Group>
        );
    }
}

export default SelectDay;
import React, { Fragment } from "react";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button"
import Axios from "axios";

class UserApplication extends React.Component {

  renderCompetences() {
    const { competences } = this.props.application;
    return competences.map((comp, index) => (
      <Card key={comp.competence_profile_id}>
        <Card.Body>
          <Row>
            <Col>Competence: {comp.competence}</Col>
            <Col>Years of experience: {comp.years_of_experience}</Col>
          </Row>
        </Card.Body>
      </Card>
    ));
  }

  renderAvailabilities() {
    const { availabilities } = this.props.application;
    return availabilities.map((availability, index) => (
      <Card key={availability.availability_id}>
        <Card.Body>
          <Row>
            <Col>From: {availability.from_date}</Col>
            <Col>To: {availability.to_date}</Col>
          </Row>
        </Card.Body>
      </Card>
    ));
  }

  renderControls = () => {
    return(
      <Fragment>
        <Row>
          <Col style={{ fontWeight: "bold" }}>Status: {this.props.application.status}</Col>
        </Row>
        <Button variant="success">Accept</Button>
        <Button variant="danger">Reject</Button>  
      </Fragment>
    );
  }

  updateStatus = () => {
    
  }

  render() {
    const { name, surname, ssn, email, username } = this.props.user;
    return (
        <Card style={{marginTop: "10px"}}>
          <Card.Body>
            <Row>
              <Col>Applicant: {name + " " + surname}</Col>
              <Col>SSN: {ssn}</Col>
            </Row>
            <Row>
              <Col>Username: {username}</Col>
              <Col>Email: {email}</Col>
            </Row>
            <Row>
              <Col style={{ fontWeight: "bold" }}>Competences</Col>
            </Row>
            {this.renderCompetences()}
            <Row>
              <Col style={{ fontWeight: "bold" }}>Availabilities</Col>
            </Row>
            {this.renderAvailabilities()}
          </Card.Body>
          {this.renderControls()}
        </Card>
    );
  }
}

export default UserApplication;

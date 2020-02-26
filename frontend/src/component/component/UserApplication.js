import React, { Fragment } from "react";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

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
    return availabilities.map((avail, index) => (
      <Card key={avail.availability_id}>
        <Card.Body>
          <Row>
            <Col>From: {avail.from_date}</Col>
            <Col>To: {avail.to_date}</Col>
          </Row>
        </Card.Body>
      </Card>
    ));
  }
  render() {
    console.log(this.props);
    const { name, surname, ssn, email, username } = this.props.user;
    return (
      <Fragment>
        <h1 style={{ color: "white" }}>Application</h1>
        <Card>
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
        </Card>
      </Fragment>
    );
  }
}

export default UserApplication;

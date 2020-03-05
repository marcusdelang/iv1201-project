import React, { Fragment } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import axios from "axios";

/*
* Represents one application
*/
class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.application.status,
      updated: false
    };
  }
  //Updates the status on an application
  updateStatus = async status => {
    const { version, person } = this.props.application;
    try {
      await axios.put(
        "/api/application",
        { person: person.id, version, status },
        { headers: { auth: localStorage.getItem("auth") } }
      );
      this.setState({ status: status });
      this.setState({ updated: true });
      delete this.state.changeStatusError;
    } catch (error) {
      console.log(error);
      const { status } = error.response;
      if (status === 400) {
        this.setState({
          changeStatusError: "try again incorrect information was sent"
        });
      } else if (status === 401) {
        this.setState({ changeStatusError: "You are not logged in" });
      } else if (status === 403) {
        this.setState({
          changeStatusError: "You don't have persmission, login as recruiter"
        });
      } else if (status === 409) {
        this.setState({
          changeStatusError:
            "The application you have seen is not updated, try again"
        });
      } else if (status === 500) {
        this.setState({
          changeStatusError: "There was problem on the server try again"
        });
      }
    }
  };
  renderCompetences() {
    const { competences } = this.props.application;
    return competences.map(comp => (
      <Card key={comp.name}>
        <Card.Body>
          <Row>
            <Col>Competence: {comp.name}</Col>
            <Col>Years of experience: {comp.years_of_experience}</Col>
          </Row>
        </Card.Body>
      </Card>
    ));
  }

  renderAvailabilities() {
    const { availabilities } = this.props.application;
    return availabilities.map((availability, index) => (
      <Card key={index}>
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
    return (
      <Fragment>
        <Button
          variant="success"
          onClick={() => {
            this.updateStatus("accepted");
          }}
        >
          Accept
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            this.updateStatus("rejected");
          }}
        >
          Reject
        </Button>
      </Fragment>
    );
  };

  render() {
    const { name, surname, email, ssn } = this.props.application.person;
    return (
      <Card style={{ marginTop: "10px" }}>
        <Card.Body>
          <Row>
            <Col>Applicant: {name + " " + surname}</Col>
            <Col>SSN: {ssn}</Col>
          </Row>
          <Row>
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
        <Row>
          <Col style={{ fontWeight: "bold" }}>Status: {this.state.status}</Col>
        </Row>
        {this.props.recruiter && !this.state.updated && this.renderControls()}
        {this.props.recruiter &&
          this.state.updated &&
          "Success, refresh to change status again"}
        {this.state.changeStatusError}
      </Card>
    );
  }
}

export default Application;

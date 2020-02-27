import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";

import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

class ShowApplication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
      user: this.props.appState.user,
      modalShow: false,
    };
  }

  componentDidMount() {
    this.getApplications();
  }

  getApplications = async () => {
    const response = await axios.get(`http://localhost:80/api/application`, {
      headers: { auth: localStorage.getItem("auth") }
    });
    const {} = response.data;
    this.setState({
      applications: response.data
    });
  };

  renderApplication = () => {
    const { applications, user } = this.state;
    return applications.map(app => (
      <Card version={app.version}>
        <Card.Body>
          <Row>
            <Col>Applicant: {app.name + " " + app.surname}</Col>
            <Col>SSN: {app.ssn}</Col>
            <Col>Email: {app.email}</Col>
            <Col>Status: {app.status}</Col>
          </Row>
          <Row>
            <Col>
              <Button size="sm" onClick={this.renderModal}>More information</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    ));
  };

  render() {
    if (!this.props.appState.auth) {
      return <Redirect to="/home" />;
    }
    return (
    <div>
        {this.renderApplication()}
    </div>
    );
  }
}

export default ShowApplication;

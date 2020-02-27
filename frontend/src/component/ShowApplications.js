import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import Button from "react-bootstrap/Button";

import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import UserApplication from './component/UserApplication'


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
    const response = await axios.get(`/api/application`, {
      headers: { auth: localStorage.getItem("auth") }
    });
    const {} = response.data;
    this.setState({
      applications: response.data
    });
  };

  renderApplications = () => {
    const {applications} = this.state
    return applications.map((app)=>
         <UserApplication key={app.person}
            application={app}
            user={app.person}
            recruiter
         />
    );
 }

  render() {
    if (!this.props.appState.auth) {
      return <Redirect to="/home" />;
    }
    return (
    <div>
        <h1 style={{ color: "white" }}>Applications</h1>
        {this.renderApplications()}
    </div>
    );
  }
}

export default ShowApplication;

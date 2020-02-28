import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

import UserApplication from "./innerComponent/Application";
import styles from "../resources/styles/standardLayoutStyles";

class ShowApplication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      applications: [],
      user: this.props.appState.user,
      modalShow: false
    };
  }

  componentDidMount() {
    this.getApplications();
  }

  //Requests applications 
  getApplications = async () => {
    const response = await axios.get(`http://localhost:80/api/application`, {
      headers: { auth: localStorage.getItem("auth") }
    });
    this.setState({
      applications: response.data
    });
  };

  renderApplications = () => {
    const { applications } = this.state;
    return applications.map(app => (
      <UserApplication key={app.person.id} application={app} recruiter />
    ));
  };

  render() {
    if (
      !this.props.appState.auth ||
      !(JSON.parse(this.props.appState.role) === 1)
    ) {
      return <Redirect to="/home" />;
    }
    return (
      <div>
        <h1 style={styles.h1}>Applications</h1>
        {this.renderApplications()}
      </div>
    );
  }
}

export default ShowApplication;

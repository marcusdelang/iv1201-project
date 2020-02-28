import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

import UserApplication from "./innerComponent/UserApplication";

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

  getApplications = async () => {
    const response = await axios.get(`/api/application`, {
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
        <h1 style={{ color: "white" }}>Applications</h1>
        {this.renderApplications()}
      </div>
    );
  }
}

export default ShowApplication;

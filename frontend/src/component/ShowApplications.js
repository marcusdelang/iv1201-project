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
      applications: [
        {
            "person": {
                "id": 1,
                "name": "applicant1",
                "surname": "applicant1",
                "ssn": "12345678-4321",
                "email": "applicant1@applicant.se"
            },
            "version": 1,
            "status": "unhandled",
            "availabilities": [
                {
                    "availability_id": 1,
                    "person": 1,
                    "from_date": "2020-02-01",
                    "to_date": "2020-06-01"
                }
            ],
            "competences": [
                {
                    "competence_profile_id": 1,
                    "person": 1,
                    "competence": 1,
                    "years_of_experience": 2
                }
            ]
        },
        {
            "person": {
                "id": 2,
                "name": "applicant2",
                "surname": "applicant2",
                "ssn": "12345678-4322",
                "email": "applicant2@applicant.se"
            },
            "version": 1,
            "status": "unhandled",
            "availabilities": [
                {
                    "availability_id": 2,
                    "person": 2,
                    "from_date": "2020-03-03",
                    "to_date": "2020-08-01"
                }
            ],
            "competences": [
                {
                    "competence_profile_id": 2,
                    "person": 2,
                    "competence": 3,
                    "years_of_experience": 5
                }
            ]
        }
    ] || response.data
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

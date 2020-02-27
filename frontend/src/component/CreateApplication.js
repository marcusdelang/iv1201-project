import React, { Fragment } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

import SelectField from "./component/SelectField";
import SelectedDates from "./component/SelectDates";

import styles from "../resources/styles/standardLayoutStyles";
class CreateApplication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workOptions: [""],
      workExp: "",
      workExpYears: null,
      storedWorkOptions: [],
      years: ["", 1, 2, 3, 4, 5, 6, 7, 9, 10],
      workPeriod: []
    };
  }

  //Fetches all comptences when the component mounts, server sends 401 
  //if the request is rejected resulting in a error message
  async componentDidMount() {
    try {
      const response = await axios.get("/api/competence", {
        headers: { auth: localStorage.getItem("auth") }
      });
      this.setState({
        workOptions: [...this.state.workOptions, ...response.data]
      });
      delete this.state.competenceError;
    } catch (error) {
      const { status } = error.response.data;
      if (status === 401) {
        this.setState({ competenceError: "You are not logged in, relog" });
      }
    }
  }
  
  renderSelectedPeriod = selected => {
    return selected.map((entry, index) => (
      <Card key={index}>
        <Card.Body>
          <Row>
            <Col>{"Start: " + entry.from}</Col>
            <Col>{"End: " + entry.to}</Col>
          </Row>
        </Card.Body>
      </Card>
    ));
  };

  remove(element, array) {
    const index = array.indexOf(element);
    if (index !== -1) array.splice(index, 1);
    return array;
  }

  //Adds a comptence type and a number of years to an array 
  //and removes the comptence type from the options array from
  //which it was picked from
  addSelected = (type, years, store, options, error) => {
    if (this.state[type] !== "" && this.state[years] !== "") {
      this.setState({
        [store]: [
          ...this.state[store],
          { name: this.state[type], years_of_experience: this.state[years] }
        ],
        [options]: this.remove(this.state[type], this.state[options]),
        [type]: "",
        [years]: ""
      });
      delete this.state[error];
    } else {
      this.setState({ [error]: "That option is not valid, try again" });
    }
  };

  //Handles a change in state, if a string contains only numbers it will store it as a number
  //otherwise only the value will be stored 
  handler = async e => {
    const { id, value } = await e.target;
    this.setState({
      [id]: /^-{0,1}\d+$/.test(value) ? parseInt(value) : value
    });
  };

  renderSelected = selected => {
    return selected.map((entry, index) => (
      <Card key={index}>
        <Card.Body>
          <Row>
            <Col>{entry.name}</Col>
            <Col>{entry.years_of_experience} Years</Col>
          </Row>
        </Card.Body>
      </Card>
    ));
  };
  
  renderOptions = (options, id) => {
    return options.map((option, index) => (
      <option id={id + index} key={index}>
        {option}
      </option>
    ));
  };
  
  addWorkPeriod(startDay, endDay, startMonth, endMonth) {
    this.setState({
      workPeriod: [
        ...this.state.workPeriod,
        {
          from: "2020-" + startMonth + "-" + startDay,
          to: "2020-" + endMonth + "-" + endDay
        }
      ]
    });
  }

  submitApplication = async () => {
    if (this.state.workPeriod.length > 0) {
      const response = await axios.post(
        "/api/application",
        {
          form: {
            availabilities: this.state.workPeriod,
            competences: this.state.storedWorkOptions
          }
        },
        {
          headers: {
            auth: localStorage.getItem("auth")
          }
        }
      );
      if (response.status === 201) {
        toast.success('Application created!');
        delete this.state.submitError;
        this.props.checkApplicationExist();
        this.setState({ submitSuccess: true });
      } else if (response.status === 409) {
        this.setState({
          submitError: "You have already created an application"
        });
      } else if (response.status === 500) {
        this.setState({ submitError: "Server problem, try again" });
      }
    } else {
      this.setState({
        submitError: "You need to atleast add one work period to apply"
      });
    }
  };

  renderForm = () => {
    return (
      <div style={styles.container}>
        <Card style={(styles.card, { minWidth: "400px" })}>
          <Card.Body>
            <Form>
              {this.renderSelected(this.state.storedWorkOptions)}
              {this.state.workOptions.length > 0 ? (
                <Fragment>
                  <SelectField
                    fieldTitles={["Work Experience", "Years"]}
                    buttonName="Add"
                    controlId={["workExp", "workExpYears"]}
                    handler={this.handler.bind(this)}
                    options={[this.state.workOptions, this.state.years]}
                    renderOptions={this.renderOptions}
                    addSelected={() =>
                      this.addSelected(
                        "workExp",
                        "workExpYears",
                        "storedWorkOptions",
                        "workOptions",
                        "workExpError"
                      )
                    }
                    errors={[this.state.workExpError]}
                  />
                  {this.state.competenceError}
                </Fragment>
              ) : (
                ""
              )}
              {this.renderSelectedPeriod(this.state.workPeriod)}
              <SelectedDates
                createAppState={this.state}
                handler={this.handler}
                parentHandler={this.handler.bind(this)}
                selectedDates={this.state.selectedDates}
                renderOptions={this.renderOptions}
                add={this.addWorkPeriod.bind(this)}
              />
              <Form.Row>
                <Button
                  onClick={this.submitApplication}
                  style={{ marginTop: "15px" }}
                  variant="info"
                  size="lg"
                >
                  Apply
                </Button>
              </Form.Row>
              {this.state.submitError}
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  };

  render() {
    const { auth, applicationExists } = this.props.appState;
    if (!auth || applicationExists) {
      return <Redirect to="/home" />;
    } else if (this.state.submitSuccess) {
      return (
        <Redirect
          to={{
            pathname: "/home",
            state: { applySuccess: "success" }
          }}
        />
      );
    }
    return this.renderForm();
  }
}

export default CreateApplication;

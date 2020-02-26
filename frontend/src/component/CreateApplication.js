import React, { Fragment } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import FormControl from "react-bootstrap/FormControl";
import { Redirect } from "react-router-dom";
import axios from "axios";

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

  async componentDidMount() {
    console.log(this.state.workOptions);
    const response = await axios.get("http://localhost:80/api/competence", {
      headers: { auth: localStorage.getItem("auth") }
    });
    console.log(response);
    this.setState({
      workOptions: [...this.state.workOptions, ...response.data]
    });
  }

  remove(ele, arr) {
    let index = arr.indexOf(ele);
    if (index !== -1) arr.splice(index, 1);
    return arr;
  }

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

  handler = async e => {
    const { id, value } = await e.target;
    this.setState({
      [id]: /^-{0,1}\d+$/.test(value) ? parseInt(value) : value
    });
    console.log(this.state);
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
        "http://localhost:80/api/application",
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
      //console.log(response.status)
      if (response.status === 201) {
        delete this.state.submitError;
        this.props.checkApplicationExist()
        this.setState({ submitSuccess: true });
      } else if (response.status === 500) {
        this.setState({ submitError: "error: " + response.status });
      } else {
        this.setState({ submitError: "error: " + response.status });
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
              ) : (
                ""
              )}
              {this.renderSelectedPeriod(this.state.workPeriod)}
              <SelectedDates
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
              {console.log(this.state.submitError)}
              {this.state.submitError}
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  };

  render() {
    const {auth, applicationExists} = this.props.appState
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

import React, { Fragment } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import SelectField from "./innerComponent/SelectField";
import DatePicker from "./innerComponent/DatePicker"

import styles from "../resources/styles/standardLayoutStyles";
class CreateApplication extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workOptions: [""],
      workExp: "",
      workExpYears: "",
      storedWorkOptions: [],
      years: ["", 1, 2, 3, 4, 5, 6, 7, 9, 10],
      workPeriod: []
    };
  }

  async componentDidMount() {
    try {
      const response = await axios.get("http://localhost:80/api/competence", {
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
  addWorkPeriod(newPeriod) {
    this.setState({workPeriod: [...this.state.workPeriod, newPeriod]});
  }

  submitApplication = async () => {
    if (this.state.workPeriod.length > 0) {
      try {
        await axios.post(
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
        delete this.state.submitError;
        this.props.checkApplicationExist();
        this.setState({ submitSuccess: true });
        toast.success("Application created!", {
          position: toast.POSITION.TOP_CENTER
        });
      } catch (error) {
        const { status } = error.response;
        if (status === 409) {
          this.setState({
            submitError: "You have already created an application"
          });
        } else if (status === 500) {
          this.setState({ submitError: "Server problem, try again" });
        }
      }
    } else {
      this.setState({
        submitError: "You need to atleast add one work period to apply"
      });
    }
  };

  renderForm = () => {
    const {renderSelected, renderOptions, addSelected,state, props, renderSelectedPeriod, addWorkPeriod, submitApplication} = this
    const {handler} = props
    const {workOptions, years, workExpError, competenceError, workPeriod, submitError }= state
    return (
      <div style={styles.container}>
        <Card style={(styles.card, { minWidth: "400px" })}>
          <Card.Body>
            <Form>
              {renderSelected(this.state.storedWorkOptions)}
              {state.workOptions.length > 0 ? (
                <Fragment>
                  <SelectField
                    fieldTitles={["Work Experience", "Years"]}
                    buttonName="Add"
                    controlId={["workExp", "workExpYears"]}
                    handler={handler.bind(this)}
                    options={[workOptions, years]}
                    renderOptions={renderOptions}
                    addSelected={() =>
                      addSelected(
                        "workExp",
                        "workExpYears",
                        "storedWorkOptions",
                        "workOptions",
                        "workExpError"
                      )
                    }
                    errors={[workExpError]}
                  />
                  <p style={styles.error}>{competenceError}</p>
                </Fragment>
              ) : (
                ""
              )}
              {renderSelectedPeriod(workPeriod)}
              <DatePicker addWorkPeriod={addWorkPeriod.bind(this)} createAppState={state}/>
              <Form.Row>
                <Button
                  onClick={submitApplication}
                  style={{ marginTop: "15px" }}
                  variant="info"
                  size="lg"
                >
                  Apply
                </Button>
              </Form.Row>
             <p style={styles.error}>{submitError}</p>
            </Form>
          </Card.Body>
        </Card>
      </div>
    );
  };

  render() {
    const { auth, applicationExists } = this.props.appState;
    if (!auth || applicationExists || this.state.submitSuccess) {
      return <Redirect to="/home" />;
    }
    return this.renderForm();
  }
}

export default CreateApplication;

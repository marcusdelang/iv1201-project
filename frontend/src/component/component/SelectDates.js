import React, { Fragment } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import FormControl from "react-bootstrap/FormControl";
import { Redirect } from "react-router-dom";

import SelectDay from "./SelectDay";
import styles from "../../resources/styles/standardLayoutStyles";
class SelectDates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      startMonth: 1,
      startDays: 31,
      endMonth: 1,
      endDays: 31,
      startDay: 1,
      endDay: 1
    };
  }
  componentDidMount() {
    this.generateDays(this.state.month);
  }

  generateDays = month => {
    if (month == 4 || month == 6 || month == 9 || month == 11) {
      return 30;
    } else if (month == 2) {
      return 28;
    } else {
      return 31;
    }
  };

  handler = async e => {
    const { id, value } = await e.target;
    this.setState({
      [id]: value
    });
  };

  renderDay = (days, controlId, label) => {
    return (
      <SelectDay
        renderOptions={this.props.renderOptions}
        handler={this.handler.bind(this)}
        days={days}
        controlId={controlId}
        label={label}
      ></SelectDay>
    );
  };
  add = () => {
    const {dateCheck, props, styleDate, state} = this
    const { startDay, endDay, startMonth, endMonth, dateError } = state;
    const checkDate = dateCheck(startDay, startMonth, endDay, endMonth)
    if(checkDate.check){
      console.log("i am happening 1")
      props.add(this.styleDate(startDay), styleDate(endDay), styleDate(startMonth), styleDate(endMonth));
      delete this.dateError
    } else {
      console.log("i am happening 2")
      this.setState({dateError: checkDate.dateError})
    }
  };

  dateCheck = (startDay, startMonth, endDay, endMonth) => {
    const from = new Date(Date.UTC(2020, startMonth - 1, startDay));
    const to = new Date(Date.UTC(2020, endMonth - 1, endDay));
    if (Date.parse(from) < Date.parse(to)) {
      const { styleDate } = this;
      const newDate = {
        from: "2020-" + styleDate(startMonth) + "-" + styleDate(startDay),
        to: "2020-" + styleDate(endMonth) + "-" + styleDate(endDay)
      };
      for (const element of this.props.createAppState.workPeriod){
        if(JSON.stringify(element) === JSON.stringify(newDate)){
          console.log(JSON.stringify(element) === JSON.stringify(newDate))
          return {check: false, dateError: "You cannot add the same period"}
        }
      }
      return {check: true}
    } else {
      return {check: false, dateError: "Your end date needs to be after your start date"}
    }
  };

  styleDate = number => {
    if (number < 10) return `0${number}`;
    else return `${number}`;
  };
  
  render() {
    const { handler, renderDay,generateDays, add, state, props } = this
    const {startDays,endMonth, startMonth,months, endDays, dateError} = state
    return (
      <Fragment>
        <Form.Row>
          <Form.Group controlId="startMonth" style={styles.formField}>
            <Form.Label>Start Month</Form.Label>
            <Form.Control
              as="select"
              onChange={async e => {
                await handler(e);
                this.setState({
                  startDays: generateDays(startMonth)
                });
              }}
            >
              {props.renderOptions(months)}
            </Form.Control>
          </Form.Group>
          {startDays === 30 &&
            renderDay(30, "startDay", "Start Day")}
          {startDays === 31 &&
            renderDay(31, "startDay", "Start Day")}
          {startDays === 28 &&
            renderDay(28, "startDay", "Start Day")}

          <Form.Group controlId="endMonth" style={styles.formField}>
            <Form.Label>End Month</Form.Label>
            <Form.Control
              as="select"
              onChange={async e => {
                await handler(e);
                this.setState({
                  endDays: generateDays(endMonth)
                });
              }}
            >
              {props.renderOptions(months)}
            </Form.Control>
          </Form.Group>
          {endDays === 30 && renderDay(30, "endDay", "end Day")}
          {endDays === 31 && renderDay(31, "endDay", "end Day")}
          {endDays === 28 && renderDay(28, "endDay", "end Day")}
        </Form.Row>
        <Button onClick={add}>Add</Button>
        <Form.Row>
          {dateError}
        </Form.Row>
      </Fragment>
    );
  }
}

export default SelectDates;

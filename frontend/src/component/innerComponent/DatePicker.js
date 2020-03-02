import React, { Fragment } from "react";
import DatePickerFrame from "react-datepicker";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import "react-datepicker/dist/react-datepicker.css";
import styles from "../../resources/styles/standardLayoutStyles";

class DatePicker extends React.Component {
  state = {
    startDate: new Date("2020/01/01"),
    endDate: new Date("2020/01/01")
  };

  handleChangeStart = date => {
    this.setState({
      startDate: date
    });
  };

  handleChangeEnd = date => {
    this.setState({
      endDate: date
    });
  };

  //changes the date format to YYYY-MM-DD
  formatDate(date) {
    const month = this.styleDate(date.getMonth() + 1);
    const day = this.styleDate(date.getDate());
    const year = date.getFullYear();
    return year + "-" + month + "-" + day;
  }
  //adds a 0 to a number less than 10  so that we get 07 instead of 7
  styleDate = number => {
    if (number < 10) return `0${number}`;
    else return `${number}`;
  };

  //adds a period to the list of available periods
  addWorkPeriod = () => {
    const dateCheck = this.checkDate();
    if (dateCheck.check) {
      this.props.addWorkPeriod(dateCheck.newDate);
      delete this.dateError;
    } else {
      this.setState({ dateError: dateCheck.dateError });
    }
  };
  //Verfies a format on a period, start date need to be before end date
  //and you cannot add a period alrdy added once
  checkDate = () => {
    const { startDate, endDate } = this.state;
    console.log(Date.parse(startDate) < Date.parse(endDate));
    if (Date.parse(startDate) < Date.parse(endDate)) {
      const newDate = {
        from: this.formatDate(startDate),
        to: this.formatDate(endDate)
      };
      for (const element of this.props.createAppState.workPeriod) {
        if (JSON.stringify(element) === JSON.stringify(newDate)) {
          return { check: false, dateError: "You cannot add the same period" };
        }
      }
      delete this.state.dateError;
      return { check: true, newDate: newDate };
    } else {
      return {
        check: false,
        dateError: "Your end date needs to be after your start date"
      };
    }
  };

  render() {
    return (
      <Fragment>
        <Row>
          <Col>From</Col>
          <Col>To</Col>
        </Row>
        <Row>
          <Col>
            <DatePickerFrame
              style={{ marginTop: "15px" }}
              selected={this.state.startDate}
              onChange={this.handleChangeStart}
            />
          </Col>
          <Col>
            <DatePickerFrame
              style={{ marginTop: "15px" }}
              selected={this.state.endDate}
              onChange={this.handleChangeEnd}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button style={{ marginTop: "15px" }} onClick={this.addWorkPeriod}>
              Add
            </Button>
          </Col>
        </Row>
        <p style={styles.error}>{this.state.dateError}</p>
      </Fragment>
    );
  }
}

export default DatePicker;

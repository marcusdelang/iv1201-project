import React, { Fragment } from "react";
import DatePickerFrame from "react-datepicker";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css

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
  formatDate(date) {
    const month = this.styleDate(date.getMonth() + 1);
    const day = this.styleDate(date.getDate());
    const year = date.getFullYear();
    return year + "-" + month + "-" + day;
  }
  styleDate = number => {
    if (number < 10) return `0${number}`;
    else return `${number}`;
  };
  addWorkPeriod = () => {
    const dateCheck = this.checkDate();
    if (dateCheck.check) {
      this.props.addWorkPeriod(dateCheck.newDate);
      delete this.dateError;
    } else {
      this.setState({ dateError: dateCheck.dateError });
    }
  };
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
          <Button 
            style={{ marginTop: "15px" }}
            onClick={this.addWorkPeriod}>
            Add
          </Button>
          </Col>
        </Row>
        {this.state.dateError}
      </Fragment>
    );
  }
}

export default DatePicker;

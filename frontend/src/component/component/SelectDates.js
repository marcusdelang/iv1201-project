import React, { Fragment } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import FormControl from "react-bootstrap/FormControl";
import { Redirect } from "react-router-dom";

import SelectDay from './SelectDay';
import styles from "../../resources/styles/standardLayoutStyles";
class SelectDates extends React.Component {
    constructor(props){
        super(props);
        this.state={
            months: [1,2,3,4,5,6,7,8,9,10,11,12],
            startMonth: 1,
            startDays: 31,
            endMonth: 1,
            endDays: 31,
            startDay: 1,
            endDay: 1
        }
    }
componentDidMount(){
    this.generateDays(this.state.month)
}
  
generateDays = (month) =>{
    if((month == 4) || (month == 6) || (month ==9) || (month == 11)){
        return 30;
    }else if(month == 2){
        return 28;
    }else{
        return 31;
    }
}

  handler = async e => {
    const { id, value } = await e.target;
    this.setState({
      [id]: value
    });
    console.log("id: "+id)
    console.log("value: "+value)
};

renderDay = (days, controlId, label) =>{
return(
  <SelectDay 
    renderOptions={this.props.renderOptions} 
    handler={this.handler.bind(this)} 
    days={days}
    controlId={controlId}
    label={label}
  ></SelectDay>
);
}
  add = () =>{
    const {startDay, endDay, startMonth, endMonth} = this.state
    this.props.add(this.styleDate(startDay),this.styleDate(endDay), this.styleDate(startMonth), this.styleDate(endMonth));
  }

  styleDate=(number)=>{
    if(number < 10 )
      return `0${number}`
    else
      return `${number}`  
  }

  render() {
    return (
      <Fragment>
        <Form.Row>
          <Form.Group controlId="startMonth" style={styles.formField}>
            <Form.Label>Start Month</Form.Label>
            <Form.Control
              as="select"
              onChange={async (e)=>{await this.handler(e); this.setState({startDays: this.generateDays(this.state.startMonth)})}}
            >
              {this.props.renderOptions(this.state.months)}
            </Form.Control>
          </Form.Group>
            {this.state.startDays === 30 && this.renderDay(30,"startDay", "Start Day")}
            {this.state.startDays === 31 && this.renderDay(31,"startDay", "Start Day")}
            {this.state.startDays === 28 && this.renderDay(28,"startDay", "Start Day")}


            <Form.Group controlId="endMonth" style={styles.formField}>
            <Form.Label>End Month</Form.Label>
            <Form.Control
              as="select"
              onChange={async (e)=>{await this.handler(e); this.setState({endDays: this.generateDays(this.state.endMonth)})}}
            >
              {this.props.renderOptions(this.state.months)}
            </Form.Control>
          </Form.Group>
            {this.state.endDays === 30 && this.renderDay(30,"endDay", "end Day")}
            {this.state.endDays === 31 && this.renderDay(31,"endDay", "end Day")}
            {this.state.endDays === 28 && this.renderDay(28,"endDay", "end Day")}

            </Form.Row>
        <Button onClick={this.add}>Add</Button>
      </Fragment>
    );
  }
}

export default SelectDates;

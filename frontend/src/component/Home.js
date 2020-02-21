import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import styles from "../resources/styles/standardLayoutStyles";

class Home extends React.Component {
  renderMessage = (message) => {
    return (
      <div style={styles.container}>
        <Card style={styles.card}>
          <Card.Body>
            <Card.Title>{message}</Card.Title>
          </Card.Body>
        </Card>
      </div>
    );
  };
  
  removeLoginMessage = () => {
    
    localStorage.removeItem("loginMessage");
  };

  render() {
    return (
      <div>
        {localStorage.getItem("loginMessage") && this.renderMessage('You are now logged in!')}
        {localStorage.getItem("loginMessage") ? this.removeLoginMessage() : ""}
        {!localStorage.getItem('auth') && this.renderMessage('Signup now to apply for the job of a lifetime!')}
      </div>
    );
  }
}

export default Home;

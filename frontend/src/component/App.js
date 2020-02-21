import React, { Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import ParticlesBg from 'particles-bg'
import {Switch} from 'react-router-dom';

import Home from './Home';
import AppNavbar from './AppNavbar';
import Login from './Login';
import Signup from './Signup';
import CreateApplication from './CreateApplication';


class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      auth: localStorage.getItem('auth')
    }
  }
  changeAppState = (name, value) => {
    this.setState({
      [name]: value
    })
    localStorage.setItem(name, value);
  }

  render() {
    return (
      <div>
        <AppNavbar appState={this.state} changeAppState={this.changeAppState} />
        <BrowserRouter>
          <Switch>
            <Route exact path="/home" render={(props) => <Home />} />
            <Route exact path="/login" render={(props) => <Login appState={this.state} changeAppState={this.changeAppState} />} />
            <Route exact path="/signup" render={(props) => <Signup appState={this.state} />} />
            <Route exact path="/application" render={(props) => <Home />} />
            <Route exact path="/createApplication" render={(props) => <CreateApplication appState={this.state}/>} />
            <Route path="/" render={(props) => <Home />} />
          </Switch>
        </BrowserRouter>
        <ParticlesBg type="circle" bg={true} />
      </div>
    );
  }
}

export default App;

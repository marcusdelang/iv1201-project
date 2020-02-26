import React, { Fragment } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import ParticlesBg from 'particles-bg'
import {Switch} from 'react-router-dom';
import { toast } from 'react-toastify';


import Home from './Home';
import AppNavbar from './AppNavbar';
import Login from './Login';
import Signup from './Signup';
import CreateApplication from './CreateApplication';
import ShowApplication from './ShowApplication'
import axios from 'axios';

toast.configure()

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
      auth: localStorage.getItem('auth'),
      user: JSON.parse(localStorage.getItem('user')),
      role: localStorage.getItem('role'),
      applicationExists: JSON.parse(localStorage.getItem('applicationExists'))
    }
  }

  logout = () => {
  }

  changeAppState = (name, value) => {
    this.setState({
      [name]: value
    })
    localStorage.setItem(name, value);
  }

  checkApplicationExist = async () => {
      const response = await axios.get(`http://localhost:80/api/application`,{headers: {auth: localStorage.getItem('auth')}})
      const applicationsExists = response.data.length > 0 ? true : false
      this.changeAppState("applicationExists", applicationsExists)
  }
  
  render() {
    return (
      <div>
        <AppNavbar 
          appState={this.state} 
          changeAppState={this.changeAppState} 
          logout={this.logout}
          />
        <BrowserRouter>
          <Switch>
            <Route exact path="/home" render={(props) => <Home />} />
            <Route exact path="/login" render={(props) => <Login checkApplicationExist={this.checkApplicationExist} appState={this.state} changeAppState={this.changeAppState} checkApplicationExist={this.checkApplicationExist} />} />
            <Route exact path="/signup" render={(props) => <Signup appState={this.state} />} />
            <Route exact path="/application" render={(props) => <ShowApplication appState={this.state} />} />
            <Route exact path="/applications" render={(props) => <Home />} />
            <Route exact path="/createApplication" render={(props) => <CreateApplication appState={this.state} checkApplicationExist={this.checkApplicationExist}/>} />
            <Route path="/" render={(props) => <Home />} />
          </Switch>
        </BrowserRouter>
        <ParticlesBg type="circle" bg={true} />
      </div>
    );
  }
}

export default App;

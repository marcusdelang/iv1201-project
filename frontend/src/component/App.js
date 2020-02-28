import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import ParticlesBg from "particles-bg";
import { Switch } from "react-router-dom";

import Home from "./Home";
import AppNavbar from "./AppNavbar";
import Login from "./Login";
import Signup from "./Signup";
import CreateApplication from "./CreateApplication";
import ShowApplications from "./ShowApplications";
import ShowApplication from "./ShowApplication";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Call it once in your app. At the root of your app is the best place
toast.configure();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: localStorage.getItem("auth"),
      user: JSON.parse(localStorage.getItem("user")),
      role: localStorage.getItem("role"),
      applicationExists: JSON.parse(localStorage.getItem("applicationExists"))
    };
  }

  logout = () => {};

  changeAppState = (name, value) => {
    this.setState({
      [name]: value
    });
    localStorage.setItem(name, value);
  };

  async handler(event){
    const { id, value } = await event.target;
    this.setState({
      [id]: /^-{0,1}\d+$/.test(value) ? parseInt(value) : value
    });
  };

  checkApplicationExist = async () => {
    const response = await axios.get(`/api/application`, {
      headers: { auth: localStorage.getItem("auth") }
    });
    const applicationsExists = response.data.length > 0 ? true : false;
    this.changeAppState("applicationExists", applicationsExists);
  };

  render() {
    const {state, changeAppState, logout, checkApplicationExist,handler} = this
    return (
      <div>
        <AppNavbar
          appState={state}
          changeAppState={changeAppState}
          logout={logout}
        />
        <BrowserRouter>
          <Switch>
            <Route exact path="/home" render={props => <Home />} />
            <Route
              exact
              path="/login"
              render={props => (
                <Login
                  checkApplicationExist={checkApplicationExist}
                  appState={state}
                  changeAppState={changeAppState}
                  handler={handler}
                />
              )}
            />
            <Route
              exact
              path="/signup"
              render={props => 
                <Signup 
                  handler={handler}
                  appState={state} 
                />}
            />
            <Route
              exact
              path="/application"
              render={props => <ShowApplication appState={state} />}
            />
            <Route
              exact
              path="/applications"
              render={props => <ShowApplications appState={state} />}
            />
            <Route
              exact
              path="/createApplication"
              render={props => (
                <CreateApplication
                  handler={handler}
                  appState={state}
                  checkApplicationExist={checkApplicationExist}
                />
              )}
            />
            <Route path="/" render={props => <Home />} />
          </Switch>
        </BrowserRouter>
        <ParticlesBg type="circle" bg={true} />
      </div>
    );
  }
}

export default App;

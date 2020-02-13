import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Cookies from 'universal-cookie';

import Header from './Header';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';

const cookies = new Cookies();

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        auth: cookies.get('auth'),
        user: cookies.get('user')
     }
}

  updateAppState = () =>{
    this.forceUpdate();
  }
  changeAppState(name, value){
    this.setState({[name]: value});
  }

  handleChange(e){
    const {id, value} = e.target;
    this.setState({
        [id]: value
    })
  }

  render() {
    console.log(this.state)
    this.state.user ? console.log(this.state.user) : console.log("")
    return (
      <div>
        <Header appState={this.state} updateAppState={this.updateAppState.bind(this)}/>
        <BrowserRouter>
         <Route exact path="/" render={(props) => <Home  />} />
         <Route exact path="/home" render={(props) => <Home appState={this.state} user={this.state.user} role={this.state.user && this.state.user.role}/>} />
         <Route exact path="/signup" render={(props) => <Signup />} /> 
         <Route exact path="/login" render={(props) => <Login cookies={this.props.cookies} appState={this.state} handleChange={this.handleChange} updateAppState={this.updateAppState.bind(this)} changeAppState={this.changeAppState.bind(this)}/>} /> 
        </BrowserRouter>
      </div>
    );
  }
}

export default App;

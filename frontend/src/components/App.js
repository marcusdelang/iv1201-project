import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Header from './Header';
import Home from './Home';
import Signup from './Signup';

class App extends React.Component {
  render() {
    return (
      <div>
       <Header />
        <BrowserRouter>
         <Route exact path="/" render={(props) => <Home />} />
         <Route exact path="/Home" render={(props) => <Home />} />
         <Route exact path="/Signup" render={(props) => <Signup />} /> 
        </BrowserRouter>
      </div>
    );
  }
}

export default App;

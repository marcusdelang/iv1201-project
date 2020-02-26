import React from 'react'
import axios from 'axios'
import {Redirect} from 'react-router-dom';

import UserApplication from './component/UserApplication'

class ShowApplication extends React.Component{

    constructor(props){
        super(props)
        this.state={
            application: [],
            user:   this.props.appState.user
        }
    }

    componentDidMount(){
        this.setState(
            { name: "Michael" },
            () => this.getApplication()
          );
    }

    getApplication = async () =>{
       const response = await axios.get(`http://localhost:80/api/application`,{headers: {auth: localStorage.getItem('auth')}})
           const {} = response.data
           console.log(response.data)
          /* const application = response.data;
           this.setState({
               availabilities: availabilities,
               version: version,
               competences: competences,
               application: application
           })*/
           //console.log("state",this.state)
    }

    renderApplication = () => {
       const {application, user} = this.state
       return application.map((app)=>
            <UserApplication key={app.person}
               application={app}
               user={user}
            />
       );
    }

    render(){
        if(!this.props.appState.auth){
            return <Redirect to="/home" />
        }
        return(
            <div>
                {this.renderApplication()}
            </div>
        );
    }
}

export default ShowApplication; 
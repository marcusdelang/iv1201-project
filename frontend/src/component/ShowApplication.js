import React, { useReducer } from 'react'
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
        const {user} = this.state
        if(user.role == 2){
            this.getApplication()
        }
    }

    getApplication = async () =>{
       const response = await axios.get(`/api/application`,{headers: {auth: localStorage.getItem('auth')}})
       if(response.data.length > 0){
           const {availabilities, version, competences } = response.data[0]
           const application = response.data;
           this.setState({
               availabilities: availabilities,
               version: version,
               competences: competences,
               application: application
           })
       }
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
                <h1 style={{ color: "white" }}>Application</h1>
                {this.renderApplication()}
            </div>
        );
    }
}

export default ShowApplication; 
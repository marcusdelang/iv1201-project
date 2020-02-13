import React from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Button from 'react-bootstrap/Button';

const cookie = new Cookies();

class ApplicationForm extends React.Component{
    

    componentDidMount(){
        
    }

    fetchCompetences = async () =>{
        const response = await axios.get('http://localhost:80/api/competence',{
            headers:{
                auth: cookie.get('auth')
            }
        })
        this.setState({competences: response.data.competences})
    }

    renderLoading(){
        return(
        <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
        </Spinner>
        )
    }

    renderFirstStep = () => {
        this.setState({step: 0})
    }
    renderNextStep = () => {
        this.state.step === this.state.maxStep 
        ?
        this.setState({step: this.step+1})
        :
        this.renderLastStep();
    }
    renderLastStep = () => {
        
    }

    render(){
        return(
            <div>
                
            </div>
        );
    }
}

export default ApplicationForm;
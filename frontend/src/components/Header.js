import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Cookies from 'universal-cookie';


const cookies = new Cookies();

class Header extends React.Component {
    componentDidUpdate(){
        console.log("header did update");
    }
    constructor(props){
        super(props);
        this.state = {
            auth: this.props.appState.auth,
            user: this.props.appState.user
         }
    }
    logout(){
        cookies.remove('auth');
        cookies.remove('user');
    }

    renderLogin = () => {
        return(
        <Nav className="mr-auto">
        <Nav.Link href="login">Login</Nav.Link>
        <Nav.Link href="signup">Signup</Nav.Link>
        </Nav>
        )
    }

    renderLogout = ()=> {
        return(
        <Nav className="mr-auto">
        {this.state.user.name && <h1>{this.state.user.name}</h1>}
        {this.state.user && <Button href="home" onClick={this.logout}>Logout</Button> }
        </Nav>
        )
    }

    render() {
        console.log("render")

        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/home">Grönan Rekrytering</Navbar.Brand>
                {this.state.auth ? this.renderLogout() : this.renderLogin() }
            </Navbar>
        );
    }
}

export default Header;
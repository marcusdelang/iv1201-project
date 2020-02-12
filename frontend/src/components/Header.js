import React from 'react';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class Header extends React.Component {
   /* componentDidMount() {
        this.getTitle();
    }
    getTitle = async () => {
        let res = await axios.get('/api/createUser');
        console.log(res);
    }
*/

    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/home">Grönan Rekrytering</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="Login">Login</Nav.Link>
                    <Nav.Link href="Signup">Signup</Nav.Link>
                </Nav>
            </Navbar>
        );
    }
}

export default Header;
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Image from '../resources/img/bg.jpg';

class Home extends React.Component {

    render() {
        return (
            <div>
                {this.props.user && this.props.role === 2 && <Button>Application</Button>}
                {this.props.user && this.props.role === 1 && <Button>Show Applications</Button>}
            </div>
        );
    }
}

export default Home;
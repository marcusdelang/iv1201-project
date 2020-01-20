import React from 'react';
import axios from 'axios';

class Header extends React.Component {
    componentDidMount() {
        this.getTitle();
    }
    getTitle = async () => {
        let res = await axios.get('/api/db');
        console.log(res);
    }
    
    
    render() {
        return <h1>{this.props.title}</h1>
    }
}

export default Header;
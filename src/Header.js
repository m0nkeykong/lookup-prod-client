

import React, { Component } from "react";
import { NavLink , Link} from "react-router-dom";
import MdFace from "react-icons/lib/md/face";
import {Redirect} from 'react-router-dom';

class Header extends Component {
    active = {
        color: "white",
        fontWeight: "bold",

    };
    header = {
        listStyle: "none",
        display: "flex",
        justifyContent: "space-evenly"  
    };
    logo = {
        width: '40%',
        height: '40px',
        display: 'block',
        margin: '0 auto',
        marginTop: '8px'

    }

    render() {
        return (
            <div className="container">
                <NavLink to={`/login`} activeStyle={this.active} 
                >
                <img style={this.logo} src="/images/logo.PNG"></img>
                </NavLink>
            </div>
);}}
export default Header;

// <div style={{ backgroundImage: `url(./images/logo.PNG)`, margin: '0 auto', width: '100px', height: '100px', marginTop: '5px' }}></div>

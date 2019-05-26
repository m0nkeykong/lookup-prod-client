

import React, { Component } from "react";
import { NavLink , Link} from "react-router-dom";
import MdFace from "react-icons/lib/md/face";
import {Redirect} from 'react-router-dom';

class Header extends Component {
    active = {
        color: "white",
        fontWeight: "bold",
    };

    logo = {
        width: '153px',
        height: '54px',
        display: 'block',
        margin: '0 auto',
        marginTop: '4px',
        marginBottom: '4px'
    }

    render() {
        return (
            <div className="container">
                {/* <NavLink to={`/login`} activeStyle={this.active} > */}
                <img alt="HeaderLogo" style={this.logo} src='./images/logoSmall.png'></img>
                {/* </NavLink> */}
            </div>
);}}
export default Header;

// <div style={{ backgroundImage: `url(./images/logo.PNG)`, margin: '0 auto', width: '100px', height: '100px', marginTop: '5px' }}></div>

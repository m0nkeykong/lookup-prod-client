

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

    render() {
        return (
            <div className="container">
                <div className="col-xs-12 col-md-6 offset-md-3">
                    <NavLink to={`/homePage`} activeStyle={this.active} className="col-xs-12 col-md-6 offset-md-3 svgHover">
                        <MdFace size={35} />
                    </NavLink>
                </div>
            </div>
);}}
export default Header;
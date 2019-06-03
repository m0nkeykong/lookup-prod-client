import React, { Component } from "react";

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
                <img alt="HeaderLogo" style={this.logo} src='./images/logoSmall.png'></img>
            </div>
);}}
export default Header;

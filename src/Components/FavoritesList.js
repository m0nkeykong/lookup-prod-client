import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';

import { rank, accessibility } from '../MISC';

import { Card, Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import './style/TrackDetails.css'

class Favorites extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: [],
      userDetails: []
    }

  }
  
//   @TODO: TALK WITH REUT ABOUT SHOW TRACKS LIST COMPONENT


  componentDidMount() {
    // this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
    // console.log(`Entered <AutoGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);

    // // Get the user details from database
    // axios.get(`http://localhost:3000/user/getAccountDetails/${this.userid}`)
    //   .then(userResponse => {
    //     this.setState({ userDetails: userResponse.data, loading: false });
    //     console.log(userResponse.data);
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
  }

//   <Card.Header>
//   <Navbar collapseOnSelect expand="lg">

//     <Navbar.Brand href="#profilePicture" style={{ float: 'left' }}>
//       {this.state.userDetails.profilePicture ?
//         (
//           <img alt="Profile" src={this.state.userDetails.profilePicture} style={{ height: '40px', width: '40px', float: 'left', borderRadius: '50%' }}></img>
//         )
//         :
//         (
//           <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
//         )
//       }
//     </Navbar.Brand>

//     <Navbar.Brand href="#name" style={{ float: 'center' }}>
//       {this.state.userDetails.name ?
//         (
//           <div>
//             <p>{this.state.userDetails.name}</p>
//           </div>
//         )
//         :
//         (
//           <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
//         )
//       }
//     </Navbar.Brand>

//     <Navbar.Toggle aria-controls="responsive-navbar-nav" />
//     <Navbar.Collapse id="responsive-navbar-nav">
//       <Nav className="mr-auto">
//         <Nav.Link href="#profile">View Profile</Nav.Link>
//         <Nav.Link href="#favoriteTracks">Favorite Tracks</Nav.Link>
//         <NavDropdown title="Navigate a Route" id="collasible-nav-dropdown">
//           <NavDropdown.Item href="#action/2.1">Choose Existing Track</NavDropdown.Item>
//           <NavDropdown.Item href="#action/2.2">Generate Auto Track</NavDropdown.Item>
//           <NavDropdown.Item href="#action/2.3">Custom Made Track</NavDropdown.Item>
//           <NavDropdown.Divider />
//           <NavDropdown.Item href="#action/2.4">Info</NavDropdown.Item>
//         </NavDropdown>
//         <Nav.Link href="#searcgTracks">Serach Tracks</Nav.Link>
//         <Nav.Link href="#vibrations">Vibrations</Nav.Link>
//         <Nav.Link href="#about">About</Nav.Link>
//         <Nav.Link href="#contact">Contact us</Nav.Link>
//       </Nav>
//     </Navbar.Collapse>

//   </Navbar>
// </Card.Header>
  render() {
    return (
      <div>


      </div>
    );
  }
}


export default Favorites;
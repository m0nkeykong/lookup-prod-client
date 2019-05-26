import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';

import { rank, accessibility } from '../MISC';

import { Button, Card, Form, Navbar, NavDropdown, Nav, InputGroup, Modal, ButtonToolbar, ProgressBar, Row, Col, ListGroup} from 'react-bootstrap';

import { BeatLoader } from 'react-spinners';
import './style/TrackDetails.css'

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      userDetails: [],
      isUpdated: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);   
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateUserDetails = this.updateUserDetails.bind(this);
  }
  
  componentDidMount(){
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
    console.log(`Entered <AutoGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);

    // Get the user details from database
    axios.get(`http://localhost:3000/user/getAccountDetails/${this.userid}`)
      .then(userResponse => {
        this.setState({ userDetails: userResponse.data, loading: false });
        console.log(userResponse.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleSubmit(e){
    e.persist();
    e.preventDefault();

    this.setState({ isUpdated: true });

    const userDetails = this.state.userDetails;
    this.updateUserDetails(userDetails);
  }

  updateUserDetails(userDetails){
    axios.put(`http://localhost:3000/user/updateAccountDetails/${this.userid}`, {...userDetails})
    .then(userDetails => {
      console.log("startPoint fetched: " + userDetails.data);
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleInputChange(e){
    e.persist();
    console.log(e);
    e.target.value !== '' &&
      this.setState(
        (prevState) => ({
          ...prevState,
          userDetails: {[e.target.name]: e.target.value},
        }), () => {
          console.log(this.state.userDetails);
        }
      )
  }

  render() {
    
    return (
      <div>

        <Card.Header>
          <Navbar collapseOnSelect expand="lg">

            <Navbar.Brand href="#profilePicture" style={{ float: 'left' }}>
              {this.state.userDetails.profilePicture ?
                (
                  <img alt="Profile" src={this.state.userDetails.profilePicture} style={{ height: '40px', width: '40px', float: 'left', borderRadius: '50%' }}></img>
                )
                :
                (
                  <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
                )
              }
            </Navbar.Brand>

            <Navbar.Brand href="#name" style={{ float: 'center' }}>
              {this.state.userDetails.name ?
                (
                  <div>
                    <p>{this.state.userDetails.name}</p>
                  </div>
                )
                :
                (
                  <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
                )
              }
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="#profile">View Profile</Nav.Link>
                <Nav.Link href="#favoriteTracks">Favorite Tracks</Nav.Link>
                <NavDropdown title="Navigate a Route" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="#action/2.1">Choose Existing Track</NavDropdown.Item>
                  <NavDropdown.Item href="#action/2.2">Generate Auto Track</NavDropdown.Item>
                  <NavDropdown.Item href="#action/2.3">Custom Made Track</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/2.4">Info</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="#searcgTracks">Serach Tracks</Nav.Link>
                <Nav.Link href="#vibrations">Vibrations</Nav.Link>
                <Nav.Link href="#about">About</Nav.Link>
                <Nav.Link href="#contact">Contact us</Nav.Link>
              </Nav>
            </Navbar.Collapse>

          </Navbar>
        </Card.Header>
        <Form onSubmit={e => this.handleSubmit(e)}>

            <Form.Group controlId="formDestination">
            {/*<Form.Label>Destination</Form.Label>*/}
            User ID<Form.Control disabled type="text" placeholder={this.state.userDetails._id} value={this.state.userDetails._id} name="_id" onChange={this.handleInputChange }/>
            Name<Form.Control type="text" placeholder={this.state.userDetails.name} value={this.state.userDetails.name} name="name" onChange={this.handleInputChange}/>
            Email<Form.Control type="text" placeholder={this.state.userDetails.email} value={this.state.userDetails.email} name="email" onChange={this.handleInputChange}/>
            Profile picture<Form.Control disabled type="text" placeholder={this.state.userDetails.profilePicture} value={this.state.userDetails.profilePicture} name="profilePicture" onChange={() => {"Hello"}}/>
            Account creation date<Form.Control disabled type="text" placeholder={this.state.userDetails.createdDate} value={this.state.userDetails.createdDate} name="createdDate" onChange={this.handleInputChange}/>
            Password<Form.Control type="password" placeholder={this.state.userDetails.password} value={this.state.userDetails.password} name="password" onChange={this.handleInputChange}/>
            Phone Number<Form.Control type="number" placeholder={this.state.userDetails.phone} value={this.state.userDetails.phone} name="phone" onChange={this.handleInputChange}/>
            Accessibility<Form.Control type="text" placeholder={this.state.userDetails.accessibility} value={this.state.userDetails.accessibility} name="accessibility" onChange={this.handleInputChange}/>
            Rank<Form.Control disabled type="text" placeholder={this.state.userDetails.rank} value={this.state.userDetails.rank} name="rank" onChange={this.handleInputChange}/>
            </Form.Group>

            <Button variant="primary" type="submit">
                Update Details
            </Button>
        </Form>
      </div>
    );
  }
}


export default Profile;
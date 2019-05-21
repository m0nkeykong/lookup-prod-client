import React, { Component } from 'react';
import { Card, Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';

import './style//LiveNavigation.css';
import Map from './Map';

class LiveNavigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDetails: [],
      loading: true,
      generatedTrack: this.props.location.generatedTrack
    }

    this.showMenu = this.showMenu.bind(this);
    this.createStartPoint = this.createStartPoint.bind(this);
    this.createEndPoint = this.createEndPoint.bind(this);
    this.createTrack = this.createTrack.bind(this);
    this.createUserTrackRecord = this.createUserTrackRecord.bind(this);

  }

  createStartPoint(startPointObj){
    axios.post(`http://localhost:3000/point/insertPoint`, {...startPointObj})
    .then(startPointObj => {
      console.log("startPoint fetched: " + startPointObj.data);
      this.startPointId = startPointObj.data._id;
    })
    .catch(error => {
      console.log(error);
    });
  }

  createEndPoint(endPointObj){
    axios.post(`http://localhost:3000/point/insertPoint`, {...endPointObj})
    .then(endPointObj => {
      console.log("endPoint fetched: " + endPointObj.data);
      this.endPointId = endPointObj.data._id;
    })
    .catch(error => {
      console.log(error);
    });
  }

  createTrack(track){
    const trackObj = {
      startPoint: this.startPointId,
      endPoint: this.endPointId,
      // wayPoints: track.wayPoints !== '' ? {...track.wayPoints} : [],
      travelMode: track.travelMode,
      description: track.description,
      title: track.title,
      distance: track.distance,
      rating: track.rating,
      disabledTime: track.disabledTime,
      nonDisabledTime: track.nonDisabledTime,
      estimatedDuration: track.estimatedDuration,
      difficultyLevel: track.difficultyLevel,
      changesDuringTrack: false,

    }
    console.log("createTrack() Object Creating");
    console.log(trackObj);
    console.log(this.startPoint, this.endPoint);
    axios.post(`http://localhost:3000/track/insertTrack`, {
      ...trackObj,  startPoint: this.startPoint,
      endPoint: this.endPoint,
    })
    .then(createdTrackResponse => {
      this.createdTrack = createdTrackResponse.data;
      // @TODO: Store in session and state
      console.log("insertTrack fetched: " + createdTrackResponse.data);
    })
    .catch(error => {
      console.error(error);
    });
  }

  createUserTrackRecord() {
    axios.put(`http://localhost:3000/user/addTrackRecord/${this.userid}`,
      { trackid: this.createdTrack._id })
      .then(addedTrackRecord => {
        if (addedTrackRecord.data.status === 200) {
          console.log(`Track ${this.createdTrack._id} successfully added to User ${this.userid} track records list`);
        }
        else {
          console.error(`There was a problem to add ${this.createdTrack._id} to User ${this.userid} track record list`);
        }
      })
      .catch(error => {
        console.error(error);
      })

  }

  async componentDidMount(){
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
    console.log(`Entered <LiveNavigation> componentDidMount(), fetching userid: ${this.userid}`);
    const track = this.props.location.generatedTrack.track;
    // Get the user details from database
    axios.get(`http://localhost:3000/user/getAccountDetails/${this.userid}`)
      .then(userResponse => {
        this.setState({ userDetails: userResponse.data, loading: false });
        console.log(userResponse.data);
      })
      .catch(error => {
        console.error(error);
      });

    await this.createStartPoint(track.startPointObj);
    await this.createEndPoint(track.endPointObj);
    await this.createTrack(track);
    await this.createUserTrackRecord();  
    
    // this.setState({ loading: false });
  }

  showMenu(){
    return(
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
      </div>
    )
  }

  render() {
    return (
      <div>
        <Card className="text-center">

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

          <Card.Header> 
            <h6> Live Navigation Map </h6> 

              {false && <Map
                track={this.state.generatedTrack.track}>
              </Map>}

          </Card.Header>


          <Card.Footer id="locationUpdate" className="text-muted"></Card.Footer>
        </Card>
      </div>
    );
  }
}


export default LiveNavigation;
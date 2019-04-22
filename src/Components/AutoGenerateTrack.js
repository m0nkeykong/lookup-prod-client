import React, { Component } from 'react';
import Map from './Map';
import { BeatLoader } from 'react-spinners';
import './style/AutoGenerateTrack.css';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Button, Card, Form, Col, Row, Container, Navbar, NavItem, NavDropdown, Nav, MenuItem } from 'react-bootstrap';

class AutoGenerateTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userDetails: [],
      response: null,
      loadLiveMap: false,
      track: {
        startPoint: null,
        endPoint: null,
        wayPoints: null,
        travelMode: 'WALKING'
      }
    }

    this.handleSubmit = this.handleSubmit.bind(this);   
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.renderForm = this.renderForm.bind(this);

    this.getGeneratedTrack = this.getGeneratedTrack.bind(this);
    this.getAllTracks = this.getAllTracks.bind(this);    
  }

  componentDidMount(){
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
		console.log(`Entered <AutoGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);

    // Get the user details from database
    axios.get(`http://localhost:3000/user/getAccountDetails/${this.userid}`)
      .then(response => {
				this.setState({ userDetails: response.data });
        this.setState({ loading: false });
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }



  renderForm(){

  }

  getGeneratedTrack(){

  }
  
  getAllTracks(){

  }


  // Change to class method
  directionsCallback = response => {
    console.log(`Entered directionsCallback, RESPONSE: `);
    console.log(response);
    if (response !== null) {
      if (response.status === 'OK') {
        const {leg} = response.routes[0].legs[0];
        
        // Set startPoint to Point Object and get its _id
        axios.post(`http://localhost:3000/point/insertPoint`, {
          ...leg.start_location
        })
        .then(startPointResponse => {
          console.log("startPoint fetched: " + startPointResponse.data);
          this.startPointId = startPointResponse.data;
        })
        .catch(error => {
          console.log(error);
        });
        
        // Set endPoint to Point Object and get its _id
        axios.post(`http://localhost:3000/point/insertPoint`, {
          ...leg.end_location
        })
        .then(endPointResponse => {
          console.log("endPoint fetched: " + endPointResponse.data);
          this.endPointId = endPointResponse.data;
        })
        .catch(error => {
          console.log(error);
        });
        
        const trackObj = {
          startPoint: this.startPoint,
          endPoint: this.endPoint,
          middlePoint: this.wayPoints.length > 0 ? {...this.wayPoints} : [],
          type: this.state.travelMode,
          // @TODO: Validate unique title
          title: `User route ` + Math.random(9999999999),
          // @TODO: Let the user insert this value from form
          comment: `First auto generated track`,
          // @TODO: Let the user insert this value from form
          rating: Math.random(10),
          // @TODO: Let the user insert this value from form
          changesDuringTrack: false,
          // @TODO: Let the user insert this value from form
          diffucultyLevel: Math.random(10)
        }

        axios.post(`http://localhost:3000/track/insertTrack`, {
          trackObj
        })
        .then(createdTrackResponse => {
          this.createdTrack = createdTrackResponse.data;
          // @TODO: Store in session and state
          console.log("insertTrack fetched: " + createdTrackResponse.data);
          
        })
        .catch(error => {
          console.error(error);
        });
        
        axios.put(`http://localhost:3000/addTrackRecord/${this.userid}`, 
        {trackid: this.createdTrack._id})
        .then(addedTrackRecord => {
          if(addedTrackRecord.data.status === 200){
            console.log(`Track ${this.trackid} successfully added to User ${this.userid} track records list`);
          }
          else{
            console.error(`There was a problem to add ${this.trackid} to User ${this.userid} track record list`);
          }

        })
        .catch( error => {
          console.error(error);
        })

        this.setState( () => ({ response }));
        
      } else {
        console.error(`Resnpose = null: `);
        console.log(response);
      }
    }
  }
  // <img alt="Profile" src={JSON.parse(sessionStorage.getItem('userDetails')).profilePicture} style={{ height: '40px', width: '40px', float: 'right', borderRadius: '50%', padding: '3px 3px 3px 3px' }}></img>
  // <h6 style={{ fontFamily: "ABeeZee, sans-serif" }}>Hello, {JSON.parse(sessionStorage.getItem('userDetails')).name}</h6>

  handleInputChange(e){
    e.persist();
    console.log(e);
    e.target.value !== '' &&
      this.setState(
        (prevState) => ({
          ...prevState,
          track: {...prevState.track, [e.target.name]: e.target.value},
        }), () => {
          console.log(this.state.track);
        }
      )
  }

  handleRadioChange(e){
    e.persist();
    e.target.checked &&
      this.setState(
        (prevState) => ({
          ...prevState,
          track: {...prevState.track, [e.target.name]: e.target.value},
        })
      )
  }

  handleSubmit(e){
    e.persist();
    e.preventDefault();

    this.setState({ loadLiveMap: true });
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

          <Card.Body>
            <Form onSubmit={e => this.handleSubmit(e)}>
              <Card.Title>
                <h6> Choose Origin and Destination </h6>
              </Card.Title>

              <Form.Group controlId="formOrigin">
                <Form.Label>Origin</Form.Label>
                <Form.Control type="text" placeholder="Enter Origin" name="startPoint" onChange={this.handleInputChange}/>
                <Form.Text className="text-muted">
                  Click here to user your current location.
                </Form.Text>
              </Form.Group>
            
              <Form.Group controlId="formDestination">
                <Form.Label>Destination</Form.Label>
                <Form.Control type="text" placeholder="Enter Destination" name="endPoint" onChange={this.handleInputChange}/>
              </Form.Group>

              <Card.Title>
                <h6> Choose Travel Mode </h6>
              </Card.Title>

              <Form.Group>
                <Form.Check custom inline id="formWalking" type="radio" label="Walking" name="travelMode" checked={this.state.track.travelMode === 'WALKING'} value="WALKING" onChange={this.handleRadioChange}/>
                <Form.Check custom inline id="formBicycling" type="radio" label="Bicycling" name="travelMode" checked={this.state.track.travelMode === 'BICYCLING'} value="BICYCLING" onChange={this.handleRadioChange}/>
              </Form.Group>

              <Button variant="primary" type="submit">
                Generate Route
              </Button>
            </Form>
          </Card.Body>

          <Card.Header> 
            <h6> Live Navigation Map </h6> 
          </Card.Header>
          <Card.Body>
            {this.state.loadLiveMap ?
              (
                <Map
                  track={this.state.track}>
                </Map>
              )
              :
              (
                <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
              )
            }
          </Card.Body>
          <Card.Footer id="locationUpdate" className="text-muted"></Card.Footer>
        </Card>
      </div>
    );
  }
}
// Save - Save (DB) track without navigating
// Fast Travel - Navigate without saving ::: Warning Modal
// Save and Navigate - Save (DB) and Immidiatly start Navigation

export default AutoGenerateTrack;
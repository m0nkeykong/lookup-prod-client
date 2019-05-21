import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import Geocode from 'react-geocode';
import { BeatLoader } from 'react-spinners';
import { GoogleMap, LoadScript, DirectionsService } from '@react-google-maps/api';
import { Button, Card, Form, Navbar, NavDropdown, Nav, InputGroup, Modal, ButtonToolbar, ProgressBar, Row, Col, ListGroup} from 'react-bootstrap';
import IoIosLocation from 'react-icons/lib/io/ios-location';

import LiveNavigation from './LiveNavigation';
import {getGoogleApiKey} from '../globalService';
import './style/AutoGenerateTrack.css';

var EventEmitter = require('events');
var ee = new EventEmitter();

class AutoGenerateTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userResponse: null,
      directionsResponse: null,
      userDetails: [],
      isGenerated: false,
      loading: true,
      startLiveNavigation: false,

      showModal: false,

      avoidTolls: true,
      avoidFerries: true,
      avoidHighways: true,
      track: {
        startPointObj: {},
        endPointObj: {},

        startPoint: '',
        endPoint: '',
        wayPoints: '',
        travelMode: 'WALKING',
        description: '',
        title: '',
        distance: '',
        rating: '',
        disabledTime: '',
        nonDisabledTime: '',

        estimatedDuration: '',
        difficultyLevel: '',
      }
    }

    this.handleSubmit = this.handleSubmit.bind(this);   
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleResetModal = this.handleResetModal.bind(this);

    this.showGeneratedTrackModal = this.showGeneratedTrackModal.bind(this);
    this.showTrackForm = this.showTrackForm.bind(this);
    this.showMenu = this.showMenu.bind(this);

    this.setPoints = this.setPoints.bind(this);

    this.getGeneratedTrackDetails = this.getGeneratedTrackDetails.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
  }

  componentDidMount(){
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
		console.log(`Entered <AutoGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);

    // Get the user details from database
    axios.get(`http://localhost:3000/user/getAccountDetails/${this.userid}`)
      .then(userResponse => {
				this.setState({ userDetails: userResponse.data, loading: false, userResponse: true});
        console.log(userResponse.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

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

  getCurrentLocation(){
    console.log("Entered <AutoGenerateTrack> getCurrentLocation()");

    const options = {
      enableHighAccuracy: true,
      timeout: 500,
			maximumAge: 0
      };
      
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        Geocode.setApiKey(getGoogleApiKey());
        Geocode.fromLatLng(pos.coords.latitude, pos.coords.longitude).then(
          response => {

            const address = response.results[0].formatted_address;
            console.log(address);
            this.setState(
              (prevState) => ({
                ...prevState,
                track: {...prevState.track, startPoint: address},
              }), () => {
                console.log(this.state.track);
              }
            );
            var event = new Event('input', { bubbles: true });
            this.myinput.dispatchEvent(event);
          },
          error => {
            console.error(error);
          }
        );
      }, (err) => {
        console.error(`ERROR(${err.code}): ${err.message}`);
      }, options);
    }
    else{
      console.warn("Geolocation API not supported.");
      alert("Geolocation API not supported.");
    }
  }

  handleSubmit(e){
    e.persist();
    e.preventDefault();
    // After track created, set state to load Modal
    this.setState({ isGenerated: true });
    this.handleShowModal();
  }

  handleCloseModal() {
    this.setState({ showModal: false, isGenerated: false, directionsResponse: null });
  }

  handleShowModal() {
    this.setState({ showModal: true });
  }

  handleResetModal() {
    this.setState({ showModal: false, isGenerated: false, directionsResponse: null });
    this.setState({ track: { startPoint: '', endPoint: '', description: '', travelMode: 'WALKING', title: '' } })
  }


  getGeneratedTrackDetails(){
    console.log("Entered <AutoGenerateTrack></AutoGenerateTrack> getGeneratedTrackDetails()");
    const response = this.state.directionsResponse;
    const leg = response.routes[0].legs[0];
    console.log(leg);

		if (response !== null) {
      if (response.status === 'OK') {
        // @TODO: 
        // this.setState({ track: { estimatedDuration: parseFloat(leg.duration.value), distance: parseFloat(leg.distance.value) } })
        return(
          <div>
            <div>
              <ListGroup variant="flush">
                <ListGroup.Item> <span> Track Title: </span> {this.state.track.title} </ListGroup.Item>
                <ListGroup.Item> <span> Description: </span> {this.state.track.description} </ListGroup.Item>
                <ListGroup.Item> <span> Travel Mode: </span> {this.state.track.travelMode} </ListGroup.Item>
                <ListGroup.Item> <span> From: </span> {leg.start_address} </ListGroup.Item>
                <ListGroup.Item> <span> To: </span> {leg.end_address} </ListGroup.Item>
                <ListGroup.Item> <span> Total Distance: </span> {leg.distance.text} </ListGroup.Item>
                <ListGroup.Item> <span> Estimated Duration: </span> {leg.duration.text} </ListGroup.Item>
             </ListGroup>
              
              {/*
              <ProgressBar variant="info" animated now={100} />  
              <Button variant="outline-success">Save And Start Live Navigation</Button>
              <Button variant="outline-primary">Start Live Navigation Without Save</Button>
              <Button variant="outline-secondary">Save Track</Button>
              */}
            </div>
          </div>
        )
      }
      else {
        console.error(`Response From Directions API Was Returned With Status ${response.status}`);
        return( <div/> );
      }
    }
    else{
      console.error('Response From Directions API is null');
      return( <div/> );
    }   
  }

  showGeneratedTrackModal(){
    return(
      <div>
        <ButtonToolbar>
        <Modal
          size="lg"
          show={this.state.showModal}
          onHide={this.handleCloseModal}
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Generated Track Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

          {/* Show Generated Track Details ONLY If We Have Track Details Response */}
          {this.state.directionsResponse !== null ?
            (
                this.getGeneratedTrackDetails()
            )
            :
            (
              <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
            )
          }
          
          </Modal.Body>

          <Modal.Footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Row>
            <Col>
              <NavLink to= {{pathname: `${process.env.PUBLIC_URL}/liveNavigation`, generatedTrack: this.state}}>
                <Button variant="primary" onClick={this.startLiveNavigation}>Save & Navigate</Button>
              </NavLink>            
            </Col>
            <Col>
              <Button variant="secondary" onClick={this.handleResetModal}>Reset</Button>
            </Col>
            <Col xs lg="2">
              <Button variant="dark" onClick={this.handleCloseModal}>Close</Button>
            </Col>
          </Row>
          </Modal.Footer>

        </Modal>
       </ButtonToolbar>      
      </div>
    )
  }

  showTrackForm(){
    return(
      <Card.Body>
      <Form onSubmit={e => this.handleSubmit(e)}>
        <Card.Title>
          <h6> Choose Origin and Destination </h6>
        </Card.Title>

        <InputGroup className="mb-3">
          {/*<Form.Label>Origin</Form.Label>*/}
          <InputGroup.Prepend>
            <Button title="Get current location" onClick={ this.getCurrentLocation }> <IoIosLocation/> </Button>
          </InputGroup.Prepend>
          <Form.Control required type="text" placeholder="Enter Origin" value={this.state.track.startPoint} name="startPoint" onChange={e => {this.handleInputChange(e)}} ref={(input)=> this.myinput = input}/>
        </InputGroup>
      
        <Form.Group controlId="formDestination">
          {/*<Form.Label>Destination</Form.Label>*/}
          <Form.Control required type="text" placeholder="Enter Destination" value={this.state.track.endPoint} name="endPoint" onChange={this.handleInputChange}/>
        </Form.Group>

        <Card.Title>
          <h6> Travel Mode </h6>
        </Card.Title>

        <Form.Group>
          <Form.Check custom inline id="formWalking" type="radio" label="Walking" name="travelMode" checked={this.state.track.travelMode === 'WALKING'} value="WALKING" onChange={this.handleRadioChange}/>
          <Form.Check custom inline id="formBicycling" type="radio" label="Bicycling" name="travelMode" checked={this.state.track.travelMode === 'BICYCLING'} value="BICYCLING" onChange={this.handleRadioChange}/>
        </Form.Group>

        <Card.Title>
          <h6> Description and Title </h6>
        </Card.Title>

        <Form.Group controlId="formDescription">
          <Form.Control as="textarea" required type="text" placeholder="Description" value={this.state.track.description} name="description" onChange={this.handleInputChange}/>
        </Form.Group>

        <Form.Group controlId="formTitle">
          <Form.Control required type="text" placeholder="Track Title" name="title" value={this.state.track.title} onChange={this.handleInputChange}/>
          <Form.Text className="text-muted" style={{float: 'left'}}>
            This is a unique name.
          </Form.Text>
        </Form.Group>
        <br/>

        <Card.Title>
          <h6> Additional settings </h6>
        </Card.Title>

        <Form.Group>
          <Form.Check disabled custom inline id="formTolls" type="radio" checked={true} label="Avoid Tolls" name="avoidTolls" value="true"/>
          <Form.Check disabled custom inline id="formSafeWays" type="radio" checked={true} label="Safe Ways" name="safeWays" value="true"/>
          <Form.Check disabled custom inline id="formHighway" type="radio" checked={true} label="Avoid Highways" name="avoidHighways" value="true"/>
        </Form.Group>

        <Button variant="primary" type="submit">
          Generate Route
        </Button>
      </Form>
    </Card.Body>
    )
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

  directionsRequest(){
    return(
      <div>
        <LoadScript
        id="script-loader"
        googleMapsApiKey={getGoogleApiKey()}
        onError={this.onLoadScriptError}
        onLoad={this.onLoadScriptSuccess}
        language="en"
        version="3.36"
        region="us"
        >

          <div className="map-container">

            <GoogleMap>
            {/* Directions API Request */}
            {this.state.directionsResponse === null &&
              <DirectionsService
                options={{
                  origin: this.state.track.startPoint,
                  destination: this.state.track.endPoint,
                  waypoints: this.state.track.wayPoints ? this.state.track.wayPoints : null,
                  avoidTolls: this.state.avoidFerries,
                  avoidFerries: this.state.avoidFerries,
                  avoidHighways: this.state.avoidHighways,
                  travelMode: this.state.track.travelMode,
                  drivingOptions: {
                    departureTime: new Date(Date.now()),
                    trafficModel: 'bestguess' 
                  },
                  optimizeWaypoints: true
                }}
                callback={(response) => {
                  this.setState({ directionsResponse: response })
                  this.setPoints();
                }
                }
              >
              </DirectionsService>
              }
            </GoogleMap>

          </div>

        </LoadScript>      
      
      </div>
    )
  }

  setPoints(){
    const response = this.state.directionsResponse;
    const leg = response.routes[0].legs[0];

    let startPoint = leg.start_address;
    let startPointArray = startPoint.split(', ', 3);
    let endPoint = leg.end_address;
    let endPointArray = endPoint.split(', ', 3);
    
    ee.on('trackObj', () => {
      this.setState(
        (prevState) => ({
          ...prevState,
          track: {...prevState.track,  distance: leg.distance.value, estimatedDuration: leg.duration.value, disabledTime: '', nonDisabledTime: '', rating: 0},
        }));  
    })

    ee.on('pointObject', (pointDetails, address, point) => {
      let lat;
      let lng;

      Geocode.setApiKey(getGoogleApiKey());
      Geocode.fromAddress(address).then(
        response => {
          lat = response.results[0].geometry.location.lat;
          lng = response.results[0].geometry.location.lng;
          console.log(lat, lng);
          
          switch(pointDetails.length){
            // User writed only country
            case 1:
              this.setState(
                (prevState) => ({
                  ...prevState,
                  track: { ...prevState.track, [point]: { country: pointDetails[0], lat: lat, lng: lng }},
                }));
              console.log("case 1");
              break;
            // User writed only country, city
            case 2:
              this.setState(
                (prevState) => ({
                  ...prevState,
                  track: {...prevState.track, [point]: { country: pointDetails[0], city: pointDetails[1], lat: lat, lng: lng }}
                }));
              console.log("case 2");
              break;
            // User writed only country, city, street
            case 3:
              this.setState(
                (prevState) => ({
                  ...prevState,
                  track: {...prevState.track, [point]: { country: pointDetails[0], city: pointDetails[1], street: pointDetails[2], lat: lat, lng: lng }}
                }));
              console.log("case 3");
              break;
    
            default:
              console.log('<AutoGenerateTeack></AutoGenerateTeack> setPoints() Incorrect address');
              break;
          }
        },
        error => {
          console.error(error);
        }
      );

      
    })

    ee.emit('pointObject', startPointArray, startPoint,'startPointObj');
    ee.emit('pointObject', endPointArray, endPoint,'endPointObj');
    ee.emit('trackObj');
  }

  render() {    
    return (
      <div>
        <Card className="text-center">

          {/* Show Menu And User Details When Page Stop Loading sessionStorage */}
          {!this.state.loading && this.showMenu()}

          {/* Show Generate Track Form When Page Stop Loading sessionStorage */}
          {this.state.userResponse && this.showTrackForm()}

          {/* Generated Track Modal */}
          {this.state.isGenerated && this.showGeneratedTrackModal()}

          <Card.Body>
            {/* Send Directions API Request Only When The User Send The Required Track Details Form */}
            {this.state.isGenerated && this.directionsRequest()}
          </Card.Body>

          <Card.Footer style={{ height: '100px' }} id="locationUpdate" className="text-muted"></Card.Footer>
        </Card>
      </div>
    );
  }
}

export default AutoGenerateTrack;
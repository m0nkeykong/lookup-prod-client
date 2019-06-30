import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import Geocode from 'react-geocode';
import { BeatLoader } from 'react-spinners';
import { GoogleMap, LoadScript, DirectionsService } from '@react-google-maps/api';
import { Button, Card, Form, InputGroup, Modal, ButtonToolbar, ProgressBar, Breadcrumb, ListGroup} from 'react-bootstrap';
import IoIosLocation from 'react-icons/lib/io/ios-location';
import { fetchDataHandleError, originURL } from '../globalService';
import LiveNavigation from './LiveNavigation';
import {getGoogleApiKey} from '../globalService';
import './style/AutoGenerateTrack.css';
import Menu from './Menu';
import { Icon } from 'semantic-ui-react'

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
      isCustomGenerated: false,
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

    this.setPoints = this.setPoints.bind(this);

    this.getGeneratedTrackDetails = this.getGeneratedTrackDetails.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);
    
  }

  componentDidMount(){
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
		console.log(`Entered <AutoGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);

    // Get the user details from database
    axios.get(`${originURL}user/getAccountDetails/${this.userid}`)
      .then(userResponse => {
				this.setState({ userDetails: userResponse.data, loading: false, userResponse: true});
        console.log(userResponse.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Handle the input change
  handleInputChange(e){
    e.persist();
    console.log(e);
    if(e.target.value !== ''){
      this.setState(
        (prevState) => ({
          ...prevState,
          track: {...prevState.track, [e.target.name]: e.target.value},
        }), () => {
          console.log(this.state.track);
        }
      )
    }
    else{
      this.setState(
        (prevState) => ({
          ...prevState,
          track: {...prevState.track, [e.target.name]: ''},
        }), () => {
          console.log(this.state.track);
        }
      )
    }
  }

  // Handle the radio change
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

  // Getting the current location for input button
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

  // Handloing the form submit and continure to live navigation
  handleSubmit(e){
    e.persist();
    e.preventDefault();
    // After track created, set state to load Modal
    this.setState({ isGenerated: true });
    this.handleShowModal();
  }

  // Handle the close modal request
  handleCloseModal() {
    this.setState({ showModal: false, isGenerated: false, directionsResponse: null });
  }

  // Handle the show modal event
  handleShowModal() {
    this.setState({ showModal: true });
  }

  // Handle the discard modal event
  handleResetModal() {
    this.setState({ showModal: false, isGenerated: false, directionsResponse: null });
    this.setState({ track: { startPoint: '', endPoint: '', description: '', travelMode: 'WALKING', title: '' } })
  }

  // Generated track filled form
  getGeneratedTrackDetails(){
    console.log("Entered <AutoGenerateTrack></AutoGenerateTrack> getGeneratedTrackDetails()");
    const response = this.state.directionsResponse;
    var leg = ''; 
		if (response !== null) {
      if (response.status === 'OK') {
        leg = response.routes[0].legs[0];
        console.log(leg);
        return(
          <div>
            <div>
              <ListGroup variant="flush">
                <ListGroup.Item> <span className="autoSpan"> Track Title: </span> {this.state.track.title} </ListGroup.Item>
                <ListGroup.Item> <span className="autoSpan"> Description: </span> {this.state.track.description} </ListGroup.Item>
                <ListGroup.Item> <span className="autoSpan"> Travel Mode: </span> {this.state.track.travelMode} </ListGroup.Item>
                <ListGroup.Item> <span className="autoSpan"> From: </span> {leg.start_address} </ListGroup.Item>
                <ListGroup.Item> <span className="autoSpan"> To: </span> {leg.end_address} </ListGroup.Item>
                <ListGroup.Item> <span className="autoSpan"> Total Distance: </span> {leg.distance.text} </ListGroup.Item>
                <ListGroup.Item> <span className="autoSpan"> Estimated Duration: </span> {leg.duration.text} </ListGroup.Item>
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

  // Show generated track details
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

          <Modal.Footer>
          {console.log("GENERATED TRACK IS HERE:")}
          {console.log(this.state)}
              <NavLink to= {{pathname: `${process.env.PUBLIC_URL}/liveNavigation`, generatedTrack: this.state}}>
                {this.state.directionsResponse && <Button variant="primary" onClick={this.startLiveNavigation}>Live navigation</Button>}
                {this.state.directionsResponse === null && <Button disabled variant="primary" onClick={this.startLiveNavigation}>Live navigation</Button>}
              </NavLink>            

              <Button variant="secondary" onClick={this.handleCloseModal}>Edit</Button>
              <Button variant="dark" onClick={this.handleResetModal}>Discard</Button>
          </Modal.Footer>

        </Modal>
       </ButtonToolbar>      
      </div>
    )
  }

  // Showing track form
  showTrackForm(){
    return(
      <Card.Body>
      <Form onSubmit={e => this.handleSubmit(e)}>
        <Card.Title style={{ textAlign: 'center'}}>
          <h6> Choose Origin and Destination </h6>
        </Card.Title>

        <InputGroup className="mb-3">
          {/* @TODO: Let the user choose location from auto complete input */}
          <InputGroup.Prepend>
            <Button title="Get current location" onClick={ this.getCurrentLocation }> <IoIosLocation/> </Button>
          </InputGroup.Prepend>
          <Form.Control required type="text" placeholder="Enter Origin" value={this.state.track.startPoint} name="startPoint" onChange={e => {this.handleInputChange(e)}} ref={(input)=> this.myinput = input}/>
        </InputGroup>

        <Form.Group controlId="formDestination">
          {/* @TODO: Let the user choose location from auto complete input */}
          <Form.Control required type="text" placeholder="Enter Destination" value={this.state.track.endPoint} name="endPoint" onChange={this.handleInputChange}/>
        </Form.Group>

        <Card.Title style={{ textAlign: 'center'}}>
          <h6> Travel Mode </h6>
        </Card.Title>

        <Form.Group style={{ textAlign: 'center'}}>
        <Form.Check custom inline id="formWalking" type="radio" label="Walking" name="travelMode" checked={this.state.track.travelMode === 'WALKING'} value="WALKING" onChange={this.handleRadioChange}/><Icon name='male' size='large' />
        <Form.Check custom inline id="formBicycling" type="radio" label="Bicycling" name="travelMode" checked={this.state.track.travelMode === 'BICYCLING'} value="BICYCLING" onChange={this.handleRadioChange}/><Icon name='bicycle' size='large' />
        </Form.Group>

        <Card.Title style={{ textAlign: 'center'}}>
          <h6> Description and Title </h6>
        </Card.Title>

        <Form.Group controlId="formDescription">
          <Form.Control as="textarea" required type="text" placeholder="Description" value={this.state.track.description} name="description" onChange={this.handleInputChange}/>
        </Form.Group>

        {/* @TODO: Validate if title is unique before continue */}
        <Form.Group controlId="formTitle">
          <Form.Control required type="text" placeholder="Track Title" name="title" value={this.state.track.title} onChange={this.handleInputChange}/>
          <Form.Text className="text-muted" style={{float: 'left'}}>
            This is a unique name.
          </Form.Text>
        </Form.Group>
        <br/>

        <Card.Title style={{ textAlign: 'center'}}>
          <h6> Required settings </h6>
        </Card.Title>

        <Form.Group style={{ textAlign: 'center'}}>
          <Form.Check disabled custom inline id="formTolls" type="radio" checked={true} label="Avoid Tolls" name="avoidTolls" value="true"/>
          <Form.Check disabled custom inline id="formSafeWays" type="radio" checked={true} label="Safe Ways" name="safeWays" value="true"/>
          <Form.Check disabled custom inline id="formHighway" type="radio" checked={true} label="Avoid Highways" name="avoidHighways" value="true"/>
        </Form.Group>

        <Button style={{ margin: '0 auto', display: 'block'}} variant="primary" type="submit">
          Generate Route
        </Button>
      </Form>
    </Card.Body>
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
    if (response !== null) {
      if (response.status === 'OK') {
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
                      track: {...prevState.track, [point]: { city: pointDetails[0], country: pointDetails[1], lat: lat, lng: lng }}
                    }));
                  console.log("case 2");
                  break;
                // User writed only country, city, street
                case 3:
                  this.setState(
                    (prevState) => ({
                      ...prevState,
                      track: {...prevState.track, [point]: { street: pointDetails[0], city: pointDetails[1], country: pointDetails[2], lat: lat, lng: lng }}
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

  render() {    
    return (
      <div>
        <Card>

          {/* Show Menu And User Details When Page Stop Loading sessionStorage */}
          <Menu currentPage={"Auto Generate"}> </Menu>
          {/* {!this.state.loading && this.showMenu()} */}

          {/* Page BreadCrumbs */}
          <Breadcrumb>
            <Breadcrumb.Item href="/">Login</Breadcrumb.Item>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Auto</Breadcrumb.Item>
          </Breadcrumb>

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
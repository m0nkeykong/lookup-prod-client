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
        startPoint: '',
        endPoint: '',
        wayPoints: '',
        travelMode: 'WALKING',
        description: '',
        title: '',
        estimatedDuration: '',
        actualDuration: '',
        difficultyLevel: '',
        rating: '',
        changesDuringTrack: ''
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

    this.getGeneratedTrackDetails = this.getGeneratedTrackDetails.bind(this);
    this.getCurrentLocation = this.getCurrentLocation.bind(this);

    this.startLiveNavigation = this.startLiveNavigation.bind(this);
  }

  componentDidMount(){
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
		console.log(`Entered <AutoGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);

    // Get the user details from database
    axios.get(`https://db.lookup.band/user/getAccountDetails/${this.userid}`)
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

  // Change to class method
  directionsCallback = response => {
    console.log(`Entered directionsCallback, RESPONSE: `);
    console.log(response);
    if (response !== null) {
      if (response.status === 'OK') {
        const {leg} = response.routes[0].legs[0];
        
        // Set startPoint to Point Object and get its _id
        axios.post(`https://db.lookup.band/point/insertPoint`, {
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
        axios.post(`https://db.lookup.band/point/insertPoint`, {
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

        axios.post(`https://db.lookup.band/track/insertTrack`, {
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
        
        axios.put(`https://db.lookup.band/addTrackRecord/${this.userid}`, 
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

  startLiveNavigation(){

  }

  getGeneratedTrackDetails(){
    console.log("Entered <AutoGenerateTrack></AutoGenerateTrack> getGeneratedTrackDetails()");
    const response = this.state.directionsResponse;
    const leg = response.routes[0].legs[0];
		if (response !== null) {
      if (response.status === 'OK') {
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
      }
    }
    else{
      console.error('Response From Directions API is null');
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

          <Navbar.Brand href="/profile" style={{ float: 'left' }}>
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

          <Navbar.Brand href="/profile" style={{ float: 'center' }}>
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
            <Navbar.Collapse id="responsive-navbar-nav" >
              <Nav className="mr-auto">
                <Nav.Link href="/homePage">Home</Nav.Link>
                <Nav.Link href="/favorites">Favorite Tracks</Nav.Link>
                <NavDropdown title="Create Track" id="collasible-nav-dropdown">
                  <NavDropdown.Item href="/auto">Fast Track</NavDropdown.Item>
                  <NavDropdown.Item href="/custom">Custom Track</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/choose">Search Track</Nav.Link>
                <Nav.Link href="/about">About</Nav.Link>
                <Nav.Link href="/contactUs">Contact us</Nav.Link>
                <Nav.Link href="/">Disconnect</Nav.Link>
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
        language="English"
        version="3.36"
        region="US"
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
                callback={(response) => {this.setState({ directionsResponse: response })}}
              >
              </DirectionsService>
              }
            </GoogleMap>

          </div>

        </LoadScript>      
      
      </div>
    )
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
          
          <Card.Header> 
            <h6> Live Navigation Map </h6> 
            {/*
              <Map
              track={this.state.track}>
              </Map>
            */}
          </Card.Header>

          <Card.Body>
            {/* Send Directions API Request Only When The User Send The Required Track Details Form */}
            {this.state.isGenerated ? this.directionsRequest() : <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>}
          </Card.Body>

          <Card.Footer style={{ height: '100px' }} id="locationUpdate" className="text-muted"></Card.Footer>
        </Card>
      </div>
    );
  }
}
// Save - Save (DB) track without navigating
// Fast Travel - Navigate without saving ::: Warning Modal
// Save and Navigate - Save (DB) and Immidiatly start Navigation

export default AutoGenerateTrack;
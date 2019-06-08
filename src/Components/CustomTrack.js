import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import Geocode from 'react-geocode';
import { BeatLoader } from 'react-spinners';
import { GoogleMap, LoadScript, DirectionsService, DrawingManager } from '@react-google-maps/api';
import { Button, Card, Form, InputGroup, Modal, ButtonToolbar, ProgressBar, Breadcrumb, ListGroup } from 'react-bootstrap';
import IoIosLocation from 'react-icons/lib/io/ios-location';
import { fetchDataHandleError, originURL } from '../globalService';
import LiveNavigation from './LiveNavigation';
import { getGoogleApiKey } from '../globalService';
import './style/AutoGenerateTrack.css';
import Menu from './Menu';



/*/ **********************************

  1. need to fix the directionsCallback.
  2. need to adjust the bluetooth buttons location
  3. needs to see that all is getting saved in DB
  4. needs to fix the re-letter on markers after removing one
  5. needs to add search
  6. change saving of marker parameters in an outside var in state


// **********************************/
var EventEmitter = require('events');
var ee = new EventEmitter();

class CustomTrack extends Component {
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
        wayPoints: [],
        travelMode: 'WALKING',
        description: '',
        title: '',
        distance: '',
        rating: '',
        disabledTime: '',
        nonDisabledTime: '',

        estimatedDuration: '',
        difficultyLevel: '',
      },
      markerObjects: [],
      markerPoints: []
    }

    this.mode = ["drawing"];
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleResetModal = this.handleResetModal.bind(this);

    this.showTrackModal = this.showTrackModal.bind(this);
    this.showTrackForm = this.showTrackForm.bind(this);

    this.setPoints = this.setPoints.bind(this);
    this.searchAddress = this.searchAddress.bind(this);
    this.getTrackDetails = this.getTrackDetails.bind(this);


    this.onMarkerMounted = element => {
      this.setState(prevState => ({
        markerObjects: [...prevState.markerObjects, element]
      }))
    };
  }

  componentDidMount() {
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
    console.log(`Entered <AutoGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);

    // Get the user details from database
    axios.get(`${originURL}user/getAccountDetails/${this.userid}`)
      .then(userResponse => {
        this.setState({ userDetails: userResponse.data, loading: false, userResponse: true });
        console.log(userResponse.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Handle the input change
  handleInputChange(e) {
    e.persist();
    console.log(e);
    if (e.target.value !== '') {
      this.setState(
        (prevState) => ({
          ...prevState,
          track: { ...prevState.track, [e.target.name]: e.target.value },
        }), () => {
          console.log(this.state.track);
        }
      )
    }
    else {
      this.setState(
        (prevState) => ({
          ...prevState,
          track: { ...prevState.track, [e.target.name]: '' },
        }), () => {
          console.log(this.state.track);
        }
      )
    }
  }

  // Handle search address request
  searchAddress() {
    console.log("search requested");
  }

  // Handle the radio change
  handleRadioChange(e) {
    e.persist();
    e.target.checked &&
      this.setState(
        (prevState) => ({
          ...prevState,
          track: { ...prevState.track, [e.target.name]: e.target.value },
        })
      )
  }

  // Handloing the form submit and continure to live navigation
  handleSubmit(e) {
    e.persist();
    e.preventDefault();
    // here, the user asked to start to build the route
    // split all the markers by points

    let wayPts = JSON.parse(JSON.stringify(this.state.markerPoints));

    let origin = wayPts[0].lat+',';
    origin += +wayPts[0].lng;
    wayPts.splice(0, 1);

    let ending = wayPts[wayPts.length - 1].lat+',';
    ending += +wayPts[wayPts.length - 1].lng;
    wayPts.splice(wayPts.length - 1, 1);

    let wpObj = {
      location: '',
      stopover: true
    }

    let wpArr = [];

    wayPts.forEach((point) => {
      wpObj.location = point.lat+',';
      wpObj.location += +point.lng;
      wpArr.push(wpObj);
    });
    


    this.setState(
      (prevState) => ({
        ...prevState,
        track: { ...prevState.track,
          startPoint: origin,
          endPoint: ending,
          wayPoints: wpArr
           }
      })
    )

    console.log(origin);
    console.log(ending);
    console.log(wpArr);
    
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
    this.setState({ track: { startPoint: '', endPoint: '', description: '', travelMode: 'WALKING', title: '', wayPoints: [] } })
    this.state.markerObjects.forEach((marker) => {
      marker.setMap(null);
    })
  }

  // Generated track filled form
  getTrackDetails() {
    console.log("Entered <AutoGenerateTrack></AutoGenerateTrack> getTrackDetails()");
    const response = this.state.directionsResponse;
    var leg = '';
    if (response !== null) {
      if (response.status === 'OK') {
        leg = response.routes[0].legs[0];
        console.log(leg);
        return (
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
        return (<div />);
      }
    }
    else {
      console.error('Response From Directions API is null');
      return (<div />);
    }
  }

  // Show generated track details
  showTrackModal() {
    return (
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
                  this.getTrackDetails()
                )
                :
                (
                  <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
                )
              }

            </Modal.Body>

            <Modal.Footer>
              <NavLink to={{ pathname: `${process.env.PUBLIC_URL}/liveNavigation`, generatedTrack: this.state }}>
                <Button variant="primary" onClick={this.startLiveNavigation}>Live navigation</Button>
              </NavLink>

              <Button variant="secondary" onClick={this.handleCloseModal}>Save</Button>
              {/* @TODO: Save only button */}
              <Button variant="dark" onClick={this.handleResetModal}>Discard</Button>
            </Modal.Footer>

          </Modal>
        </ButtonToolbar>
      </div>
    )
  }

  // Showing track form
  showTrackForm() {
    return (
      <Card.Body>
        <Form onSubmit={e => this.handleSubmit(e)}>
          <Card.Title>
            <h6> Search </h6>
          </Card.Title>

          <InputGroup className="mb-3">
            {/*<Form.Label>Origin</Form.Label>*/}
            {/* @TODO: Let the user choose location from auto complete input */}
            <InputGroup.Append>
              <Button title="Search" onClick={this.searchAddress}> Search </Button>
            </InputGroup.Append>
            <Form.Control type="text" placeholder="Enter Address" />
          </InputGroup>

          <Card.Header>
            <h6> Live Navigation Map </h6>
          </Card.Header>
          <Card.Body>
            <div style={{
              margin: "0 auto",
              height: "400px",
              maxWidth: "90%"
            }}>

              <LoadScript
                id="script-loader"
                googleMapsApiKey={getGoogleApiKey()}
                onError={this.onLoadScriptError}
                onLoad={this.onLoadScriptSuccess}
                language="English"
                version="3.36"
                region="US"
                libraries={this.mode}
              >
                <GoogleMap
                  id="circle-example"
                  mapContainerStyle={{
                    margin: "0 auto",
                    height: "400px",
                    width: "100%"
                  }}
                  zoom={10}
                  center={{
                    lat: 32.083549,
                    lng: 34.815498
                  }}
                >
                  <DrawingManager
                    onLoad={drawingManager => {
                      console.log(drawingManager);

                      drawingManager.setOptions({
                        drawingControlOptions: {
                          drawingModes: ['marker']
                        },
                        drawingControl: true
                      });
                    }}

                    // handle marker addition
                    // ******************************************************************
                    onMarkerComplete={(marker) => {

                      // save marker into marker array
                      this.onMarkerMounted(marker);

                      marker.setOptions({
                        draggable: true
                      });

                      // set attributes for marker
                      marker.set("type", "point");

                      // update the marker id
                      marker.set("id", this.state.markerObjects.length);

                      // get marker id in Char
                      marker.setOptions({
                        label: {
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '10px',
                          text: nextChar(marker.get("id"))
                        }
                      });

                      // get the lng and lat as string
                      let objLatLng = marker.getPosition().toString().replace("(", "").replace(")", "").split(',');
                      let Lat = objLatLng[0].toString();
                      let Lng = objLatLng[1].toString();

                      // echo to console for checks
                      console.log("lat: " + Lat + "  Lng: " + Lng);
                      console.log("marker " + marker.get("id") + " has been placed by user");

                      // create marker lat\lng object at waypoints array
                      let mrkrwaypt = { lat: Lat, lng: Lng, id: marker.get("id") };
                      this.setState(prevState => ({
                        markerPoints: [...prevState.markerPoints, mrkrwaypt]
                      }));


                      // handle marker location change
                      // -------------------------------------------------------
                      marker.addListener('dragend', () => {
                        let objLatLng = marker.getPosition().toString().replace("(", "").replace(")", "").split(',');
                        let Lat = objLatLng[0].toString();
                        let Lng = objLatLng[1].toString();
                        console.log("lat: " + Lat + "   Lng: " + Lng);
                        console.log("marker " + marker.get("id") + " has been moved to a different location");
                        let mrkrwaypt = { lat: Lat, lng: Lng, id: marker.get("id") };

                        // update marker lat\lng at waypoints array
                        let wayPts = JSON.parse(JSON.stringify(this.state.markerPoints));
                        wayPts[marker.get('id')] = mrkrwaypt;
                        
                        this.setState(prevState => ({
                          markerPoints: wayPts
                        }));

                        console.log(this.state.markerPoints);
                      });
                      // -------------------------------------------------------


                      // handle click on marker - remove it from waypoints
                      // -------------------------------------------------------
                      marker.addListener('click', () => {
                        marker.setMap(null);
                        console.log("marker " + marker.get("id") + " has been removed by user");

                        // remove marker from waypoints array
                        let wayPts = JSON.parse(JSON.stringify(this.state.markerPoints))

                        // handle to iterator to fix the markers\waypoints indexes
                        // check for bugs
                        for (let i = marker.get('id'); i <= wayPts.length - 2; ++i) {
                          wayPts[i] = wayPts[i + 1];
                        }
                        wayPts.splice(wayPts.length - 1, 1);

                        // update in state
                        this.setState(prevState => ({
                          markerPoints: wayPts
                        }));

                        // this loop needs to be called in each marker - this will update its marker index letter
                        // *** this needs to be checked regarding the letter update of waypoints *** //
                        // this.state.markerObjects.forEach((mrkr) => {
                        //   mrkr.setOptions({
                        //     label: {
                        //       color: 'white',
                        //       fontWeight: 'bold',
                        //       fontSize: '10px',
                        //       text: nextChar(marker.get("id"))
                        //     }
                        //   });
                        // });
                        //console.log(this.state.markerObjects);
                      });
                      // -------------------------------------------------------
                    }}
                  // ******************************************************************
                  >
                  </DrawingManager>
                </GoogleMap>
              </LoadScript>
            </div>

          </Card.Body>

          <Card.Title>
            <h6> Travel Mode </h6>
          </Card.Title>

          <Form.Group>
            <Form.Check custom inline id="formWalking" type="radio" label="Walking" name="travelMode" checked={this.state.track.travelMode === 'WALKING'} value="WALKING" onChange={this.handleRadioChange} />
            <Form.Check custom inline id="formBicycling" type="radio" label="Bicycling" name="travelMode" checked={this.state.track.travelMode === 'BICYCLING'} value="BICYCLING" onChange={this.handleRadioChange} />
          </Form.Group>

          <Card.Title>
            <h6> Description and Title </h6>
          </Card.Title>

          <Form.Group controlId="formDescription">
            <Form.Control as="textarea" required type="text" placeholder="Description" value={this.state.track.description} name="description" onChange={this.handleInputChange} />
          </Form.Group>

          {/* @TODO: Validate if title is unique before continue */}
          <Form.Group controlId="formTitle">
            <Form.Control required type="text" placeholder="Track Title" name="title" value={this.state.track.title} onChange={this.handleInputChange} />
            <Form.Text className="text-muted" style={{ float: 'left' }}>
              This is a unique name.
          </Form.Text>
          </Form.Group>
          <br />

          <Card.Title>
            <h6> Additional settings </h6>
          </Card.Title>

          <Form.Group>
            <Form.Check disabled custom inline id="formTolls" type="radio" checked={true} label="Avoid Tolls" name="avoidTolls" value="true" />
            <Form.Check disabled custom inline id="formSafeWays" type="radio" checked={true} label="Safe Ways" name="safeWays" value="true" />
            <Form.Check disabled custom inline id="formHighway" type="radio" checked={true} label="Avoid Highways" name="avoidHighways" value="true" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Build Route
        </Button>
        </Form>
      </Card.Body>
    )
  }

  directionsRequest() {
    return (
      <div>

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

      </div>
    )
  }

  setPoints() {
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
              track: { ...prevState.track, distance: leg.distance.value, estimatedDuration: leg.duration.value, disabledTime: '', nonDisabledTime: '', rating: 0 },
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

              switch (pointDetails.length) {
                // User writed only country
                case 1:
                  this.setState(
                    (prevState) => ({
                      ...prevState,
                      track: { ...prevState.track, [point]: { country: pointDetails[0], lat: lat, lng: lng } },
                    }));
                  console.log("case 1");
                  break;
                // User writed only country, city
                case 2:
                  this.setState(
                    (prevState) => ({
                      ...prevState,
                      track: { ...prevState.track, [point]: { country: pointDetails[0], city: pointDetails[1], lat: lat, lng: lng } }
                    }));
                  console.log("case 2");
                  break;
                // User writed only country, city, street
                case 3:
                  this.setState(
                    (prevState) => ({
                      ...prevState,
                      track: { ...prevState.track, [point]: { country: pointDetails[0], city: pointDetails[1], street: pointDetails[2], lat: lat, lng: lng } }
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

        ee.emit('pointObject', startPointArray, startPoint, 'startPointObj');
        ee.emit('pointObject', endPointArray, endPoint, 'endPointObj');
        ee.emit('trackObj');
      }
      else {
        console.error(`Response From Directions API Was Returned With Status ${response.status}`);
        return (<div />);
      }
    }
    else {
      console.error('Response From Directions API is null');
      return (<div />);
    }
  }

  render() {
    return (
      <div>
        <Card className="text-center">

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
          {this.state.isGenerated && this.showTrackModal()}

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
// show marker label by ABC chars and not numbers
const nextChar = (id) => {
  var char = 'A';
  return String.fromCharCode(char.charCodeAt(0) + (id) - 1);
}

export default CustomTrack;
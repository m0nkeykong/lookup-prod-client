import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import Geocode from 'react-geocode';
import { BeatLoader } from 'react-spinners';
import { GoogleMap, LoadScript, DirectionsService, DrawingManager } from '@react-google-maps/api';
import { Button, Card, Form, InputGroup, Modal, ButtonToolbar, ProgressBar, Breadcrumb, ListGroup, Alert } from 'react-bootstrap';
import { getGoogleApiKey, fetchDataHandleError, originURL } from '../globalService';
import LiveNavigation from './LiveNavigation';
import './style/AutoGenerateTrack.css';
import Menu from './Menu';
import { lookup } from 'dns';
import { Icon } from 'semantic-ui-react'
import { rank, accessibility, disabledFactor } from '../MISC';

const _ = require('lodash');


var EventEmitter = require('events');
var ee = new EventEmitter();

class CustomTrack extends Component {
  constructor(props) {
    super(props);
    this._map = null;
    this.state = {
      showHelp: true,
      userResponse: null,
      directionsResponse: null,
      userDetails: [],
      isCustomGenerated: false,
      isCustomGenerated: false,
      loading: true,
      startLiveNavigation: false,
      searchInput: '',
      mapVars: {
        zoom: 10,
        longitude: 34.815498,
        latitude: 32.083549
      },

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
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);

    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.handleResetModal = this.handleResetModal.bind(this);

    this.showTrackModal = this.showTrackModal.bind(this);
    this.showTrackForm = this.showTrackForm.bind(this);

    this.setPoints = this.setPoints.bind(this);
    this.searchAddress = this.searchAddress.bind(this);
    this.getTrackDetails = this.getTrackDetails.bind(this);


    this.onMarkerMounted = this.onMarkerMounted.bind(this);
    this.handleMarker = this.handleMarker.bind(this);

    this.closeHelp = this.closeHelp.bind(this);
  }

  closeHelp() {
    this.setState({ showHelp: false });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        this.setState(
          (prevState) => ({
            mapVars: { zoom: 13, latitude: pos.coords.latitude, longitude: pos.coords.longitude },
          }), () => {
            console.log(this.state.mapVars);
          }
        );
      }, (err) => {
        console.error(`ERROR(${err.code}): ${err.message}`);
      });
    }
  }

  handleMarker(marker) {

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
    console.log("lat: " + Lat + "  lng: " + Lng);
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

      this.setState({
        markerPoints: wayPts
      });
    });
    // -------------------------------------------------------


    // handle click on marker - remove it from waypoints
    // -------------------------------------------------------
    marker.addListener('click', () => {
      let markersPTR = this.state.markerObjects

      // remove marker from markers array
      for (let i = 0; i < markersPTR.length; i++) {
        if (markersPTR[i].getPosition().equals(marker.getPosition())) {
          markersPTR.splice(i, 1);
        }
      }

      // remove marker from waypoints array
      let wayPts = JSON.parse(JSON.stringify(this.state.markerPoints))

      for (let i = marker.get('id'); i <= wayPts.length - 2; ++i) {
        wayPts[i] = wayPts[i + 1];
      }

      wayPts.splice(wayPts.length - 1, 1);

      // update in state
      this.setState({
        markerPoints: wayPts
      });

      //this loop updates the markers index letters
      for (let i = 0; i < markersPTR.length; ++i) {
        markersPTR[i].set("id", i + 1);
        markersPTR[i].setOptions({
          label: {
            color: 'white',
            fontWeight: 'bold',
            fontSize: '10px',
            text: nextChar(markersPTR[i].id)
          }
        });
      }

      // unmount marker from map
      marker.setMap(null);
      console.log("marker " + marker.get("id") + " has been removed by user");
    });
    // -------------------------------------------------------
  }

  componentDidMount() {
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
    console.log(`Entered <CustomeGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);

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

  onMarkerMounted(element) {
    this.setState(prevState => ({
      markerObjects: [...prevState.markerObjects, element]
    }))
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

  // Handle the search input change
  handleSearchInputChange(e) {
    e.persist();
    console.log(e);
    if (e.target.value !== '') {
      this.setState(
        (prevState) => ({
          [e.target.name]: e.target.value
        }), () => {
          console.log(this.state.searchInput);
        }
      )
    }
    else {
      this.setState(
        (prevState) => ({
          [e.target.name]: ''
        }), () => {
          console.log(this.state.searchInput);
        }
      )
    }
  }

  // Handle search address request
  searchAddress() {
    if (this.state.searchInput !== '') {
      console.log("search requested for: " + this.state.searchInput);

      // convert address from user to lat\lng
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.state.searchInput + '&key=' + getGoogleApiKey())
        .then((response) => {
          return response.json();
        })
        .then((myJson) => {
          console.log(myJson.results[0].geometry.location);
          console.log("zooming map on query...");
          let lat = myJson.results[0].geometry.location.lat;
          let lng = myJson.results[0].geometry.location.lng;

          // update map location accordingly
          this.setState((prevState) => ({
            ...prevState,
            mapVars: { longitude: lng, latitude: lat, 'zoom': 16 }
          }))
        });
    } else {
      console.log("User did not enter query for search, alerting");
      alert("Please enter an address to search");
    }
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
    if (this.state.markerPoints.length >= 2) {
      // here, the user asked to start to build the route
      // split all the markers by points
      
      let wayPts = JSON.parse(JSON.stringify(this.state.markerPoints));

      let origin = wayPts[0].lat + ',';
      origin += +wayPts[0].lng;
      wayPts.splice(0, 1);

      let ending = wayPts[wayPts.length - 1].lat + ',';
      ending += +wayPts[wayPts.length - 1].lng;
      wayPts.splice(wayPts.length - 1, 1);



      let wpArr = [];


      for (let i = 0; i < wayPts.length; ++i) {
        let wpObj = {
          location: wayPts[i].lat + ',' + wayPts[i].lng,
          stopover: true
        }
        wpArr.push(wpObj);
      };


      this.setState(
        (prevState) => ({
          ...prevState,
          track: {
            ...prevState.track,
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
      this.setState({ isCustomGenerated: true });
      this.handleShowModal();
    } else {
      console.log('User entered only 1 point, alerting');
      alert("Whoops! Please enter at least two point to navigate");
    }
  }

  // Handle the close modal request
  handleCloseModal() {
    this.setState({ showModal: false, isCustomGenerated: false, directionsResponse: null });
  }

  // Handle the show modal event
  handleShowModal() {
    this.setState({ showModal: true });
  }

  // Handle the discard modal event
  handleResetModal() {
    this.setState({ showModal: false, isCustomGenerated: false, directionsResponse: null, markerObjects: [], markerPoints: [] });
    this.setState({ track: { startPoint: '', endPoint: '', description: '', travelMode: 'WALKING', title: '', wayPoints: [] } });

    this.state.markerObjects.forEach((marker) => {
      marker.setMap(null);
    })
  }

  // Generated track filled form
  getTrackDetails() {
    console.log("Entered <CustomGenerateTrack></CustomGenerateTrack> getGeneratedTrackDetails()");
    const response = this.state.directionsResponse;
    var leg = '';
    var estimatedTime = 0;
    var d = 0;

    if (response !== null) {
      if (response.status === 'OK') {
        leg = response.routes[0].legs[0];
        console.log(leg);

        if (leg.duration.value) {
          if (this.state.userDetails.accessibility == 'Disabled') {
            let tempDuration = parseFloat(leg.duration.value);
            d = tempDuration * disabledFactor;
            console.log("UPDATED TIME");
            console.log(d);
          }
          else {
            d = parseFloat(leg.duration.value);
            console.log("UPDATED TIME2");
            console.log(d);
          }

          var h = Math.floor(d / 3600);
          var m = Math.floor(d % 3600 / 60);
          var s = Math.floor(d % 3600 % 60);

          var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
          var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
          var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

          estimatedTime = hDisplay + mDisplay + sDisplay;
          //this.setState(prevState => ({ track: { ...prevState.state, ['estimatedDuration']: estimatedTime } }));
        }

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
                <ListGroup.Item> <span className="autoSpan"> Estimated Duration: </span> {this.state.track.estimatedDuration} </ListGroup.Item>
              </ListGroup>
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
            centered>
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
              {console.log("GENERATED TRACK IS HERE:")}
              {console.log(this.state)}
              <NavLink to={{ pathname: `${process.env.PUBLIC_URL}/liveNavigation`, generatedTrack: this.state }}>
                <Button variant="primary" onClick={this.startLiveNavigation}>Live navigation</Button>
              </NavLink>
              <Button variant="secondary" onClick={this.handleCloseModal}>Save</Button>
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

        <Card.Title style={{ textAlign: 'center'}}>
          <h6> Search </h6>
        </Card.Title>
        <p id='searchAlert'></p>

        <InputGroup className="mb-3">
          <InputGroup.Append>
            <Button title="Search" onClick={this.searchAddress}> Search </Button>
          </InputGroup.Append>
          <Form.Control name="searchInput" type="text" placeholder="Enter Address" onChange={this.handleSearchInputChange} />
        </InputGroup>

        <Modal
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          show={this.state.showHelp} onHide={this.closeHelp}>
          <Modal.Header closeButton>
            <Modal.Title>Instructions</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img alt="handIcon" src={`/images/searchIcon.png`} style={{ height: '40px', width: '60px' }}></img><br></br>
            Use the search bar to focus the map on a certain address.<br></br><br></br>
            <img alt="markerIcon" src={`/images/markerIcon.png`} style={{ height: '40px', width: '40px' }}></img><br></br>
            Use the marker icon to add points/waypoints to your track.<br></br><br></br>
            <img alt="handIcon" src={`/images/handIcon.png`} style={{ height: '40px', width: '40px' }}></img><br></br>
            Use the hand marker to move the map.<br></br>
            You can move markers by dragging them.<br></br>
            To remove a marker, simply click on it.<br></br>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeHelp}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Form onSubmit={e => this.handleSubmit(e)}>
          <Card.Header style={{ textAlign: 'center'}}>
            Planning Map
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
                <GoogleMap ref={map => this._map = map}
                  id="circle-example"
                  mapContainerStyle={{
                    margin: "0 auto",
                    height: "400px",
                    width: "100%"
                  }}
                  zoom={this.state.mapVars.zoom}
                  center={{
                    lat: this.state.mapVars.latitude,
                    lng: this.state.mapVars.longitude
                  }}

                  onZoomChanged={() => {
                    this.setState((prevState) => ({
                      mapVars: { ...prevState.mapVars, ['zoom']: this._map.state.map.zoom },
                    }))
                  }}

                  onDragEnd={() => {
                    this.setState((prevState) => ({
                      mapVars: {
                        ...prevState.mapVars,
                        ['latitude']: this._map.state.map.center.lat(),
                        ['longitude']: this._map.state.map.center.lng()
                      },
                    }))
                  }}
                >

                  <DrawingManager
                    onLoad={drawingManager => {
                      drawingManager.setOptions({
                        drawingControlOptions: {
                          drawingModes: ['marker']
                        },
                        drawingControl: true
                      });
                    }}

                    onMarkerComplete={this.handleMarker}

                  >
                  </DrawingManager>
                </GoogleMap>
              </LoadScript>
            </div>

          </Card.Body>

          <Card.Title style={{ textAlign: 'center'}}>
            <h6> Travel Mode </h6>
          </Card.Title>

          <Form.Group style={{ textAlign: 'center'}}>
            <Form.Check custom inline id="formWalking" type="radio" label="Walking" name="travelMode" checked={this.state.track.travelMode === 'WALKING'} value="WALKING" onChange={this.handleRadioChange} /><Icon name='male' size='large' />
            <Form.Check custom inline id="formBicycling" type="radio" label="Bicycling" name="travelMode" checked={this.state.track.travelMode === 'BICYCLING'} value="BICYCLING" onChange={this.handleRadioChange} /><Icon name='bicycle' size='large' />
          </Form.Group>

          <Card.Title style={{ textAlign: 'center'}}>
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

          <Card.Title style={{ textAlign: 'center'}}>
            <h6> Required Settings </h6>
          </Card.Title>

          <Form.Group style={{ textAlign: 'center'}}>
            <Form.Check disabled custom inline id="formTolls" type="radio" checked={true} label="Avoid Tolls" name="avoidTolls" value="true" />
            <Form.Check disabled custom inline id="formSafeWays" type="radio" checked={true} label="Safe Ways" name="safeWays" value="true" />
            <Form.Check disabled custom inline id="formHighway" type="radio" checked={true} label="Avoid Highways" name="avoidHighways" value="true" />
          </Form.Group>

          <Button  style={{ margin: '0 auto', display: 'block'}} variant="primary" type="submit">
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
                  console.log('<CustomGenerateTeack></CustomGenerateTeack> setPoints() Incorrect address');
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
        <Card>

          {/* Show Menu And User Details When Page Stop Loading sessionStorage */}
          <Menu currentPage={"Custom Track"}> </Menu>
          {/* {!this.state.loading && this.showMenu()} */}

          {/* Page BreadCrumbs */}
          <Breadcrumb>
            <Breadcrumb.Item href="/">Login</Breadcrumb.Item>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Custom</Breadcrumb.Item>
          </Breadcrumb>

          {/* Show Generate Track Form When Page Stop Loading sessionStorage */}
          {this.state.userResponse && this.showTrackForm()}

          {/* Generated Track Modal */}
          {this.state.isCustomGenerated && this.showTrackModal()}

          <Card.Body>
            {/* Send Directions API Request Only When The User Send The Required Track Details Form */}
            {this.state.isCustomGenerated && this.directionsRequest()}
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
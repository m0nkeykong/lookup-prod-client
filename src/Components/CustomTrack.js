import React, { Component } from 'react';
import Map from './Map';
import { BeatLoader } from 'react-spinners';
import './style/AutoGenerateTrack.css';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer, DrawingManager } from '@react-google-maps/api';
import { getGoogleApiKey } from '../globalService';
import { Button, Card, Form, Col, Row, Container, Navbar, NavItem, NavDropdown, Nav, MenuItem } from 'react-bootstrap';

class CustomTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userDetails: [],
      origin: '',
      destination: '',
      travelMode: 'WALKING',
      response: null,
      track: {
        startPoint: null,
        endPoint: null,
        wayPoints: [],
        travelMode: null
      },
      markers: 0
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);

    this.getGeneratedTrack = this.getGeneratedTrack.bind(this);
    this.getAllTracks = this.getAllTracks.bind(this);    
    this.mode = ["drawing"];
  }

  componentDidMount(){
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
		console.log(`Entered <AutoGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);

    // Get the user details from database
    axios.get(`https://db.lookup.band/user/getAccountDetails/${this.userid}`)
      .then(response => {
				this.setState({ userDetails: response.data });
        this.setState({ loading: false });
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  onSubmit(e){
    e.preventDefault();
  }

  onChange(e){
    console.log("Entered onChange function");
    const {name} = e.target.name;
    const {value} = e.target.value;
    console.log(`name: ${name}, value: ${value}`);
    if(name && value){
      // Insert the changed value into state array
      this.setState({ direction: [...this.state.direction, {name: value}] });
    }
    console.log(`Updated state direction object [{name: value:}] >> ${this.state.direction}`);
  }

  renderForm(){

  }

  getGeneratedTrack(){

  }
  
  getAllTracks(){

  }

  // Change to class method
  checkBicycling = ({ target: { checked } }) => {
    console.log(`Entered checkBicycling ${checked}`);
    checked &&
      this.setState(
        () => ({
          travelMode: 'BICYCLING'
        })
      )
  }

  // Change to class method
  checkWalking = ({ target: { checked } }) => {
    console.log(`Entered checkWalking ${checked}`);
    checked &&
      this.setState(
        () => ({
          travelMode: 'WALKING'
        })
      )
  }

  // Change to class method
  getOrigin = ref => {
    console.log(`Entered getOrigin ${ref}`);
    this.origin = ref
  }

// Change to class method
    getWayPoints = ref => {
        console.log(`Entered getWayPoints ${ref}`);
        this.wayPoints = ref
    }

  // Change to class method
  onClick = () => {
    console.log(`Entered onClick`);
    if (this.origin.value !== '' && this.destination.value !== '') {
        if (this.wayPoints.value !== ''){
            var waypts = this.state.track.wayPoints;
            waypts.push({
                location: this.wayPoints.value,
                stopover: true
            });
        } else {
            var waypts = null;
        }
      this.setState(
        (prevState) => ({
          // track: [...prevState, {
          //   startPoint: this.origin.value,
          //   endPoint:  this.destination.value,
          //   wayPoints: null,
          //   travelMode: this.state.travelMode
          // }]
          track: {
            startPoint: this.origin.value,
            endPoint:  this.destination.value,
            wayPoints: waypts,
            travelMode: this.state.travelMode
          }
        }), () => {
          console.log(this.state.track);
        }
      )
      this.setState({ loading: true });
    }
    else{
      console.log(`Entered Invalid value, ORIGIN: ${this.origin.value}, DESTINATION: ${this.origin.destination}`);
    }
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
          wayPoints: this.wayPoints,
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

  render() {
    return (
      <div>
        <Card className="text-center">

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

          <Card.Body>
            <Card.Title>
              <h6> Search </h6>
           </Card.Title>

            <Container>
              <Row>
                <Col>
                  <Form.Group as={Row} controlId="ORIGIN">
                    <Form.Control type="Text" placeholder="Enter Address..." ref={this.getOrigin} />
                  </Form.Group>
                </Col>
              <button className='btn btn-primary' type='button' onClick={this.onClick}>
                Search
            </button>
              </Row>
            </Container>

            
            <div className='d-flex flex-wrap justify-content-md-center'>
              <div className='form-group custom-control custom-radio mr-4 justify-content-md-center' >
                <input
                  id='WALKING'
                  className='custom-control-input'
                  name='travelMode'
                  type='radio'
                  checked={this.state.travelMode === 'WALKING'}
                  onChange={this.checkWalking}
                />
                <label className='custom-control-label' htmlFor='WALKING'>Walking</label>
              </div>

              <div className='form-group custom-control custom-radio mr-4 justify-content-md-center' >
                <input
                  id='BICYCLING'
                  className='custom-control-input'
                  name='travelMode'
                  type='radio'
                  checked={this.state.travelMode === 'BICYCLING'}
                  onChange={this.checkBicycling}
                />
                <label className='custom-control-label' htmlFor='BICYCLING'>Bicycling</label>
              </div>
            </div>

          </Card.Body>

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
                onMarkerComplete ={(marker) => {
                  marker.setOptions({
                    draggable: true
                  });

                  // set attributes for marker
                  marker.set("type", "point");

                  // update the marker id
                  marker.set("id", this.state.markers);
                  marker.setOptions({
                    label: nextChar(marker.get("id"))
                  });

                  this.setState(prevState => ({ markers: prevState.markers + 1}));
                  var objLatLng = marker.getPosition().toString().replace("(", "").replace(")", "").split(',');
                  var Lat = objLatLng[0].toString().replace(/(\.\d{1,7})\d*$/, "$1");  // Set 7 Digits after comma;
                  var Lng = objLatLng[1].toString().replace(/(\.\d{1,7})\d*$/, "$1");  // Set 7 Digits after comma;
                  console.log("lat: " + Lat + "   Lng: " + Lng); 
                  console.log("marker " + marker.get("id") + " has been placed by user");
                  
                  // create marker lat\lng object at waypoints array
                  let mrkrwaypt = { lat: Lat, lng: Lng, id: marker.get("id")};
                  this.setState(prevState => ({
                    track: {
                      startPoint: prevState.startPoint,
                      endPoint: prevState.endPoint,
                      wayPoints: [...prevState.track.wayPoints, mrkrwaypt],
                      travelMode: prevState.travelMode
                    }
                  }))
                  

                  // handle marker location change
                  marker.addListener('dragend', () => {
                    var objLatLng = marker.getPosition().toString().replace("(", "").replace(")", "").split(',');
                    var Lat = objLatLng[0].toString().replace(/(\.\d{1,7})\d*$/, "$1");  // Set 7 Digits after comma;
                    var Lng = objLatLng[1].toString().replace(/(\.\d{1,7})\d*$/, "$1");  // Set 7 Digits after comma;
                    console.log("lat: " + Lat + "   Lng: " + Lng);
                    console.log("marker " + marker.get("id") + " has been moved to a different location");
                    let mrkrwaypt = { lat: Lat, lng: Lng, id: marker.get("id") };
                    
                    // update marker lat\lng at waypoints array
                    let wayPts = JSON.parse(JSON.stringify(this.state.track.wayPoints))
                    wayPts[marker.get('id')] = mrkrwaypt;
                    this.setState(prevState => ({
                      track: {
                        startPoint: prevState.startPoint,
                        endPoint: prevState.endPoint,
                        travelMode: prevState.travelMode,
                        wayPoints: wayPts,
                      },
                    }));
                    console.log(this.state.track.wayPoints);
                  });

                  // handle click on marker - remove it from waypoints
                  marker.addListener('click', () => {
                    marker.setMap(null);
                    console.log("marker "+ marker.get("id") + " has been removed by user");

                    // remove marker from waypoints array
                    let wayPts = JSON.parse(JSON.stringify(this.state.track.wayPoints))
                    
                    // handle to iterator to fix the markers\waypoints indexes
                    // check for bugs
                    for (let i = marker.get('id'); i <= wayPts.length - 2; ++i) {
                      wayPts[i] = wayPts[i + 1];
                    }
                    wayPts.splice(wayPts.length - 1, 1);
                    
                    // update in state
                    this.setState(prevState => ({
                      track: {
                        startPoint: prevState.startPoint,
                        endPoint: prevState.endPoint,
                        travelMode: prevState.travelMode,
                        wayPoints: wayPts,
                      },
                    }));
                    this.setState(prevState => ({ markers: prevState.markers - 1 }));

                    // update the other markers label
                    // something with this functions and accessing all the other markers
                    // need to find a way to access other markers ~~map.getMarkers~~
                    marker.set("id", this.state.markers);
                    marker.setOptions({
                      label: nextChar(marker.get("id"))
                    });

                    console.log(this.state.track.wayPoints);
                  });
                }}
                
              />
            </GoogleMap>
      </LoadScript>
      </div>
          </Card.Body>
          <Card.Footer id="locationUpdate" className="text-muted">
            <button className='btn btn-primary' type='button' onClick={this.onClick}>
              Build Route
            </button>
          </Card.Footer>
        </Card>
      </div>
    );
  }
}

// show marker label by ABC chars and not numbers
const nextChar = (id) => {
  var char = 'A';
  return String.fromCharCode(char.charCodeAt(0) + id);
}

export default CustomTrack;
import React, { Component } from 'react';
import Map from './Map';
import { BeatLoader } from 'react-spinners';
import './style/AutoGenerateTrack.css';
import axios from 'axios';
import { GoogleMap, LoadScript, DrawingManager } from '@react-google-maps/api';
import { getGoogleApiKey } from '../globalService';
import { Card, Form, Col, Row, Container, Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { NavLink } from "react-router-dom";

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
      markerObjects: []
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onSubmit.bind(this);

    this.mode = ["drawing"];

    this.onMarkerMounted = element => {
      this.setState(prevState => ({
        markerObjects: [...prevState.markerObjects, element]
      }))
    };
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

    // here, the user asked to start to build the route
    // split all the markers by points
    let wayPts = JSON.parse(JSON.stringify(this.state.track.wayPoints));
    
    let origin = wayPts[0];
    wayPts.splice(0, 1);

    let ending = wayPts[wayPts.length - 1];
    wayPts.splice(wayPts.length - 1, 1);

    this.setState(
      (prevState) => ({
        track: {
          startPoint: origin,
          endPoint: ending,
          wayPoints: wayPts,
          travelMode: this.state.travelMode
        }
      }), () => {
        console.log(this.state.track);
      }
    )
    this.setState({ loading: true });
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
          report: `First auto generated track`,
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
              <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
              <NavLink to=
                //navigate to TrackDetails via TemplateComponent with the params
                {{pathname: `${process.env.PUBLIC_URL}/profile`}}
                  activeStyle={this.active} 
                  style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                  >View Profile</NavLink>

                <NavLink to=
                //navigate to TrackDetails via TemplateComponent with the params
                {{pathname: `${process.env.PUBLIC_URL}/favorites`}}
                  activeStyle={this.active} 
                  style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                  >Favorite Tracks</NavLink>

                <NavLink to=
                //navigate to TrackDetails via TemplateComponent with the params
                {{pathname: `${process.env.PUBLIC_URL}/auto`}}
                  activeStyle={this.active} 
                  style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                  >Generate Auto Track</NavLink>
                  
                <NavLink to=
                //navigate to TrackDetails via TemplateComponent with the params
                {{pathname: `${process.env.PUBLIC_URL}/choose`}}
                  activeStyle={this.active} 
                  style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                  >Choose Existing Tracks</NavLink>

                <NavLink to=
                //navigate to TrackDetails via TemplateComponent with the params
                {{pathname: `${process.env.PUBLIC_URL}/custom`}}
                  activeStyle={this.active} 
                  style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                  >Custom Made Track</NavLink>

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
                        track: {
                          startPoint: prevState.startPoint,
                          endPoint: prevState.endPoint,
                          wayPoints: [...prevState.track.wayPoints, mrkrwaypt],
                          travelMode: prevState.travelMode
                        }
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
                      // -------------------------------------------------------


                      // handle click on marker - remove it from waypoints
                      // -------------------------------------------------------
                      marker.addListener('click', () => {
                        marker.setMap(null);
                        console.log("marker " + marker.get("id") + " has been removed by user");

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
                          }
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
                        console.log(this.state.markerObjects);
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
          <Card.Footer id="locationUpdate" className="text-muted">
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
  return String.fromCharCode(char.charCodeAt(0) + (id) - 1);
}

export default CustomTrack;
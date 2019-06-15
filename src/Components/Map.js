import React, { Component } from 'react';
import './style/CustomTrack.css';
import axios from 'axios';
import 'react-notifications/lib/notifications.css';
import { BeatLoader } from 'react-spinners';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer, DrawingManager } from '@react-google-maps/api';
import {getGoogleApiKey} from '../globalService';
import './style/normalize.css';
import BluetoothTerminal from './BLEController';
import { originURL } from '../globalService';
import { NavLink} from "react-router-dom";



/*
TDL:
אל תשכח להוסיף בקוד שכשמסלול מסתיים - צריך לעדכן את הדאטאבייס
אלו הנתונים שצריך לעדכן:
changesDuringTrack
difficultyLevel
actualDuration
rating
ובכללי להציג את הנתונים האלה:
actualDuration, difficultyLevel, changesDuringTrack, distance(meters), rating, difficultyLevel, reports, travelMode, startPoint-endPoint
*/

class Map extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        userDetails: null,
        loading: true,
        CurrentPosition: {lat: 0, lng: 0},
        UpdatedPosition: {lat: 0, lng: 0},
				response: null,
        timestamp: 0,
        currStep: 0,
        startedNavigation: false,
        idOfTrack: this.props.idOfTrack,
        isLoadingIdOfTrack: true
    }

    // ****** bluetooth variables ******
    this.terminal = new BluetoothTerminal();

    this.receive = this.receive.bind(this);
    this._log = this._log.bind(this);
    this.send = this.send.bind(this);
    this.connectButton = this.connectButton.bind(this);
    this.disconnectButton = this.disconnectButton.bind(this);

    this.defaultDeviceName = 'LookUP';
    // ****** bluetooth variables ******

    this.onLoadPosition = this.onLoadPosition.bind(this);
    this.onLoadScriptError = this.onLoadScriptError.bind(this);
    this.onLoadScriptSuccess = this.onLoadScriptSuccess.bind(this); 

    this.onGoogleMapSuccess = this.onGoogleMapSuccess.bind(this);
    this.onGoogleMapClick = this.onGoogleMapClick.bind(this);

    this.onPolylineComplete = this.onPolylineComplete.bind(this);
    this.directionsCallback = this.directionsCallback.bind(this);

    this.newLocation = document.getElementById('printLocation');

    this.mode = ["drawing"];
  }


  // ****** bluetooth functions ******

  // log to console received data from component
  receive = () => {
    this.terminal.receive = (data) => {
      this.terminal._log(data);
    };
  }

  // log to console function
  _log = () => {
    this.terminal._log = (...messages) => {
      messages.forEach((message) => {
        console.log(message);
      });
    }
  }

  // send data to component and log it in the console
  send = (data) => {
    this.terminal.send(data).
      then(() => this.terminal._log(data)).
      catch((error) => this.terminal._log(error));
  };

  // connect button functionallity (open device browser)                  ------need to handle the device name------
  connectButton = () => {
    this.terminal.connect().
      then(() => {
        //this.refs.deviceNameLabel.textContent = this.terminal.getDeviceName() ? this.terminal.getDeviceName() : this.defaultDeviceName;
      });
  };

  // disconnect button functionallity (disconnet component)               ------need to handle the device name------
  disconnectButton = () => {
    this.terminal.disconnect();
    // this.refs.deviceNameLabel.textContent = this.defaultDeviceName;
  };

  postNavifation = () => {

  }
  // ****** bluetooth functions ******

  onLoadScriptSuccess(){
    console.log(" <LoadScript/> Success ");
  }

  onLoadScriptError(){
    console.log(" <LoadScript/> Error ");
  }

  onGoogleMapSuccess(){
    console.log(" <GoogleMap/> Success ");
  }

  onGoogleMapClick(...args){
    console.log(" onGoogleMapClick Success args: ",  args);
  }

  // Remember to replace this method because UNSAFE
  componentDidMount() {
    console.log("RONI RONI RONI RONI ORNI");
    console.log(this.state.idOfTrack);
    console.log(this.props.idOfTrack);
    let userid = JSON.parse(sessionStorage.getItem('userDetails'));
		console.log(`Entered <Map> componentDidMount(), fetching userid: ${userid}`);
		this.onLoadPosition();

    // Get the user details from database
    axios.get(`${originURL}user/getAccountDetails/${userid}`)
      .then(response => {
				this.setState({userDetails: response.data});
        this.onLoadPosition();
        this.setState({ loading: true, isLoadingIdOfTrack: false });

        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    // NotificationManager.info(message, title, timeOut, callback, priority);
    // NotificationManager.success(message, title, timeOut, callback, priority);
    // NotificationManager.warning(message, title, timeOut, callback, priority);
    // NotificationManager.error(message, title, timeOut, callback, priority);
  }
  
  // componentWillUnmount() {
  // }


	// directionsCallback = response => {
  directionsCallback(response){
		console.log("in direectionsCallBack");
		if (this.state.response === null) {
			if (response !== null) {
				if (response.status === 'OK') {

					this.setState(
						() => ({
							response
						})
					)
				} else {
					console.error('response === null');
				}
			}
		}
  }

  onLoadPosition(){
    // currentPosition & watchPoisition options
    var options = {
      enableHighAccuracy: true,
      timeout: 500,
			maximumAge: 0
		  };
    if (navigator.geolocation) {
      // Get Current Position
      navigator.geolocation.getCurrentPosition((pos) => {
        let lat = parseFloat(pos.coords.latitude);
        let lng = parseFloat(pos.coords.longitude);
        
        this.setState({ CurrentPosition: { lat: lat, lng: lng } });
        console.log(`Current Position: `);
        console.log(this.state.CurrentPosition);

        // Check Position Update 
				this.watchID = navigator.geolocation.watchPosition((pos) => {
          let lat = parseFloat(pos.coords.latitude);
          let lng = parseFloat(pos.coords.longitude);
					if (lat === this.state.UpdatedPosition.lat && lng === this.state.UpdatedPosition.lng) return;
          if (pos.timestamp === this.state.timestamp ) return;
          
					// if (pos.coords.accuracy < 100) navigator.geolocation.clearWatch(this.watchID);
					this.setState({ timestamp: pos.timestamp});
          this.setState({ UpdatedPosition: { lat: lat, lng: lng } });

          // Create new 'p' elemnt to print updated location
          this.newElement = document.createElement('p');
          this.newElement.innerHTML = `Location fetched <a href="https://maps.google.com/maps?&z=15&q=${pos.coords.latitude}+${pos.coords.longitude}&ll=${pos.coords.latitude}+${pos.coords.longitude}" target="_blank">${pos.coords.latitude},${pos.coords.longitude}</a>`;          
          this.newLocation.appendChild(this.newElement);
          console.log("watching");


          // indicate the route (for all steps)
          if (this.state.response !== null){
            this.state.response.routes[0].legs.forEach(leg => {
              // calculate the meters from current location to the next turn
              //while (this.state.UpdatedPosition.lat != leg.steps[leg.steps.length].end_location.lat() && this.state.UpdatedPosition.lng != leg.steps[leg.steps.length].end_location.lng()) { 
              if ((this.state.UpdatedPosition.lat !== leg.steps[leg.steps.length - 1].end_location.lat()) && (this.state.UpdatedPosition.lng !== leg.steps[leg.steps.length - 1].end_location.lng())) {
                var R = 6378.137; // Radius of earth in KM
                var dLat = leg.steps[this.state.currStep].end_location.lat() * Math.PI / 180 - this.state.UpdatedPosition.lat * Math.PI / 180;
                var dLon = leg.steps[this.state.currStep].end_location.lng() * Math.PI / 180 - this.state.UpdatedPosition.lng * Math.PI / 180;
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.state.UpdatedPosition.lat * Math.PI / 180) * Math.cos(leg.steps[this.state.currStep].end_location.lat() * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var distance = R * c * 1000;
                var directions = leg.steps[this.state.currStep].maneuver;

                console.log("start lat:" + leg.steps[this.state.currStep].start_location.lat());
                console.log("start lng:" + leg.steps[this.state.currStep].start_location.lng());
                console.log("end lat:" + leg.steps[this.state.currStep].end_location.lat());
                console.log("end lng:" + leg.steps[this.state.currStep].end_location.lng());
                console.log("distance: " + distance + ",direction: " + directions);

                if (!this.state.startedNavigation &&
                  (this.state.UpdatedPosition.lat === leg.steps[0].end_location.lat()) && (this.state.UpdatedPosition.lng === leg.steps[0].start_location.lng())) {
                  this.send('navigation-start,0');
                  this.setState({
                    startedNavigation: true
                  });
                }

                // handle the customization of google's direction to the component
                directions.includes('left') ? directions = 'turn-left' :
                  directions.includes('right') ? directions = 'turn-right' :
                    directions.includes('straight') ? directions = 'continue-straight' : directions = 'continue-straight';

                // handle only specific meters before the turn - in order to not overload the component
                if (distance >= 50.0 && distance <= 51.0) {       // if 50m from turn
                  console.log(directions + "," + distance);
                  this.send(directions + "," + distance);
                } else if (distance >= 20 && distance <= 21) {    // if 20m from turn
                  console.log(directions + "," + distance);
                  this.send(directions + "," + distance);
                } else if (distance >= 0 && distance <= 2) {      // if need to turn now
                  console.log(directions + "," + distance);
                  this.send(directions + "," + distance);
                  console.log(this.state.currStep);
                  if (!(leg.steps[this.state.currStep] == (leg.steps.length - 1))) {
                    this.state.currStep = this.state.currStep + 1
                  }
                }
              } else {
                console.log("You have reached your destination");
                this.send('destination-reached,0');
              }
            });
          }

        }, (err) => {
          console.error(`ERROR(${err.code}): ${err.message}`);
        }, options);
      }, (err) => {
        console.error(`ERROR(${err.code}): ${err.message}`);
      }, options);
    }
    else {
      alert("Geolocation API not supported.");
      console.warn("Geolocation API not supported.");
    }
  }

  // componentDidMount(){
  // }


//   {this.state.loading ? (this.state.edit ? this.renderFORM() : this.showDetails()) :
//     <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div> }

// {this.state.loading ? <h1> ({`Hello ${this.state.userDetails.name}, Login succeeded`})</h1> : <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div>}

getWayPoints(wayPoints){

  let html=[];
  console.log("wayPoints:");
  console.log(wayPoints);

  if(wayPoints.length != 0){
    for (let i = 0; i < wayPoints.length; i++) {
      let split = wayPoints[i].location.split(" ");
      console.log("G:");
      console.log({location: { lat: parseFloat(split[1],10), lng: parseFloat(split[3],10)}});
      html.push({location: { lat: parseFloat(split[1],10), lng: parseFloat(split[3],10)}});
    }
  }
  return html;
}

onPolylineComplete = (polyline) => {
  console.log(polyline.getPath().getArray());
}

render() {
  const {loading} = this.state;
  const trackId = this.props.track.id;
  // const {loading} = true;
    return (
     <div style={{   
          margin: "0 auto",  
          // border: '2px solid red',
          height: "400px",
          maxWidth: "90%"}}>
        {this.state.loading ? 
          (<div className="load-container">
          
          <LoadScript
            id="script-loader"
            googleMapsApiKey={getGoogleApiKey()}
            onError={this.onLoadScriptError}
            onLoad={this.onLoadScriptSuccess}
            language="en"
            version="3.36"
            region="en"
              libraries={this.mode}
          >
          <div className="map-container">
            <GoogleMap
            id='example-map'
            onLoad={this.onGoogleMapSuccess}
            center={this.state.CurrentPosition}
            // clickableIcons={true}
            mapContainerStyle={{
              margin: "0 auto",
              height: "400px",
              width: "100%"
            }}
            //   onBoundsChanged={}
            //   onCenterChanged={}
            // onClick={this.onGoogleMapClick}
            //   onDblClick={}
            //   options={}
						// Max Zoom: 0 to 18
            zoom={18}>
              <DrawingManager
                onLoad={drawingManager => {
                  console.log(drawingManager)
                }}
                onPolylineComplete={this.onPolylineComplete}
              />
           
                {console.log("MAPPPPP:")}
                {console.log(this.props.track)}
              <Marker
                  position={this.state.UpdatedPosition}
                  icon={`/images/map-marker-icon3.png`}
                  >
              </Marker>
              (
                this.state.response === null
              ) && (
                <DirectionsService
                options={{
                  // origin: LatLng | String | google.maps.Place,
                  // destination: LatLng | String | google.maps.Place,
                  // travelMode: TravelMode,
                  // transitOptions: TransitOptions,
                  // drivingOptions: DrivingOptions,
                  // unitSystem: UnitSystem,
                  // waypoints[]: DirectionsWaypoint,
                  // optimizeWaypoints: Boolean,
                  // provideRouteAlternatives: Boolean,
                  avoidFerries: true,
                  avoidHighways: true,
                  avoidTolls: true,
                  // region: String
                  // origin: { lat: this.props.track.startPoint.latitude, lng: this.props.track.startPoint.longitude },
                  // destination: { lat: this.props.track.endPoint.latitude, lng: this.props.track.endPoint.longitude },
                  // waypoints: this.props.track.wayPoints ? this.getWayPoints(this.props.track.wayPoints) : null,
                  waypoints: this.getWayPoints(this.props.track.wayPoints),
                  // waypoints: {location: "{lat: 32.06183822, lng: 34.87367123}"},
                  // travelMode: this.props.track.type.toUpperCase() }}
                  // origin: { lat: this.props.track.startPoint.latitude, lng: this.props.track.startPoint.longtitude },
                  // destination: { lat: this.props.track.endPoint.latitude, lng: this.props.track.endPoint.longtitude },
                  origin: this.props.track.startPoint,
                  destination: this.props.track.endPoint,
                  // waypoints: this.getMiddlePoints(this.props.track.middlePoints),
                  // travelMode: this.props.track.type.toUpperCase() }}
                  travelMode: this.props.track.travelMode.toUpperCase(),
                  drivingOptions: {
                    departureTime: new Date(Date.now()),
                    trafficModel: 'bestguess' 
                  },
                  optimizeWaypoints: true
                }}
                  callback={this.directionsCallback}
                />
              )
                
                {
                  this.state.response != null &&
                  (
                    <DirectionsRenderer
                      options={{ directions: this.state.response }}
                    />
                    
                  )
                }
              
            </GoogleMap>
          </div>
        </LoadScript>
            <div className="buttons">
              <button id="connect" onClick={this.connectButton} type="button" aria-label="Connect" ref="device-name">
                <i className="material-icons">bluetooth_connected</i>
              </button>
              <button id="disconnect" onClick={this.disconnectButton} type="button" aria-label="Disconnect">
                <i className="material-icons">bluetooth_disabled</i>
              </button>
              {
                !this.state.isLoadingIdOfTrack && (
                <button id="disconnect" onClick={this.postNavifation} type="button" aria-label="Disconnect">
                <NavLink to=
                //navigate to TrackDestails via TemplateComponent with the params
                {{pathname: `${process.env.PUBLIC_URL}/post`, 
                  idOfTrack: trackId,
                  actualTime:45}}
                  activeStyle={this.active} 
                  style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                  className="btn btn-primary" >Post Navigator</NavLink>
                </button>)
              }
            

            </div>
      </div>) : <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div>}
      </div>
    );
  }
}


export default Map;

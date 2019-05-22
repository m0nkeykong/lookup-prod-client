import React, { Component } from 'react';
import './style/CustomTrack.css';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { BeatLoader } from 'react-spinners';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer, DrawingManager } from '@react-google-maps/api';
import './css/Map.css';
import {getGoogleApiKey} from '../globalService';
import './style/normalize.css';
import BLE from './BLE';


/*
TDL:
אל תשכח להוסיף בקוד שכשמסלול מסתיים - צריך לעדכן את הדאטאבייס
אלו הנתונים שצריך לעדכן:
changesDuringTrack
difficultyLevel
actualDuration
rating
ובכללי להציג את הנתונים האלה:
actualDuration, difficultyLevel, changesDuringTrack, distance(meters), rating, difficultyLevel, comments, travelMode, startPoint-endPoint
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
        startedNavigation: false
    }

    // ****** bluetooth variables ******
    this.BLE = new BLE();
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
    let userid = JSON.parse(sessionStorage.getItem('userDetails'));
		console.log(`Entered <Map> componentDidMount(), fetching userid: ${userid}`);
		this.onLoadPosition();

    // Get the user details from database
    axios.get(`https://db.lookup.band/user/getAccountDetails/${userid}`)
      .then(response => {
				this.setState({userDetails: response.data});
        this.onLoadPosition();
        this.setState({ loading: true });

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

          // *** Bluetooth ***
          
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
                  (this.state.UpdatedPosition.lat === leg.steps[0].start_location.lat()) && (this.state.UpdatedPosition.lng === leg.steps[0].start_location.lng())) {
                  this.BLE.send('navigation-start,0');
                  console.log("User reached starting point - Starting navigation");
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
                  this.BLE.send(directions + "," + distance);
                } else if (distance >= 20 && distance <= 21) {    // if 20m from turn
                  console.log(directions + "," + distance);
                  this.BLE.send(directions + "," + distance);
                } else if (distance >= 0 && distance <= 2) {      // if need to turn now
                  console.log(directions + "," + distance);
                  this.BLE.send(directions + "," + distance);
                  console.log(this.state.currStep);
                  if (!(leg.steps[this.state.currStep] == (leg.steps.length - 1))) {
                    this.state.currStep = this.state.currStep + 1
                  }
                }
              } else {
                console.log("You have reached your destination");
                this.BLE.send('destination-reached,0');
              }
            });
          }

          // *** Bluetooth ***
          
        }, (err) => {
          console.error(`ERROR(${err.code}): ${err.message}`);
        }, options);
      }, (err) => {
        console.error(`ERROR(${err.code}): ${err.message}`);
      }, options);
    }
    else {
      console.warn("Geolocation API not supported.")
    }
  }

  // componentDidMount(){
  // }


//   {this.state.loading ? (this.state.edit ? this.renderFORM() : this.showDetails()) :
//     <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div> }

// {this.state.loading ? <h1> ({`Hello ${this.state.userDetails.name}, Login succeeded`})</h1> : <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div>}

getWayPoints(wayPoints){
  let html=[];
  console.log(`wayPoints: ${wayPoints}`);

  if(wayPoints.length != 0){
    for (let i = 0; i < wayPoints.length; i++) {
      html.push({location: { lat: wayPoints[i].latitude, lng: wayPoints[i].longitude }});
    }
  }
  return html;
}

onPolylineComplete = (polyline) => {
  console.log(polyline.getPath().getArray());
}

render() {
  const {loading} = this.state;

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
            language="English"
            version="3.36"
            region="US"
            libraries={this.mode}
          >
          <BLE>
          </BLE>
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
            zoom={10}
            >
              <DrawingManager
                onLoad={drawingManager => {
                  console.log(drawingManager)
                }}
                onPolylineComplete={this.onPolylineComplete}
              />
           

              <Marker
                  position={this.state.UpdatedPosition}
                  icon={'/images/map-marker-icon3.png'}
                  >
              </Marker>
              {/* CHECK WHAT IS IT >>>>>>>> MOVE IT FROM HERE >>>>>>>>>>>>>>>>>>>>*/}
              {typeof this.props.track.startPoint.city !== "undefined" ? 
                  (
                      (
                        this.state.response === null
                      ) && (
                        <DirectionsService
                        options={{
                          origin: this.props.track.startPoint.city,
                          destination: this.props.track.endPoint.city,
                          waypoints: this.getWayPoints(this.props.track.wayPoints),
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
                  )
                  :
                  (

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
                          waypoints: this.props.track.wayPoints ? this.props.track.wayPoints : null,
                          // travelMode: this.props.track.type.toUpperCase() }}
                          // origin: { lat: this.props.track.startPoint.latitude, lng: this.props.track.startPoint.longtitude },
                          // destination: { lat: this.props.track.endPoint.latitude, lng: this.props.track.endPoint.longtitude },
                          origin: this.props.track.startPoint,
                          destination: this.props.track.endPoint,
                          // waypoints: this.getMiddlePoints(this.props.track.middlePoints),
                          // travelMode: this.props.track.type.toUpperCase() }}
                          travelMode: this.props.track.travelMode,
                          drivingOptions: {
                            departureTime: new Date(Date.now()),
                            trafficModel: 'bestguess' 
                          },
                          optimizeWaypoints: true
                        }}
                          callback={this.directionsCallback}
                        />
                      )
                  )
                }
                
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
      </div>) : <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div>}
      </div>
    );
  }
}


export default Map;

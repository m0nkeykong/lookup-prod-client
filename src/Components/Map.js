import React, { Component } from 'react';
import './style/CustomTrack.css';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { BeatLoader } from 'react-spinners';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import './css/Map.css';
import {getGoogleApiKey} from '../globalService';


class Map extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        userDetails: null,
        loading: true,
        CurrentPosition: {lat: 0, lng: 0},
        UpdatedPosition: {lat: 0, lng: 0},
				response: null,
				timestamp: 0
    }
    this.onLoadPosition = this.onLoadPosition.bind(this);
    this.onLoadScriptError = this.onLoadScriptError.bind(this);
    this.onLoadScriptSuccess = this.onLoadScriptSuccess.bind(this); 

    this.onGoogleMapSuccess = this.onGoogleMapSuccess.bind(this);
    this.onGoogleMapClick = this.onGoogleMapClick.bind(this);

    this.directionsCallback = this.directionsCallback.bind(this);

    this.newLocation = document.getElementById('locationUpdate');
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
    console.log("LOCATIONNNNNNNNNNNNNNNNNNNNNNNN:");
    console.log(this.props.track.startPoint.city);

    let userid = JSON.parse(sessionStorage.getItem('userDetails'));
		console.log(`Entered <Map> componentDidMount(), fetching userid: ${userid}`);
		this.onLoadPosition();

    // Get the user details from database
    axios.get(`http://localhost:3000/user/getAccountDetails/${userid}`)
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
          this.newElement2 = document.createElement('p');
					console.log(response.routes[0]);
					response.routes[0].legs.forEach(leg => {
            this.newElement2.innerHTML = `<b>Route Segment: </b><br> 
                                            From: ${leg.start_address},<br>
                                            To: ${leg.end_address}.<br> 
                                            Total Distance: ${leg.distance.value}m,<br>
                                            Estimated Duration: ${leg.duration.text},<br>
                                            Travel Mode: ${this.props.track.travelMode}.`;
            this.newLocation.appendChild(this.newElement2);
            console.log(leg);
          })
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
          >
          <div className="map-container">
            <GoogleMap
            id='example-map'
            onLoad={this.onGoogleMapSuccess}
            center={this.state.CurrentPosition}
            clickableIcons={true}
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
						zoom={10}>
						
              <Marker
                  position={this.state.UpdatedPosition}
                  icon={'/images/map-marker-icon3.png'}
                  >
              </Marker>

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
                          // avoidFerries: Boolean,
                          // avoidHighways: Boolean,
                          // avoidTolls: Boolean,
                          // region: String
                          // origin: { lat: this.props.track.startPoint.latitude, lng: this.props.track.startPoint.longitude },
                          // destination: { lat: this.props.track.endPoint.latitude, lng: this.props.track.endPoint.longitude },
                          // waypoints: this.getWayPoints(this.props.track.wayPoints),
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

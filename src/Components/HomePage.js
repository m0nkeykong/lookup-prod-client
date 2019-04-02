import React, { Component } from 'react';
import './style/CustomTrack.css';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { BeatLoader } from 'react-spinners';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import '../Components/style/HomePage.css';

class HomePage extends Component {
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

    this.newLocation = document.getElementById('root');
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
  componentWillMount() {
    let userid = JSON.parse(sessionStorage.getItem('userDetails'));
		console.log(userid);
		this.onLoadPosition();

    // Get the user details from database
    axios.get(`http://localhost:3000/user/getAccountDetails/${userid}`)
      .then(response => {
        this.setState({ loading: true });
        this.setState({userDetails: response.data});
        this.onLoadPosition();

        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
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
					console.log(response.routes[0]);
					response.routes[0].legs.forEach(leg => {
            console.log(leg);
          })
					this.setState(
						() => ({
							response
						})
					)
				} else {
					console.log('response === null');
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
          let newElement = document.createElement('p');
					newElement.innerHTML = `Location fetched <a href="https://maps.google.com/maps?&z=15&q=${pos.coords.latitude}+${pos.coords.longitude}&ll=${pos.coords.latitude}+${ pos.coords.longitude}" target="_blank">${pos.coords.latitude},${pos.coords.longitude}</a>`;          this.newLocation.appendChild(newElement);
          console.log("watching");
        }, (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
        }, options);
      }, (err) => {
        console.log(this.state.CurrentPosition.lat);
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }, options);
    }
    else {
      console.log("Geolocation API not supported.")
    }
  }

  // componentDidMount(){
  // }


//   {this.state.loading ? (this.state.edit ? this.renderFORM() : this.showDetails()) :
//     <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div> }

// {this.state.loading ? <h1> ({`Hello ${this.state.userDetails.name}, Login succeeded`})</h1> : <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div>}



render() {
  const {loading} = this.state;

    return (
     <div style={{   
          margin: "0 auto",  
          // border: '2px solid red',
          height: "400px",
          maxWidth: "90%"}}>
        {loading ? 
          (<div className="load-container">
          <LoadScript
          id="script-loader"
          googleMapsApiKey="AIzaSyAHjuSuRkHIU84dbtT8c1iDRUCIxqRLhRc"
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
						zoom={18}>
						
              <Marker
                  position={this.state.UpdatedPosition}>
              </Marker>
                {
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
                      origin: { lat: 32.4411626, lng: 34.9153988 },
                      destination: { lat: 32.439980, lng: 34.912760 },
                      travelMode: 'WALKING' }}
                      callback={this.directionsCallback}
                    />
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
      </div>) : <div> Roni </div>}
      </div>
    );
  }
}


export default HomePage;
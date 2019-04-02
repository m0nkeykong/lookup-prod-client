import React, { Component } from 'react';
import './style/CustomTrack.css';
import axios from 'axios';
import 'react-notifications/lib/notifications.css';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import '../Components/style/HomePage.css';

class HomePage extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    
    this.state = {
        userDetails: null,
        loading: false,
        CurrentPosition: { lat: null, lng: null,
        UpdatedPosition: { lat: null, lng: null}},
        response: null
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
  componentDidMount() {
    
    // let userid = JSON.parse(sessionStorage.getItem('userDetails'));
    // console.log(userid);
    // // Get the user details from database
    // axios.get(`http://localhost:3000/user/getAccountDetails/${userid}`)
    //   .then(response => {
    //     if(this._isMounted){
    //       return;
    //     }
    //     this.setState({userDetails: response.data});
    //     console.log(response.data);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    this.onLoadPosition();
  }
  
  componentWillUnmount() {
    this._isMounted = true;
  }
  
  
  directionsCallback = response => {
    if (this.state.response === null) {
      if (response !== null) {
        if (response.status === 'OK') {
          response.routes[0].legs.forEach(leg => {
            console.log(leg);
          })
          this.setState({
            response
          });
        }
      } else {
        console.log('response === null');
      }
    }
    console.log("in directionscallback");
  }

  onLoadPosition(){
    // currentPosition & watchPoisition options
    var options = {
      enableHighAccuracy: false,
      //timeout: 5000,
      maximumAge: 0
    };
    if (navigator.geolocation) {
      // Get Current Position
      // var id;
      // navigator.geolocation.getCurrentPosition((pos) => {
      //   let lat = parseFloat(pos.coords.latitude);
      //   let lng = parseFloat(pos.coords.longitude);
        
      //   this.setState({ CurrentPosition: { lat: lat, lng: lng } });
      //   console.log(this.state.CurrentPosition);

      //   // Check Position Update 
      //     id = 
      // }, (err) => {
      //   console.log(this.state.CurrentPosition.lat);
      //   console.warn(`ERROR(${err.code}): ${err.message}`);
      // }, options);
      navigator.geolocation.watchPosition((pos) => {
        let lat = parseFloat(pos.coords.latitude);
        let lng = parseFloat(pos.coords.longitude);
        this.setState({ CurrentPosition: { lat: lat, lng: lng } });
        this.setState({ loading: true });


        // Create new 'p' elemnt to print updated location
        let newElement = document.createElement('p');
        newElement.innerHTML = 'Location ' + 'fetched' + ': <a href="https://maps.google.com/maps?&z=15&q=' + pos.coords.latitude + '+' + pos.coords.longitude + '&ll=' + pos.coords.latitude + '+' + pos.coords.longitude + '" target="_blank">' + pos.coords.latitude + ', ' + pos.coords.longitude + '</a>';
        this.newLocation.appendChild(newElement);
        console.log("watching");
      }, (err) => {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      }, options);
    }
    else {
      console.log("Geolocation API not supported.")
    }
  }

render() {
    return (
      <div style={{   
          margin: "0 auto",  
          // border: '2px solid red',
          height: "400px",
          maxWidth: "90%"}}>
        <div className="load-container">
          <LoadScript
          id="script-loader"
          googleMapsApiKey="AIzaSyAHjuSuRkHIU84dbtT8c1iDRUCIxqRLhRc"
          // onError={this.onLoadScriptError}
          // onLoad={this.onLoadScriptSuccess}
          language="English"
          region="US"
          >
          <div className="map-container">
            <GoogleMap
            id='example-map'
            // onLoad={this.onGoogleMapSuccess}
            // center={this.state.CurrentPosition}
            clickableIcons={true}
            mapContainerStyle={{
              margin: "0 auto",
              height: "400px",
              width: "100%"
            }}
            onClick={this.onGoogleMapClick}
            zoom={20}>   
              <Marker
                  position={this.state.UpdatedPosition}>
              </Marker>
                {
                  this.state.response === null &&
                  (
                    <DirectionsService
                    options={{
                      origin: this.state.CurrentPosition,
                      destination: { lat: 32.439980, lng: 34.912760 },
                      travelMode: 'WALKING'
                    }}
                      callback={this.directionsCallback}
                    >
                    </DirectionsService>
                  )
                }
                {
                  this.state.response !== null &&
                  (
                    <DirectionsRenderer
                      options={{
                        directions: this.state.response
                      }}
                    >
                    </DirectionsRenderer>
                  )
                }
              
            </GoogleMap>
          </div>
        </LoadScript>
      </div>
      </div>
    );
  }
}


export default HomePage;



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
        loading: false,
        CurrentPosition: { lat: null, lng: null},
        UpdatedPosition: { lat: null, lng: null}
    }
    this.onLoadPosition = this.onLoadPosition.bind(this);
    this.onLoadScriptError = this.onLoadScriptError.bind(this);
    this.onLoadScriptSuccess = this.onLoadScriptSuccess.bind(this); 

    this.onGoogleMapSuccess = this.onGoogleMapSuccess.bind(this);
    this.onGoogleMapClick = this.onGoogleMapClick.bind(this);
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
    // Get the user details from database
    axios.get(`http://localhost:3000/user/getAccountDetails/${userid}`)
      .then(response => {
        this.setState({
          userDetails: response.data,
          loading: true
        })
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });

        navigator.geolocation.getCurrentPosition((pos) => {
          this.setState({
            CurrentPosition: {
              lat: parseFloat(pos.coords.latitude),
              lng: parseFloat(pos.coords.longitude)
            }
          });
          console.log(this.state.CurrentPosition.lng);
          console.log(this.state.CurrentPosition.lat);
        });
      

    // NotificationManager.info(message, title, timeOut, callback, priority);
    // NotificationManager.success(message, title, timeOut, callback, priority);
    // NotificationManager.warning(message, title, timeOut, callback, priority);
    // NotificationManager.error(message, title, timeOut, callback, priority);
  }
  
  directionsCallback = response => {
    console.log(response)

    if (response !== null) {
      if (response.status === 'OK') {
        this.setState(
          () => ({
            response
          })
        )
      } else {
        console.log('response: ', response)
      }
    }
  }

  onLoadPosition(){
    // currentPosition & watchPoisition options
    var options = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0,
      distanceFilter: 1
    };
    if (navigator.geolocation) {
      // Get Current Position
      navigator.geolocation.getCurrentPosition((pos) => {
        this.setState({ CurrentPosition: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
        console.log("CurrentPosition");

        // Check Position Update
        var id = navigator.geolocation.watchPosition((pos) => {
          this.setState({ UpdatedPosition: { lat: pos.coords.latitude, lng: pos.coords.longitude } });
          let newElement = document.createElement('p');
          newElement.innerHTML = 'Location ' + 'fetched' + ': <a href="https://maps.google.com/maps?&z=15&q=' + pos.coords.latitude + '+' + pos.coords.longitude + '&ll=' + pos.coords.latitude + '+' + pos.coords.longitude + '" target="_blank">' + pos.coords.latitude + ', ' + pos.coords.longitude + '</a>';
          this.newLocation.appendChild(newElement);
          console.log("watching");
        }, (err) => {
          console.warn('ERROR(' + err.code + '): ' + err.message);
        });
      }, (err) => {
        console.log(this.state.CurrentPosition.lat);
        console.warn(`ERROR(${err.code}): ${err.message}`);
      });
    }
    else {
      console.log("Geolocation API not supported.")
    }
  }

  componentDidMount(){
    this.onLoadPosition();
  }

render() {
    return (
      <div style={{   
          margin: "0 auto",  
          // border: '2px solid red',
          height: "400px",
          maxWidth: "80%"}}>
        <div className="load-container">
          <LoadScript
          id="script-loader"
          googleMapsApiKey="AIzaSyAHjuSuRkHIU84dbtT8c1iDRUCIxqRLhRc"
          onError={this.onLoadScriptError}
          onLoad={this.onLoadScriptSuccess}
          language="English"
          region="IL"
          >
          <div className="map-container">
            <GoogleMap
            id='example-map'
            onLoad={this.onGoogleMapSuccess}
            center={{ lat: parseFloat(this.state.CurrentPosition.lat), lng: parseFloat(this.state.CurrentPosition.lng) }}
            clickableIcons={true}
            mapContainerStyle={{
              margin: "0 auto",
              height: "400px",
              width: "100%"
            }}
            //   onBoundsChanged={}
            //   onCenterChanged={}
            onClick={this.onGoogleMapClick()}
            //   onDblClick={}
            //   options={}
            zoom={20}>   
              <Marker
                  position={{ lat: parseFloat(this.state.UpdatedPosition.lat), lng: parseFloat(this.state.UpdatedPosition.lng) }}>
              </Marker>


              <DirectionsService
              options={{ 
                destination: {lat: 32.439980, lng: 34.912760},
                origin: {lat: 31.062490, lng: 35.024940},
                travelMode: "WALKING"
              }}
              callback={this.directionsCallback}
            />
          )
        }

        {
            <DirectionsRenderer
              options={{ 
                directions: this.state.response
              }}
            />
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



import React, { Component } from 'react';
import {geolocated} from 'react-geolocated';
import './style/SomePage.css';

class SomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetch: null,
      i: 1,
      CurrentPosition: {
        Latitude: null,
        Longitude: null
      },
      watchPosition: {
        Latitude: null,
        Longitude: null
      }
    }
    
    this.getCurrentPosition = this.getCurrentPosition.bind(this);
    this.watchPosition = this.watchPosition.bind(this);
  }

  watchPosition(){
    var id, options;
    var self = this;
    
    options = {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0,
      distanceFilter: 1
    };
    
    id = navigator.geolocation.watchPosition((pos) => {
      self.setState({i: this.state.i+1});
      self.setState({watchPosition: {Latitude: pos.coords.latitude, Longitude: pos.coords.longitude}});

      if (pos.coords.latitude === self.state.CurrentPosition.Latitude+"123" && pos.coords.longitude === self.state.CurrentPosition.Longitude) {
        console.log('Congratulations, you reached the target');
        navigator.geolocation.clearWatch(id);
      }
      console.log("In watchPosition")
    }, (err) => {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }, options);   
    
  }

  getCurrentPosition(){
    var self = this;

    var options = {
      enableHighAccuracy: true,
      timeout: 1000,
      maximumAge: 0,
      distanceFilter: 1
    };

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition( (pos) => {
        self.setState({CurrentPosition: {Latitude: pos.coords.latitude, Longitude: pos.coords.longitude}});

        console.log('Your CurrentPosition position is:');
        console.log(`Latitude : ${pos.coords.latitude}`);
        console.log(`Longitude: ${pos.coords.longitude}`);
  
        self.watchPosition();
        // console.log(`More or less ${this.state.accuracy} meters.`);
      }, (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }, options);
    }
    
    else{
      console.log("Geolocation API not supported.")
    }
  }

  // After render
  componentDidMount() {
    // Update user location on map (cursor)
    // this.setState({ fetch: true })
  }
  // Before render
  componentWillMount() {
    this.setState({ fetch: true })
  }

  // Last function Before component removed 
  componentWillUnmount(){

  }
  
  render() {
    // this.setState({ i: this.state.i+1 })
    return (
    this.state.fetch && <div className="container">
      <div className ="row">
      {this.getCurrentPosition()}
      </div>
    </div>
    )
  }
}

export default SomePage;

/*
  #Routes List:
  Login         (Google)
  HomePage      (Hamburger, User Highlights)
  UserSettings  (ConnectDevice?, accessibillity... )
  UserProfile   (User Details + Track Records (Total KM, Navigated tracks, Shared tracks, etc..))
  BuildTrack:
                AutoGenerate(StartPoint, EndPoint)
                CustomBuild(StartPoint, MiddlePoint[], EndPoint)
  BrowseTrack:
                FilterBy
                Favorites
  Navigate      (Google Directions, Google Map, BLE)
  Disconnect    (Clear Session, return to Login Page)
*/
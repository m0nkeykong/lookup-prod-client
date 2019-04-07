import React, { Component } from 'react';
import {geolocated} from 'react-geolocated';

class SomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetch: null,
      CurrentPosition: {
        Latitude: null,
        Longitude: null
      },
      watchPosition: {
        Latitude: null,
        Longitude: null
      }
    }
     
    this.i = 1;

    // this.getCurrentPosition = this.getCurrentPosition.bind(this);
    // this.watchPosition = this.watchPosition.bind(this);
  }

  // watchPosition(){
  //   var id, options;
  //   var self = this;
    
  //   options = {
  //     enableHighAccuracy: false,
  //     timeout: 10000,
  //     maximumAge: 0,
  //     distanceFilter: 1
  //   };
    
  //   id = navigator.geolocation.watchPosition((pos) => {
  //     self.setState({watchPosition: {Latitude: pos.coords.latitude, Longitude: pos.coords.longitude}});

  //     if (pos.coords.latitude === self.state.CurrentPosition.Latitude+"123" && pos.coords.longitude === self.state.CurrentPosition.Longitude) {
  //       console.log('Congratulations, you reached the target');
  //       navigator.geolocation.clearWatch(id);
  //     }

  //   }, (err) => {
  //     console.warn('ERROR(' + err.code + '): ' + err.message);
  //   }, options);   
    
  // }

  // getCurrentPosition(){
  //   var self = this;
  //   var options = {
  //     enableHighAccuracy: false,
  //     timeout: 10000,
  //     maximumAge: 0,
  //     distanceFilter: 1
  //   };
    
  //   if(navigator.geolocation){
  //     navigator.geolocation.getCurrentPosition( (pos) => {
  //       self.setState({CurrentPosition: {Latitude: pos.coords.latitude, Longitude: pos.coords.longitude}});

  //       console.log('Your current position is:');
  //       console.log(`Latitude : ${pos.coords.latitude}`);
  //       console.log(`Longitude: ${pos.coords.longitude}`);
  
  //       self.watchPosition();
  //       // console.log(`More or less ${this.state.accuracy} meters.`);
  //     }, (err) => {
  //       console.warn(`ERROR(${err.code}): ${err.message}`);
  //     }, options);
  //   }
    
  //   else{
  //     console.log("Geolocation API not supported.")
  //   }
  // }

  // After render
  componentDidMount() {
    // this.setState({ fetch: true })
  }
  // Before render
  componentWillMount() {
    // this.setState({ fetch: false })
  }

  // Last function Before component removed 
  componentWillUnmount(){

  }
    // const { region } = this.state;

    // navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       this.setState({position});
    //     },
    //     (error) => alert(JSON.stringify(error)),
    //     {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    // );

    // this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
    //     var { distanceTotal, record } = this.state;
    //     this.setState({lastPosition});
    //     if(record) {
    //         var newLatLng = {latitude:lastPosition.coords.latitude, longitude: lastPosition.coords.longitude};

    //         this.setState({ track: this.state.track.concat([newLatLng]) });
    //         this.setState({ distanceTotal: (distanceTotal + this.calcDistance(newLatLng)) });
    //         this.setState({ prevLatLng: newLatLng });
    //     }
    // },
    // (error) => alert(JSON.stringify(error)),
    // {enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1});

  
  render() {
    return !this.props.isGeolocationAvailable && !this.state.fetch
    ? <div>Your browser does not support Geolocation</div>
    : !this.props.isGeolocationEnabled && !this.i++
      ? <div>Geolocation is not enabled</div>
      : this.props.coords
        ? <table>
          <tbody>
            <tr><td>latitude</td><td>{this.props.coords.latitude}</td></tr>
            <tr><td>longitude</td><td>{this.props.coords.longitude}</td></tr>
            <tr><td>altitude</td><td>{this.i}</td></tr>
            <tr><td>heading</td><td>{this.props.coords.heading}</td></tr>
            <tr><td>speed</td><td>{this.props.coords.speed}</td></tr>
          </tbody>
        </table>
        : <div>Getting the location data&hellip; </div>;
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: Infinity
  },
  watchPosition: true,
  userDecisionTimeout: 100,
  suppressLocationOnMount: false,
  geolocationProvider: navigator.geolocation
})(SomePage);
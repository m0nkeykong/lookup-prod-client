// import React, { Component } from 'react';
// import '../css/Map.css';
// import * as consts  from '../../consts'
// import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

// class CustomTrack extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             latitude: 0,
//             longitude: 0
//         }
//     }

//     addLatLong(){
//         let lat = this.getLatitude();
//         let long = this.getLongitude();

//         this.setState(({
//             latitude: lat,
//             longitude: long
//         }))
//     }

//     componentDidMount(){
//         this.addLatLong();
//       }

//     currentLocation(){
//         if(navigator.geolocation){
//           navigator.geolocation.getCurrentPosition((position)=>{
//             console.log(position);
//             return position;
//           })
//         }
//       }

//     getLatitude(){
//         if(navigator.geolocation){
//             navigator.geolocation.getCurrentPosition((position)=>{
//               console.log(position.coords.latitude);
//               return position.coords.latitude;
//             })
//           }
//     }

//     getLongitude(){
//         if(navigator.geolocation){
//             navigator.geolocation.getCurrentPosition((position)=>{
//               console.log(position.coords.longitude);
//               return position.coords.longitude;
//             })
//           }
//     }

//     render() {

//         return (
//             <Map google={this.props.google} zoom={15}
//             initialCenter={{
//                 lat: 32.0604053,
//                 lng: 34.787241699999996
//             }}
            
//             onClick={this.onMapClicked}
//             >
       
//               <Marker onClick={this.onMarkerClick}
//                       name={'Current location'} />
       
//               <InfoWindow onClose={this.onInfoWindowClose}>
                 
//               </InfoWindow>
//             </Map>
//           );
//       }
// }

// export default GoogleApiWrapper({
//     apiKey: (consts.GOOGLE_API_KEY)
//   })(CustomTrack)
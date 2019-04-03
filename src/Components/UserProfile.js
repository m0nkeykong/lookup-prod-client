// import React, { Component } from 'react';
// import './style/CustomTrack.css';
// import axios from 'axios';
// import { NotificationContainer, NotificationManager } from 'react-notifications';
// import 'react-notifications/lib/notifications.css';
// import { BeatLoader } from 'react-spinners';
// import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
// import '../Components/style/HomePage.css';
// import {getGoogleApiKey} from '../globalVariables';


// class HomePage extends Component {
//   constructor(props) {
//     super(props);
    
//     this.state = {
//         userDetails: null,
//         loading: true,
//         CurrentPosition: {lat: 0, lng: 0},
//         UpdatedPosition: {lat: 0, lng: 0},
// 				response: null,
// 				timestamp: 0
//     }
//     this.onLoadPosition = this.onLoadPosition.bind(this);
//     this.onLoadScriptError = this.onLoadScriptError.bind(this);
//     this.onLoadScriptSuccess = this.onLoadScriptSuccess.bind(this); 

//     this.onGoogleMapSuccess = this.onGoogleMapSuccess.bind(this);
//     this.onGoogleMapClick = this.onGoogleMapClick.bind(this);

//     this.directionsCallback = this.directionsCallback.bind(this);
//     this.getMiddlePoints = this.getMiddlePoints.bind(this);

//     this.newLocation = document.getElementById('root');
//   }

//   onLoadScriptSuccess(){
//     console.log(" <LoadScript/> Success ");
//   }

//   onLoadScriptError(){
//     console.log(" <LoadScript/> Error ");
//   }

//   onGoogleMapSuccess(){
//     console.log(" <GoogleMap/> Success ");
//   }

//   onGoogleMapClick(...args){
//     console.log(" onGoogleMapClick Success args: ",  args);  
//   }

//   // Remember to replace this method because UNSAFE
//   componentWillMount() {
//     let userid = JSON.parse(sessionStorage.getItem('userDetails'));
// 		console.log(userid);
// 		this.onLoadPosition();

//     // Get the user details from database
//     axios.get(`http://localhost:3000/user/getAccountDetails/${userid}`)
//       .then(response => {
//         this.setState({ loading: true });
//         this.setState({userDetails: response.data});
//         this.onLoadPosition();

//         console.log(response.data);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//     // NotificationManager.info(message, title, timeOut, callback, priority);
//     // NotificationManager.success(message, title, timeOut, callback, priority);
//     // NotificationManager.warning(message, title, timeOut, callback, priority);
//     // NotificationManager.error(message, title, timeOut, callback, priority);
//   }
  
//   // componentWillUnmount() {
//   // }


// 	// directionsCallback = response => {
//   directionsCallback(response){
// 		console.log("in direectionsCallBack");
// 		if (this.state.response === null) {
// 			if (response !== null) {
// 				if (response.status === 'OK') {
// 					console.log(response.routes[0]);
// 					response.routes[0].legs.forEach(leg => {
//             console.log(leg);
//           })
// 					this.setState(
// 						() => ({
// 							response
// 						})
// 					)
// 				} else {
// 					console.log('response === null');
// 				}
// 			}
// 		}
//   }

//   onLoadPosition(){
//     // currentPosition & watchPoisition options
//     var options = {
//       enableHighAccuracy: true,
//       timeout: 500,
// 			maximumAge: 0
// 		  };
//     if (navigator.geolocation) {
//       // Get Current Position
//       navigator.geolocation.getCurrentPosition((pos) => {
//         let lat = parseFloat(pos.coords.latitude);
//         let lng = parseFloat(pos.coords.longitude);
        
//         this.setState({ CurrentPosition: { lat: lat, lng: lng } });
//         console.log(this.state.CurrentPosition);

//         // Check Position Update 
// 				this.watchID = navigator.geolocation.watchPosition((pos) => {
//           let lat = parseFloat(pos.coords.latitude);
//           let lng = parseFloat(pos.coords.longitude);
// 					if (lat === this.state.UpdatedPosition.lat && lng === this.state.UpdatedPosition.lng) return;
// 					if (pos.timestamp === this.state.timestamp ) return;
// 					// if (pos.coords.accuracy < 100) navigator.geolocation.clearWatch(this.watchID);
// 					this.setState({ timestamp: pos.timestamp});
//           this.setState({ UpdatedPosition: { lat: lat, lng: lng } });

//           // Create new 'p' elemnt to print updated location
//           let newElement = document.createElement('p');
// 					newElement.innerHTML = `Location fetched <a href="https://maps.google.com/maps?&z=15&q=${pos.coords.latitude}+${pos.coords.longitude}&ll=${pos.coords.latitude}+${ pos.coords.longitude}" target="_blank">${pos.coords.latitude},${pos.coords.longitude}</a>`;          this.newLocation.appendChild(newElement);
//           console.log("watching");
//         }, (err) => {
//           console.warn(`ERROR(${err.code}): ${err.message}`);
//         }, options);
//       }, (err) => {
//         console.log(this.state.CurrentPosition.lat);
//         console.warn(`ERROR(${err.code}): ${err.message}`);
//       }, options);
//     }
//     else {
//       console.log("Geolocation API not supported.")
//     }
//   }

//   // componentDidMount(){
//   // }


// //   {this.state.loading ? (this.state.edit ? this.renderFORM() : this.showDetails()) :
// //     <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div> }

// // {this.state.loading ? <h1> ({`Hello ${this.state.userDetails.name}, Login succeeded`})</h1> : <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div>}

// getMiddlePoints(middlePoints){
//   let html=[];
//   console.log(`middlePoints: ${middlePoints}`);

//   if(middlePoints.length != 0){
//     for (let i = 0; i < middlePoints.length; i++) {
//       html.push({location: { lat: middlePoints[i].latitude, lng: middlePoints[i].longtitude }});
//     }
//   }
//   return html;
// }

// getMiddle()
// {
//   let html = [];
//   html.push({location: { lat: 31.67864841, lng: 34.58581388 }});
//   html.push({location: { lat: 31.67870319, lng: 34.584741 }});

//   return html;
  
// }

// render() {
//   const {loading} = this.state;
//   // const {loading} = true;

//     return (
//      <div style={{   
//           margin: "0 auto",  
//           // border: '2px solid red',
//           height: "400px",
//           maxWidth: "90%"}}>
//         {loading ? 
//           (<div className="load-container">
//           <LoadScript
//           id="script-loader"
//           googleMapsApiKey={getGoogleApiKey()}
//           onError={this.onLoadScriptError}
//           onLoad={this.onLoadScriptSuccess}
//           language="English"
//           version="3.36"
//           region="US"
//           >
//           <div className="map-container">
//             <GoogleMap
//             id='example-map'
//             onLoad={this.onGoogleMapSuccess}
//             center={this.state.CurrentPosition}
//             clickableIcons={true}
//             mapContainerStyle={{
//               margin: "0 auto",
//               height: "400px",
//               width: "100%"
//             }}
//             //   onBoundsChanged={}
//             //   onCenterChanged={}
//             // onClick={this.onGoogleMapClick}
//             //   onDblClick={}
//             //   options={}
// 						// Max Zoom: 0 to 18
// 						zoom={18}>
						
//               <Marker
//                   position={this.state.UpdatedPosition}>
//               </Marker>
//                 {
// 									(
// 										this.state.response === null
// 									) && (
//                     <DirectionsService
//                     options={{
// 											// origin: LatLng | String | google.maps.Place,
// 											// destination: LatLng | String | google.maps.Place,
// 											// travelMode: TravelMode,
// 											// transitOptions: TransitOptions,
// 											// drivingOptions: DrivingOptions,
// 											// unitSystem: UnitSystem,
// 											// waypoints[]: DirectionsWaypoint,
// 											// optimizeWaypoints: Boolean,
// 											// provideRouteAlternatives: Boolean,
// 											// avoidFerries: Boolean,
// 											// avoidHighways: Boolean,
// 											// avoidTolls: Boolean,
// 											// region: String
//                       origin: { lat: this.props.track.startPoint.latitude, lng: this.props.track.startPoint.longtitude },
//                       destination: { lat: this.props.track.endPoint.latitude, lng: this.props.track.endPoint.longtitude },
//                       waypoints: this.getMiddlePoints(this.props.track.middlePoints),
//                       travelMode: this.props.track.type.toUpperCase() }}
//                       callback={this.directionsCallback}
//                     />
//                   )
//                 }
//                 {
//                   this.state.response != null &&
//                   (
//                     <DirectionsRenderer
//                       options={{ directions: this.state.response }}
//                     />
                    
//                   )
//                 }
              
//             </GoogleMap>
//           </div>
//           <div>
//           {console.log("PROPSSSSSSSSSSSSSSSS:")}
//           {console.log(this.props.track.type.toUpperCase())}
//           {console.log(this.props.track.endPoint.latitude)}
//           {console.log("PROPSSSSSSSSSSSSSSSS!")}
//           </div>
//         </LoadScript>
//       </div>) : <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div>}
//       </div>
//     );
//   }
// }


// export default HomePage;


///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


// import React, { Component } from 'react';
// import TamplateComponent from './TemplateComponent'
// import './style/AutoGenerateTrack.css';
// import IoAndroidBicycle from 'react-icons/lib/io/android-bicycle';
// import MdDirectionsWalk from 'react-icons/lib/md/directions-walk';
// import {getAllTracksURL, getTracksByCityURL} from '../globalVariables'
// import { NavLink , Link} from "react-router-dom";
// import ReactDOM from 'react-dom';



// class ChooseExistingTrack extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       tracks: []

      
//     }

//     this.addTracks = this.addTracks.bind(this)
//     this.viewTracks = this.viewTracks.bind(this)
//     this.updateTracks = this.updateTracks.bind(this)
//     this.getAllTracks = this.getAllTracks.bind(this)
//     this.getComments = this.getComments.bind(this)
//     this.onSubmit = this.onSubmit.bind(this)
//     this.clickOnTrackTitle = this.clickOnTrackTitle.bind(this)
//     this.onChange = this.onChange.bind(this)
//     this.handleChange  = this.handleChange.bind(this)

//   }
  
//   onSubmit(e){

//     // e.preventDefault();
//     // console.log("VALUES: " + this.state.from + ", " + this.state.to + ", " + this.state.travelers );

//     //   this.props.history.push({
//     // pathname: "/results",
//     // state: this.state
//     // });

//     e.preventDefault();
//     let city = this.state.city;
//     console.log("CITY:");
//     console.log(city);
//     // TODO: parse city to upper case and lower case:
//     fetch(getTracksByCityURL(city))
//     .then((res) => {        
//       return res.json();      
//     }).then((data) => {        
//       var self=this;        
//       data.map(element => {    
//         element.map(json=>{
//           console.log(JSON.stringify(json) ); 
//           self.addTracks(json._id,json.title, json.type, json.comment);        
//         })
//       })    // endOf data.map((data)
//       // TODO: how to render react?
//       // ReactDOM.render(this.viewTracks(), document.getElementById('root')); 
//       // document.getElementById("response").innerHTML = ""
 
//     })

//   }

//   clickOnTrackTitle(){


//   }

//   onChange(e){
//     console.log(this.props.width);
//   this.setState({[e.target.name]:e.target.value});
//   }

//   addTracks(_id,_title,_type, _comment) {
//     this.setState(prevState => ({
//       tracks: [
//       ...prevState.tracks,
//       {
//           id: this.state.tracks.length + 1,
//           idOfTrack: _id,
//           title: _title,
//           type: _type,
//           comment: _comment
//       }]
//     }))
//   }

//   updateTracks(newTrack, i) {
//     this.setState(() => ({
//       tracks: this.state.tracks.map(
//         (trck) => (trck.id !== i) ? trck : {...trck, name: newTrack}
//       )
//     }))
//   }
  
//   getComments(comments){
//     let html=[];
//     // Outer loop to create parent
//     for (let i = 0; i < comments.length; i++) {
//       html.push(<p>	&#8227; &#9;{comments[i]}</p>)
//     }
//     return html;
//   }

//   viewTracks(track,i) {
//     return (          
//       <div key={'container'+i} className="col-10 p-md-4 card" style={{ margin:`0 auto`,width: 18 + 'rem'}}>
//           <div className="">
//           <TamplateComponent key={'track'+i} index={i} onChange={this.updateTracks}>  

//           <NavLink to=
//           //navigate to TrackDetails via TemplateComponent with the params
//           {{pathname: `${process.env.PUBLIC_URL}/trackDetails`, 
//             idOfTrack: track.idOfTrack}}
//             activeStyle={this.active} 
//             className="" >
            
//             <h1 className="card-title" style={{ textAlign:`center`}}>{track.title} </h1>
//             <p style={{ textAlign:`center`}}>type: {track.type}</p>

//           </NavLink>

             
          
//           <div>
//             <p>comment: </p>
//             <p style={{ border:`groove`,fontSize:'10px'}}>{this.getComments(track.comment)}</p>
//           </div>
           
//           </TamplateComponent>
//         </div>
        
//       </div>
//     )
//   }

//   getAllTracks(){
//     fetch(getAllTracksURL())
//     .then((res) => {        
//       return res.json();      
//     }).then((data) => {        
//       var self=this;        
//       data.map((json) => {   
//         // console.log(JSON.stringify(json) );          
//         self.addTracks(json._id,json.title, json.type, json.comment);        
//           console.log(json);  
//       })    // endOf data.map((data)  
//     })
//   }

//   componentDidMount(){
//     this.getAllTracks();
//   }

//   handleChange(event){
//     this.setState({city: event.target.value})
//   }

//   render() {
//     return (
//       <div className="container">
//         <div className ="row">
//         <div className="col-12 p-md-4">
//           <form onSubmit={this.onSubmit}>
//             <div className="row">
              

//             <div className="col bg-white rounded">
//               <label>City:
//               <input className="mt-2 form-control float-left" type="text" name="from" onChange={this.handleChange} value={this.state.city}/>
//           </label>
//           </div>
//           <div className="col bg-white rounded">
//               <label>Type:</label>
//               <span className="d-block">
//                 <input className="float-left" type="radio" name="option" id="walking" autocomplete="off" checked /> 
//                 <MdDirectionsWalk /> 
//               </span>
//               <span className="d-block">
//                 <input className="float-left" type="radio" name="option" id="bicycling" autocomplete="off" /> 
//                 <IoAndroidBicycle /> 
//               </span>
//               </div> 
        
//           <div className="w-100 mb-md-4"></div>
//           <div className="col-12 mx-auto">
//             <button type="submit" className="mt-2 tn-block btnGreen rounded-0 w-100 btn border-0">חפש</button>
//           </div>

//             </div>
//           </form>
//         </div>
        
//         <div className="w-100 mb-md-4 pt-3"></div>
//           <div className="col-12 mx-auto">
//               {this.state.tracks.map(this.viewTracks)}
// 		      </div>
//         </div>
//       </div>
//     );
//   }
// }


// export default ChooseExistingTrack;

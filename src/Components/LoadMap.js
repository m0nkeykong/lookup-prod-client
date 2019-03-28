import React, { Component } from 'react';
import {load_google_maps, load_places} from './Util'
import './style/LoadMap.css'
class LoadMap extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//     }
//   }
  
  componentDidMount(){
    let googleMapsPromise = load_google_maps();
    let placesPromise = load_places();

    Promise.all([
        googleMapsPromise,
        placesPromise
    ]).then(values=>{
        console.log(values); 
        let google = values[0];
        let venues = values[1].response.venues;

        this.google = google;
        this.markers = [];
        this.map = new google.maps.Map(this.refs.map, {
            zoom: 9,
            scrollwheel: true,
            // center: { lat: venues[0].location.lat, lng:venues[0].location.lng}
            center: { lat: 32.0901274, lng: 34.8031728}
        });

        venues.forEach(venue => {
            let marker = new google.maps.Marker({
                // position: { lat: venue.location.lat, lng: venue.location.lng},
                position: { lat: 32.0901274, lng: 34.8031728},
                map: this.map,
                venue: venue,
                id: venue.id,
                name: venue.name,
                animation: google.maps.Animation.DROP
            });
        });
    })
  }

  render() {
    return (
        <div id="map" ref="map">
            <p>HELLO</p>
      </div>
    );
  }
}


export default LoadMap;
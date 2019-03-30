import React, { Component } from 'react';
import './style/CustomTrack.css';
import axios from 'axios';
import 'react-notifications/lib/notifications.css';
import { GoogleMap, LoadScript, Marker, DirectionsService } from '@react-google-maps/api'

class HaimPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDetails: null,
      loading: false,
      CurrentPosition: {
        lat: null,
        lng: null
      }
    }

  }

  // Remember to replace this method because UNSAFE
  componentWillMount() {
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

  }

  componentDidMount() {

  };

  render() {
    return (
      <div style={{
        height: "600px",
        width: "800px"
      }}>

      <LoadScript
        id="script-loader"
        googleMapsApiKey="AIzaSyAHjuSuRkHIU84dbtT8c1iDRUCIxqRLhRc"
        onError={() => { "Error" }}
        onLoad={() => { "Success" }}
        language="English"
        region="IL"
      >
        <GoogleMap
          id='example-map'
          //   onLoad={() =}
          center={{ lat: this.state.CurrentPosition.lat, lng: this.state.CurrentPosition.lng }}
          clickableIcons={true}
          mapContainerStyle={{
            height: "400px",
            width: "800px"
          }}
          zoom={14}>
          <Marker
            position={{ lat: this.state.CurrentPosition.lat, lng: this.state.CurrentPosition.lng }}
          >
          </Marker>

        </GoogleMap>

      </LoadScript>

      </div>
    );
  }
}


export default HaimPage;



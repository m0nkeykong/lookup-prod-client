import React, { Component } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api'


class HaimPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDetails: null,
      loading: false,
      CurrentPosition: {
        lat: null,
        lng: null
      },
      result: null
    }
    this.handleRequest = this.handleRequest.bind(this);

  }

  handleRequest = (result) => {
    if (this.state.result === null){
      if (result !== null) {
        if (result.status === 'OK') {
          result.routes[0].legs.forEach(leg => {
            console.log(leg);
          })
          this.setState({
            result
          });
        }
      } else {
        console.log('result === null');
      }
    }
    console.log("in handle requests");
  }

  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      this.setState({
        CurrentPosition: {
          lat: parseFloat(pos.coords.latitude),
          lng: parseFloat(pos.coords.longitude)
        }
      });
    });
  };

  render = () => {

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
          center={{ lat: this.state.CurrentPosition.lat, lng: this.state.CurrentPosition.lng }}
          clickableIcons={true}
          mapContainerStyle={{
            height: "400px",
            width: "800px"
          }}
          zoom={20}
        >

          <Marker
            position={{ lat: this.state.CurrentPosition.lat, lng: this.state.CurrentPosition.lng }}
          />
                
          {   
            this.state.result === null && 
            (
              <DirectionsService
                options={{
                  origin: { lat: this.state.CurrentPosition.lat, lng: this.state.CurrentPosition.lng },
                  destination: { lat: 31.67763494, lng: 34.58624303 },
                  waypoints: [
                    {
                      location: { lat: 31.67864841, lng: 34.58581388 } 
                    },
                    {
                      location: { lat: 31.67870319, lng: 34.584741 }
                    }
                  ],
                  travelMode: 'WALKING',
                }}
                callback={this.handleRequest}
              />
            )
          }
          { 
            this.state.result !== null &&
            (
              <DirectionsRenderer
                options={{
                  directions: this.state.result
                }}
              />
            )
          }
        </GoogleMap>

      </LoadScript>

      </div>
    );
  }
}


export default HaimPage;

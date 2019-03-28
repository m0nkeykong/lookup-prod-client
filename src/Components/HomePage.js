import React, { Component } from 'react';
import './style/CustomTrack.css';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { BeatLoader } from 'react-spinners';
import { GoogleMap, LoadScript } from '@react-google-maps/api'

class HomePage extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        userDetails: null,
        loading: false
    }

  }


    // Remember to replace this method because UNSAFE
    componentWillMount(){
        let userid = JSON.parse(sessionStorage.getItem('userDetails'));
        console.log(userid);
        axios.get(`http://localhost:3000/user/getAccountDetails/${userid}`)
        .then(response => {
            console.log(response.data);

            this.setState({
                userDetails: response.data,
                loading: true
            })
        })
        .catch(error => {
            console.log(error);
        });

    // NotificationManager.info(message, title, timeOut, callback, priority);
    // NotificationManager.success(message, title, timeOut, callback, priority);
    // NotificationManager.warning(message, title, timeOut, callback, priority);
    // NotificationManager.error(message, title, timeOut, callback, priority);
  }
  


//   {this.state.loading ? (this.state.edit ? this.renderFORM() : this.showDetails()) :
//     <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div> }

// {this.state.loading ? <h1> ({`Hello ${this.state.userDetails.name}, Login succeeded`})</h1> : <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div>}
render() {
    return (
      <div style={{            
          height: "400px",
          width: "800px"}}>

        <LoadScript
        id="script-loader"
        googleMapsApiKey="AIzaSyAHjuSuRkHIU84dbtT8c1iDRUCIxqRLhRc"
        onError={ () => {"Error"}}
        onLoad={ () => {"Success"}}
        language="English"
        region="IL"
      >
        <GoogleMap
          id='example-map'
        //   onLoad={() =}
          center={{ lat: 5.6219868, lng: -0.1733074 }}
          clickableIcons={true}
          mapContainerStyle={{
            height: "400px",
            width: "800px"
          }}
        //   onBoundsChanged={}
        //   onCenterChanged={}
        //   onClick={}
        //   onDblClick={}
        //   options={}
          zoom={14}
        >
          ...Your map components
        </GoogleMap>
      </LoadScript>
      </div>
    );
  }
}


export default HomePage;



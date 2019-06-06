import React, { Component } from 'react';
import axios from 'axios';
import { rank, accessibility } from '../MISC';
import { Breadcrumb, CardGroup, Card } from 'react-bootstrap';
import { originURL, getGoogleApiKey } from '../globalService';
import {
  StaticGoogleMap,
  Marker,
  Path
} from 'react-static-google-map';

import Menu from './Menu';

const _ = require('lodash');

class FavoriteTracks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      userDetails: [],
      show: false,
      isUpdated: false
    }
    this.trackRecord = this.trackRecord.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
  }

  // Fetch the updated user data from db
  getUserDetails(){
    var self = this;
    return new Promise(resolve => {
      self.userid = JSON.parse(sessionStorage.getItem('userDetails'));
      // Get the user details from database
      axios.get(`${originURL}user/getAccountDetails/${this.userid}`)
        .then(userResponse => {
          this.setState({ userDetails: userResponse.data, initalUserDetails: userResponse.data, loading: false });
          console.log(userResponse.data);
        })
        .catch(error => {
          console.error(error);
        });      
    });
  }

  async componentDidMount(){
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
    console.log(`Entered <AutoGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);
    await this.getUserDetails();
  }

  trackRecord(track){
    let location = [];
    location.push({lat: track.startPoint.lat.toString(), lng: track.startPoint.lng.toString()});
    if(track.wayPoints.length > 0){
      track.wayPoints.forEach( (obj, index) => {
        if(index === obj.length-1){
          location.push({lat: track.endPoint.lat.toString(), lng: track.endPoint.lng.toString()});
        }
        else{
          location.push({lat: obj.lat.toString(), lng: obj.lng.toString()});
        }
      })
      return location;
    }

    else{
      location.push({lat: track.endPoint.lat.toString(), lng: track.endPoint.lng.toString()});
      return location;
    }
  }

  render() {
    const userDetails = {...this.state.userDetails};
    return (
      <div>
        <Menu currentPage={"Favorite Tracks"}></Menu>
        
        <Breadcrumb>
          <Breadcrumb.Item href="../">Login</Breadcrumb.Item>
          <Breadcrumb.Item href="../home">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Favorite Tracks</Breadcrumb.Item>
        </Breadcrumb>
        <CardGroup>

        {/* @TODO: Change from trackRecords to favoriteTracks */}
        {!this.state.loading && userDetails.trackRecords.length > 0 && userDetails.trackRecords.map( (track, index) => 
          (
            <React.Fragment key={index.toString()}>

            <Card>
            <Card.Header>{track.title.toString()}</Card.Header>
            <Card.Body>
            <div style={{display: 'block', width: '340px', height: '240px', margin: '0 auto'}}>
            <StaticGoogleMap
                maptype='roadmap'
                apiKey={getGoogleApiKey()}
                size="340x240"
                language='en'
              >        
              <Marker
                size ='mid'
                location={{ lat: track.startPoint.lat.toString(), lng: track.startPoint.lng.toString() }}
                color="green"
                label="A"
              />

              <Marker
                size ='mid'
                location={{ lat: track.endPoint.lat.toString(), lng: track.endPoint.lng.toString() }}
                color="red"
                label="B"
              />
              <Path
                points={[
                  this.trackRecord(track)
                ]}
              />
              </StaticGoogleMap> 
              </div>         
              <blockquote className="blockquote mb-0">
                <p>
                  {' '}
                  {`From ${track.startPoint.street ? track.startPoint.street + ', ' : ''} ${track.startPoint.city ? track.startPoint.city + ', ' : ''} ${track.startPoint.country}`}.{' '} <br></br>
                  {`To ${track.endPoint.street ? track.endPoint.street + ', ' : ''} ${track.endPoint.city ? track.endPoint.city + ', ' : ''} ${track.endPoint.country}`}.{' '}
                </p>
                <p>
                Distance: <cite title="Source Title"> {track.distance.toString() + 'm'} </cite> 
                <br></br>Duration: <cite title="Source Title"> {userDetails.accessibility === 1 ? track.nonDisabledTime.actual.toString() + ' minutes' : track.disabledTime.actual.toString() + ' minutes'} </cite>
                <br></br>Travel Mode: <cite title="Source Title"> {track.travelMode.toString()} </cite> 
                <br></br>Difficuly Level: <cite title="Source Title"> {track.difficultyLevel.star ? track.difficultyLevel.star.toString() : '0'} </cite>
                <br></br>Reports: <cite title="Source Title"> {track.reports.map( (report) => {return <div> Report: {report.report} Reported by: {report.userid} </div>})} </cite> 
                </p>
                <footer className="blockquote-footer">
                  Description: <cite title="Source Title"> {track.description.toString()} </cite>

                </footer>
              </blockquote>
            </Card.Body>
          </Card>



            </React.Fragment>
          )
        )}

        {!this.state.loading && userDetails.trackRecords.length <= 0 && (<div> <p> Favorite tracks list is empty. </p> </div>)}
      </CardGroup>
        
      </div>
    );
  }
}


export default FavoriteTracks;
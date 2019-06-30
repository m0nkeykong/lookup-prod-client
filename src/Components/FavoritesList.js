import React, { Component } from 'react';
import axios from 'axios';
import { rank, accessibility } from '../MISC';
import { Card, Icon, Image, Label, Button } from 'semantic-ui-react'
import { originURL, getGoogleApiKey } from '../globalService';
import { Breadcrumb } from 'react-bootstrap';
import './style/FavoriteList.css';
import { NavLink } from "react-router-dom";

import {
  StaticGoogleMap,
  Marker,
  Path
} from 'react-static-google-map';
import Menu2 from './Menu';
import FavoriteButton from './FavoriteButton';

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
    this.getDifficulty = this.getDifficulty.bind(this);
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
    console.log(`Entered <FavoriteList> componentDidMount(), fetching userid: ${this.userid}`);
    await this.getUserDetails();
  }

  // @TODO: Implement wayPoints
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

  getDifficulty(difficulty){
    var i = 0;
    switch(difficulty){
      case 1:
        return( <div style={{ display: 'inline-block' }}> <Icon color='yellow' name='star'/><Icon name='star'/><Icon name='star'/><Icon name='star'/><Icon name='star'/> </div>)
        break;

      case 2:
        return( <div style={{ display: 'inline-block' }}> <Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon name='star'/><Icon name='star'/><Icon name='star'/></div>)
        break;

      case 3:
        return( <div style={{ display: 'inline-block' }}> <Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon name='star'/><Icon name='star'/></div>)
        break;

      case 4:
        return( <div style={{ display: 'inline-block' }}> <Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon name='star'/></div>)
        break;

      case 5:
        return( <div style={{ display: 'inline-block' }}> <Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon color='yellow' name='star'/> </div>)
        break;

      default:
        return( <div style={{ display: 'inline-block' }}> <Icon name='star'/><Icon name='star'/><Icon name='star'/><Icon name='star'/><Icon name='star'/> </div>)
        break;
    }
  }

  render() {
    const userDetails = {...this.state.userDetails};
    var trackObj = {};
    return (
      <div>
        <Menu2 currentPage={"Favorite Tracks"}></Menu2>
        
        <Breadcrumb>
          <Breadcrumb.Item href="../">Login</Breadcrumb.Item>
          <Breadcrumb.Item href="../home">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Favorite Tracks</Breadcrumb.Item>
        </Breadcrumb>

        <Card.Group style={{ marginTop: '15px'}}>
        {!this.state.loading && userDetails.favoriteTracks.length > 0 && userDetails.favoriteTracks.map( (track, index) => 
          (
            <React.Fragment key={index}>
            
            <Card style={{ margin: '0 auto', padding: '5px'}}>
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

              <Card.Content>
                <Card.Header> 
                  {track.title.toString()} 
                </Card.Header>
                <Card.Meta>
                <div>
                  { this.getDifficulty(parseInt(track.difficultyLevel.star)) }
                  <span className='date' style={{ float: 'right'}}>
                      {track.travelMode.toString() === 'WALKING' ? <Icon title='Walking' name='male' color='blue' size='large'/> : <Icon name='bicycle' color='blue' size='large'/>}
                  </span>
                </div>

                </Card.Meta>

                <Card.Description> 
                  <Label.Group>
                    <Label style={{ width: '55px'}} size='large' color='teal'>From</Label>
                    <Label size='large'> {` ${track.startPoint.street ? track.startPoint.street + ', ' : ''} ${track.startPoint.city ? track.startPoint.city + '' : ''}`} </Label>
                  </Label.Group>
                  <Label.Group>
                    <Label style={{ width: '55px'}} size='large' color='teal'>To</Label>
                    <Label size='large'> {` ${track.endPoint.street ? track.endPoint.street + ', ' : ''} ${track.endPoint.city ? track.endPoint.city + '' : ''}`} </Label>
                  </Label.Group>
                  <Label.Group>
                    <Label size='large' color='teal'>Duration</Label>
                    <Label size='large'> {userDetails.accessibility === 1 ? track.nonDisabledTime.actual.toString() + ' minutes' : track.disabledTime.actual.toString() + ' minutes'} </Label>
                  </Label.Group>                
                  <Label.Group>
                    <Label size='large' color='teal'>Distance</Label>
                    <Label size='large'> {track.distance.toString() + 'm'} </Label>
                  </Label.Group>                
                  <Label.Group>
                    <Label size='large' color='grey'>Description</Label>
                    <Label size='large'> {track.description.toString()}  </Label>
                  </Label.Group>                
                  <FavoriteButton
                  trackid={track._id}>
                  </FavoriteButton>
                </Card.Description>
                
              </Card.Content>
              <Card.Content extra>
              </Card.Content>

              <NavLink to=
              //navigate to TrackDetails via TemplateComponent with the params
              {{pathname: `${process.env.PUBLIC_URL}/trackDetails`, 
                idOfTrack: track._id}}>
                <Button primary style={{width: '100%'}}>
                Live Navigation
                </Button>
              </NavLink>

            </Card>
           
            </React.Fragment>
          ))
        }
        </Card.Group>
        {!this.state.loading && userDetails.favoriteTracks.length <= 0 && (<div> <p> Favorite tracks list is empty. </p> </div>)}
        {/* Reports:  {track.reports.map( (report) => return{<div> Report: {report.report} Reported by: {report.userid} </div>})} */}

      </div>
    )
  }
}
  export default FavoriteTracks;

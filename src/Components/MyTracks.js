import React, { Component } from 'react';
import axios from 'axios';
import { Card, Icon, Label, Button } from 'semantic-ui-react'
import { originURL, getGoogleApiKey } from '../globalService';
import { Breadcrumb } from 'react-bootstrap';
import './style/FavoriteList.css';
import { NavLink } from "react-router-dom";
import {
  StaticGoogleMap,
  Marker,
  Path
} from 'react-static-google-map';
import Menu from './Menu';
import FavoriteButton from './FavoriteButton';
import BLE from './BLE';

class MyTracks extends Component {
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
    switch(difficulty){
      case 1:
        return( <div className='caseClass'> <Icon color='yellow' name='star'/><Icon name='star'/><Icon name='star'/><Icon name='star'/><Icon name='star'/> </div>)
        break;

      case 2:
        return( <div className='caseClass'> <Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon name='star'/><Icon name='star'/><Icon name='star'/></div>)
        break;

      case 3:
        return( <div className='caseClass'> <Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon name='star'/><Icon name='star'/></div>)
        break;

      case 4:
        return( <div className='caseClass'> <Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon name='star'/></div>)
        break;

      case 5:
        return( <div className='caseClass'> <Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon color='yellow' name='star'/><Icon color='yellow' name='star'/> </div>)
        break;

      default:
        return( <div className='caseClass'> <Icon name='star'/><Icon name='star'/><Icon name='star'/><Icon name='star'/><Icon name='star'/> </div>)
        break;
    }
  }

  render() {
    const userDetails = {...this.state.userDetails};
    return (
      <div>
        <Menu currentPage={"My Tracks"}></Menu>
        
        <Breadcrumb>
          <Breadcrumb.Item href="../">Login</Breadcrumb.Item>
          <Breadcrumb.Item href="../home">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>My Tracks</Breadcrumb.Item>
          <BLE>
          </BLE>
        </Breadcrumb>

        <Card.Group className='cardGroup'>
        {!this.state.loading && userDetails.trackRecords.length > 0 && userDetails.trackRecords.map( (track, index) => 
          (
            <React.Fragment key={index}>
            
            <Card className='cardClass'>
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
                  <span className='date spanClass'>
                      {track.travelMode.toString() === 'WALKING' ? <Icon title='Walking' name='male' color='blue' size='large'/> : <Icon name='bicycle' color='blue' size='large'/>}
                  </span>
                </div>

                </Card.Meta>

                <Card.Description> 
                  <Label.Group>
                    <Label className='labelClass' size='large' color='teal'>From</Label>
                    <Label size='large'> {` ${track.startPoint.street ? track.startPoint.street + ', ' : ''} ${track.startPoint.city ? track.startPoint.city + '' : ''}`} </Label>
                  </Label.Group>
                  <Label.Group>
                    <Label className='labelClass' size='large' color='teal'>To</Label>
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
                  <Button primary className='buttonClass'>
                  Live Navigation
                  </Button>
                </NavLink>

            </Card>
           
            </React.Fragment>
          ))
        }
        </Card.Group>
        {!this.state.loading && userDetails.trackRecords.length <= 0 && (<div> <p> Favorite tracks list is empty. </p> </div>)}
        {/* Reports:  {track.reports.map( (report) => return{<div> Report: {report.report} Reported by: {report.userid} </div>})} */}

      </div>
    )
  }
}
  export default MyTracks;

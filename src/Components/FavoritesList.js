import React, { Component } from 'react';
import axios from 'axios';
import { rank, accessibility } from '../MISC';
import { Breadcrumb, CardGroup, Card } from 'react-bootstrap';
import { originURL } from '../globalService';

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

  trackRecord(track, trackid){
    return(
    <div style={{ width: '100px', height: '400px' }}>
      <p> {track} </p>
    </div>
    )

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

        {!this.state.loading && userDetails.trackRecords.map( (track, index) => {
          return(
            <Card key={track}>
              <Card.Img variant="top" src="holder.js/100px160" />
              <Card.Body>
                <Card.Title>{track.title}</Card.Title>
                <Card.Text>
                  {track.startPoint}
                  {track.endPoint}
                  {track.wayPoints}
                  {track.reports}
                  {track.travelMode}
                  {track.distance}
                  {track.description}
                  {track.difficultyLevel}
                  {userDetails.accessibility === 1 ? track.nonDisabledTime : track.disabledTime}
                  {track.description}
                  This is a wider card with supporting text below as a natural lead-in to
                  additional content. This card has even longer content than the first to
                  show that equal height action.
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Footer>
            </Card>
          );
        })}
      </CardGroup>
        
      </div>
    );
  }
}


export default FavoriteTracks;
import React, { Component } from 'react';
import axios from 'axios';
import { rank, accessibility } from '../MISC';
import { Button, Form, Alert, Breadcrumb} from 'react-bootstrap';
import { originURL } from '../globalService';

import Menu from './Menu';

const _ = require('lodash');

class FavoriteTracks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variant: 'success',
      loading: true,
      tracks: [],
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

        { !this.state.loading && userDetails.trackRecords.map(this.trackRecord)}
      </div>
    );
  }
}


export default FavoriteTracks;
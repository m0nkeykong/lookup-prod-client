import React, { Component } from 'react';
import axios from 'axios';
import { rank, accessibility } from '../MISC';
import { Breadcrumb, CardGroup, Card } from 'react-bootstrap';
import { originURL } from '../globalService';
import './style/FavoriteTracks.css';

import Menu from './Menu';

const _ = require('lodash');

class FavoriteTracks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tracks: [],
      userDetails: [],
      show: false,
    }

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

  render() {
    const userDetails = {...this.state.userDetails};
    return (
      <div className="panel-body">
          <button type="button" className="btn btn-danger btn-circle"> <i className="fa fa-heart"></i>
          </button>
      </div>
    );
  }
}


export default FavoriteTracks;
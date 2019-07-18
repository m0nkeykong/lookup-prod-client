import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import Menu from './Menu';
import { originURL } from '../globalService';
import { Breadcrumb } from 'react-bootstrap';
import { rank } from '../MISC';
import { Statistic, List, Icon, Image, Button } from 'semantic-ui-react'
import BLE from './BLE';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      userDetails: [],
      isLoading: true
    }

  }
  
  componentDidMount(){
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
    console.log(`Entered <HomePage> componentDidMount(), fetching userid: ${this.userid}`);

    // Get the user details from database
    axios.get(`${originURL}user/getAccountDetails/${this.userid}`)
      .then(userResponse => {
        userResponse.data.createdDate = userResponse.data.createdDate.split('T')[0];
        this.setState({ userDetails: userResponse.data, isLoading: false });
        console.log(userResponse.data);
      })
      .catch(error => {
        console.error(error);
      });
  }


  render() {
    const userDetails = { ...this.state.userDetails };
    return (
      <div style={{ margin: '0'}}>
        {/* Page Menu */}
        <Menu currentPage={"Home"}> </Menu>

        {/* Page BreadCrumbs */}
        <Breadcrumb>
          <Breadcrumb.Item href="../">Login</Breadcrumb.Item>
          <Breadcrumb.Item active>Home</Breadcrumb.Item>
          <BLE>
          </BLE>
        </Breadcrumb>

        {!this.state.isLoading &&
          (
            <div style={{ width: '350px',  position: 'relative', margin: '0 auto'}}>
              <h2 style={{ textAlign: 'center' }}>{userDetails.name}</h2>
              <NavLink
                to={{ pathname: `${process.env.PUBLIC_URL}/profile` }}
                style={{ position: 'absolute', right: '15px' }}>
                <Button circular icon='settings'></Button>
              </NavLink>
              <Image style={{ paddingBottom: '10px' }} src={this.state.userDetails.profilePicture} size='tiny' circular centered />
              <div style={{ paddingLeft: '20px' }}>
              <p><strong><List.Icon name='users' size='large' /> Acount Created Date: </strong> {userDetails.createdDate} </p>
              <p><strong><List.Icon name='mail' size='large'/> Email: </strong> {userDetails.email} </p>
              <p><strong><List.Icon name='universal access' size='large'/> Accessibility: </strong> {userDetails.accessibility === 1 ? 'Not Disabled' : 'Disabled'} </p>
              <p><strong><List.Icon name='smile' size='large'/> Rank: </strong> {' ' + rank[userDetails.rank]}</p>
              <p><strong><List.Icon name='birthday' size='large'/> Birth Day Date: </strong> {userDetails.birthDay}</p>
              </div>
              <div style={{ margin: '0 auto', textAlign: 'center', width: '350px', height: '175px' }}>
                <Statistic color={'green'} style={{ paddingTop: '25px' }}>
                  <Statistic.Value>{userDetails.trackRecords.length}<Icon name='check' /></Statistic.Value>
                  <Statistic.Label>Cretaed tracks</Statistic.Label>
                </Statistic>
                <Button.Group>
                  <Button color='teal'>
                    <NavLink
                      to={{ pathname: `${process.env.PUBLIC_URL}/auto` }}
                      style={{ color: 'white', textDecoration: 'none' }}>
                      Auto generate
                       </NavLink>
                  </Button>
                  <Button.Or />
                  <Button color='olive'>
                    <NavLink
                      to={{ pathname: `${process.env.PUBLIC_URL}/custom` }}
                      style={{ color: 'white', textDecoration: 'none' }}>
                      Custom generate
              </NavLink>
                  </Button>
                </Button.Group>
                <Statistic color={'red'} style={{ paddingTop: '25px', display: 'block' }}>
                  <Statistic.Value>{userDetails.favoriteTracks.length}<Icon name='like' /></Statistic.Value>
                  <Statistic.Label>Favorite tracks</Statistic.Label>
                </Statistic>
                <Button.Group>
                  <Button color='red'>
                    <NavLink
                      to={{ pathname: `${process.env.PUBLIC_URL}/favorites` }}
                      style={{ color: 'white', textDecoration: 'none' }}>
                      Favorite list
              </NavLink>
                  </Button>
                  <Button.Or />
                  <Button color='orange'>
                    <NavLink
                      to={{ pathname: `${process.env.PUBLIC_URL}/mytracks` }}
                      style={{ color: 'white', textDecoration: 'none' }}>
                      My tracks
              </NavLink>
                  </Button>
                </Button.Group>
                <Statistic color={'blue'} style={{ paddingTop: '25px', display: 'block' }}>
                  <Statistic.Value>{userDetails.totalDistance}m</Statistic.Value>
                  <Statistic.Label>Total navigated distance </Statistic.Label>
                </Statistic>
                <Button color='blue'>
                  <NavLink
                    to={{ pathname: `${process.env.PUBLIC_URL}/choose` }}
                    style={{ color: 'white', textDecoration: 'none', paddingBottom: '45px' }}>
                    Search tracks
              </NavLink>
                </Button>
              </div>
            </div>
          )

          // Progress Bar: Baby, Tyro, Warrior, Knight, Royalty
          // About Levels
        }

      </div>
    );
  }
}

export default HomePage;

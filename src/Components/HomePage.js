import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import Menu from './Menu';
import { originURL } from '../globalService';
import { Card, Navbar, NavDropdown, Nav, Breadcrumb, Container, Row, Col } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import './style/TrackDetails.css'
import './style/HomePage.css'
import { rank, accessibility } from '../MISC';

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
    console.log(`Entered <AutoGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);

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
      <div>
        {/* Page Menu */}
        <Menu currentPage={"Home"}> </Menu>

        {/* Page BreadCrumbs */}
        <Breadcrumb>
          <Breadcrumb.Item href="../">Login</Breadcrumb.Item>
          <Breadcrumb.Item active>Home</Breadcrumb.Item>
        </Breadcrumb>
        {!this.state.isLoading &&

          (
            <div class="container">
            <div class="row">
              <div class="col-md-offset-2 col-md-8 col-lg-offset-3 col-lg-6">
                 <div class="well profile">
                      <div class="col-sm-12">
                          <div class="col-xs-12 col-sm-8">
                          <img alt="Profile" src={this.state.userDetails.profilePicture} style={{ height: '52px', width: '52px', position: 'absolute', right: '0', borderRadius: '50%' }}></img>

                              <h2>{userDetails.name}</h2>

                              <p><strong>Acount Created Date: </strong> {userDetails.createdDate} </p>
                              <p><strong>Email: </strong> {userDetails.email} </p>
                              <p><strong>Accessibility: </strong> {userDetails.accessibility === 1 ? 'Not Disabled' : 'Disabled'} </p>
                              <p><strong>Rank: </strong> {' ' + rank[userDetails.rank]}</p>
                              <p><strong>Birth Day Date: </strong> {userDetails.birthDay}</p>
                          </div>             
                          <div class="col-xs-12 col-sm-4 text-center">
                              <figure>
                                  <figcaption class="ratings">


                                  </figcaption>
                              </figure>
                          </div>
                      </div>            
                      <div class="col-xs-12 divider text-center">
                          <div class="col-xs-12 col-sm-4 emphasis">
                              <h2><strong>{userDetails.totalDistance}m </strong></h2>                    
                              <p><small>Total Distance</small></p>
                              <button class="btn btn-success btn-block"><span class="fa fa-plus-circle"></span> Choose & Navigate Track </button>
                          </div>
                          <div class="col-xs-12 col-sm-4 emphasis">
                              <h2><strong>{userDetails.trackRecords.length === 0 ? 'Click here to build your first track.' : `${userDetails.trackRecords.length}`}</strong></h2>                    
                              <p><small>Created tracks</small></p>
                              <button class="btn btn-info btn-block"><span class="fa fa-user"></span> Generate New Track </button>
                          </div>
                          <div class="col-xs-12 col-sm-4 emphasis">
                              <h2><strong> {userDetails.favoriteTracks.length === 0 ? '0' : `${userDetails.favoriteTracks.length}`}</strong></h2>                    
                              <p><small>Favorite tracks</small></p>
                                <button class="btn btn-primary btn-block"><span class="fa fa-gear"></span> View Favorite List </button>
                          </div>
                      </div>
                 </div>                 
              </div>
            </div>
          </div>
          )

          // Progress Bar: Baby, Tyro, Warrior, Knight, Royalty
          // About Levels
      }
        <Container>
          <Row>
            <Col style={{ textAlign: 'center', marginTop: '15px' }}>
              <button type="button" className="btn btn-primary btn-circle btn-xl">
                <NavLink 
                  to={{ pathname: `${process.env.PUBLIC_URL}/profile` }}
                  style={{ color: 'white', textDecoration: 'none'}}>
                  Profile <br/> Settings
                </NavLink>
              </button>
            </Col>
            <Col style={{ textAlign: 'center', marginTop: '15px' }}>
            <button type="button" className="btn btn-primary btn-circle btn-xl">
            <NavLink 
              to={{ pathname: `${process.env.PUBLIC_URL}/auto` }}
              style={{ color: 'white', textDecoration: 'none'}}>
              Auto <br/> Generate
            </NavLink>
          </button>
            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: 'center', marginTop: '15px' }}>
            <button type="button" className="btn btn-primary btn-circle btn-xl">
            <NavLink 
              to={{ pathname: `${process.env.PUBLIC_URL}/custom` }}
              style={{ color: 'white', textDecoration: 'none'}}>
              Custom <br/> Generate
            </NavLink>
          </button>
            </Col>
            <Col style={{ textAlign: 'center', marginTop: '15px' }}>
            <button type="button" className="btn btn-primary btn-circle btn-xl">
            <NavLink 
              to={{ pathname: `${process.env.PUBLIC_URL}/choose` }}
              style={{ color: 'white', textDecoration: 'none'}}>
              Choose <br/> Existing
            </NavLink>
          </button>
            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: 'center', marginTop: '15px' }}>
            <button type="button" className="btn btn-primary btn-circle btn-xl">
            <NavLink 
              to={{ pathname: `${process.env.PUBLIC_URL}/myTracks` }}
              style={{ color: 'white', textDecoration: 'none'}}>
              My <br/> Tracks
            </NavLink>
          </button>
            </Col>
            <Col style={{ textAlign: 'center', marginTop: '15px' }}>
            <button type="button" className="btn btn-primary btn-circle btn-xl">
            <NavLink 
              to={{ pathname: `${process.env.PUBLIC_URL}/favorites` }}
              style={{ color: 'white', textDecoration: 'none'}}>
              Favorite <br/> Tracks
            </NavLink>
          </button>
            </Col>
          </Row>
        </Container>

      </div>
    );
  }
}


export default HomePage;
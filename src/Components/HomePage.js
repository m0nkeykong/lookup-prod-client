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
          <div>
          Hello {userDetails.name}
          Profile Picture {userDetails.profilePicture}
          Accessibility {userDetails.accessibility}

          Created tracks: {userDetails.trackRecords.length === 0 ? 'Click here to build your first track.' : `${userDetails.trackRecords.length}`}
          Favorite tracks: {userDetails.favoriteTracks.length === 0 ? '0' : `${userDetails.favoriteTracks.length}`}

          Your Rank: {rank[userDetails.rank]}
          Progress Bar: Baby, Tyro, Warrior, Knight, Royalty
          Total Distance: {userDetails.totalDistance}
  
          About Levels
          </div>
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
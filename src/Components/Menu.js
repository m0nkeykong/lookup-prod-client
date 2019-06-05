import React, { Component } from 'react';
import { Card, Navbar, Nav } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import { fetchDataHandleError, originURL } from '../globalService';
import './style//LiveNavigation.css';
import BLE from './BLE';

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDetails: [],
      loading: true
    }
    
    this.fetchData = this.fetchData.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);

  }
  
  async componentDidMount(){
    await this.setState({ isLoading: true });
    await this.fetchData();
  }
  
  fetchData = async () => {
    try{
      const userDetails = await this.getUserDetails();
      await this.setState({ isLoading: false });
    }
    catch(error){
      this.setState({ isLoading: true });
      console.error(error);
    }
  }

  getUserDetails(){
    var self = this;
    return new Promise(resolve => {
      self.userid = JSON.parse(sessionStorage.getItem('userDetails'));

      // Get the user details from database
      axios.get(`${originURL}user/getAccountDetails/${self.userid}`)
        .then(userResponse => {
          self.setState({ userDetails: userResponse.data, loading: false });
          console.log('Menu was loaded successfully');
          resolve(userResponse.data);
        })
        .catch(error => {
          fetchDataHandleError(error);
        });
    });
  }

  

  render() {
    return (
        <Card id="menu" className="text-center">

            <Card.Header>
            <Navbar collapseOnSelect expand="lg">

            <Navbar.Brand style={{ float: 'left' }}>
                {this.state.userDetails.profilePicture ?
                (
                    // @TODO: Make tooltip message when clicking on rank picture
                    <img alt="Profile" src={`/images/${this.state.userDetails.rank}.png`} style={{ height: '40px', width: '40px', float: 'left', borderRadius: '50%' }}></img>
                )
                :
                (
                    <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
                )
                }
            </Navbar.Brand>

            <Navbar.Brand style={{ float: 'center' }}>
                {!this.state.loading ?
                (
                    <div style={{ marginTop: '15px' }}>
                    <p>{this.props.currentPage}</p>
                    </div>
                )
                :
                (
                    <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
                )
                }
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                <div>
                <img alt="Profile" src={this.state.userDetails.profilePicture} style={{ height: '40px', width: '40px', position: 'absolute', right: '0', borderRadius: '50%' }}></img>
                    <p style={{ fontSize: '120%', textAlign: 'left', paddingTop: '8px' }}>Hello, {this.state.userDetails.name}</p>
                </div>
                <Nav className="mr-auto">
                    <Nav.Link href='home'>Home</Nav.Link>
                    <Nav.Link href='profile'>Profile Settings</Nav.Link>
                    <Nav.Link href="mytracks">My Tracks</Nav.Link>
                    <Nav.Link href="favoritetracks">Favorite Tracks</Nav.Link>
                    {/* <Nav.Link href="search">Serach Tracks</Nav.Link> */}
                    <Nav.Link href="auto">Generate Auto Track</Nav.Link>
                    <Nav.Link href="custom">Generate Custom Track</Nav.Link>
                    <Nav.Link href="choose">Choose Existing Track</Nav.Link>
                    <Nav.Link href="contact">Contact us</Nav.Link>
                </Nav>
                <BLE>
                </BLE>
                </Navbar.Collapse>
            </Navbar>

            </Card.Header>
        </Card>
    );
  }
}


export default Menu;
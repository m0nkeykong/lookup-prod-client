import React, { Component } from 'react';
import { Card, Navbar, Nav } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import axios from 'axios';
import { fetchDataHandleError, originURL } from '../globalService';
import './style//Menu.css';
import BLE from './BLE';
import { Icon, Button } from 'semantic-ui-react'
import { NavLink } from "react-router-dom";

class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDetails: [],
      loading: true,
      userClose: false
    }
    
    this.fetchData = this.fetchData.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
    this.userCloseToggle = this.userCloseToggle.bind(this);
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

  userCloseToggle(){
    this.setState(prevState => ({ userClose: !prevState.userClose}));
  }

  render() {
    return (
        <Card id="menu">

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
                    <div >
                    <p>{this.props.currentPage}</p>
                    </div>
                )
                :
                (
                    <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
                )
                }
            </Navbar.Brand>

            <Navbar.Toggle onClick={this.userCloseToggle} aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                { this.state.userClose && <div >
                    <p style={{ fontSize: '120%', textAlign: 'center', paddingTop: '8px', position: 'relative' }}>Hello, {this.state.userDetails.name}
                   <NavLink
                  to={{ pathname: `${process.env.PUBLIC_URL}/` }}
                  style={{ position: 'absolute', right: '0' }}>
                  <Button circular icon='user close'></Button>
                </NavLink>
                  </p>
                </div>}
                <Nav className="mr-auto" style={{ fontSize: '120%', lineHight: '160%' }}>
                    <Nav.Link href='home'><Icon color='teal' size='big' name='home' /> Home</Nav.Link>
                    <Nav.Link href='profile'><Icon color='teal' size='big' name='setting' /> Profile Settings</Nav.Link>
                    <Nav.Link href="mytracks"><Icon color='teal' size='big' name='hand point right' /> My Tracks</Nav.Link>
                    <Nav.Link href="favorites"><Icon color='teal' size='big' name='like' /> Favorite Tracks</Nav.Link>
                    <Nav.Link href="auto"><Icon color='teal' size='big' name='angle right' /> Generate Auto Track</Nav.Link>
                    <Nav.Link href="custom"><Icon color='teal' size='big' name='angle double right' /> Generate Custom Track</Nav.Link>
                    <Nav.Link href="choose"><Icon color='teal' size='big' name='search' /> Choose Existing Track</Nav.Link>
                </Nav>
                <BLE>
                </BLE>
                </Navbar.Collapse>
            </Navbar>

        </Card>
    );
  }
}


export default Menu;
import React, { Component } from 'react';
import axios from 'axios';
import { rank } from '../MISC';
import { Button, Form, Alert, Breadcrumb} from 'react-bootstrap';
import { originURL } from '../globalService';
import Menu from './Menu';
import BLE from './BLE';

const _ = require('lodash');

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variant: 'success',
      tracks: [],
      userDetails: [],
      show: false,
      isUpdated: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);   
    this.handleInputChange = this.handleInputChange.bind(this);
    this.updateUserDetails = this.updateUserDetails.bind(this);
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
          // Preparing the user object to be handled by form change
          delete userResponse.data.BLE;
          delete userResponse.data._id;
          delete userResponse.data.favoriteTracks;
          delete userResponse.data.trackRecords;
          userResponse.data.createdDate = userResponse.data.createdDate.split('T')[0];
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
    console.log(`Entered <Profile> componentDidMount(), fetching userid: ${this.userid}`);
    await this.getUserDetails();
  }

  // Hnadle form details submittion
  handleSubmit(e){
    e.persist();
    e.preventDefault();
    
    const userDetails = this.state.userDetails;
    this.updateUserDetails(userDetails);
  }

  // Update user data
  updateUserDetails(userDetails){
    axios.put(`${originURL}user/updateAccountDetails/${this.userid}`, {...userDetails})
    .then(userDetails => {
      console.log("userDetails fetched: " + userDetails.data);
      this.setState({ isUpdated: true, show: true, variant: 'success' });
      this.getUserDetails();
    })
    .catch(error => {
      this.setState({ isUpdated: false, show: true, variant: 'danger' });
      console.log(error);
    });
  }

  // Handle the input change
  handleInputChange(e){
    e.persist();
    console.log(e);
    if(e.target.value !== ''){
      this.setState(
        (prevState) => ({
          ...prevState,
          userDetails: {...prevState.userDetails, [e.target.name]: e.target.value},
        }), () => {
          console.log(this.state.userDetails);
        }
      )
    }
    else{
      this.setState(
        (prevState) => ({
          ...prevState,
          userDetails: {...prevState.userDetails, [e.target.name]: ''},
        }), () => {
          console.log(this.state.userDetails);
        }
      )
    }
  }

  render() {
    const userDetails = {...this.state.userDetails};
    const handleHide = () => this.setState({ show: false });
    return (
      <div>
        <Menu currentPage={"Profile Settings"}></Menu>
        <Breadcrumb>
          <Breadcrumb.Item href="../">Login</Breadcrumb.Item>
          <Breadcrumb.Item href="../home">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Profile Settings</Breadcrumb.Item>
          <BLE>
          </BLE>
        </Breadcrumb>

        <Form onSubmit={e => this.handleSubmit(e)} style={{ padding: '7px'}}>
          <Form.Group controlId="formUserID">
            <Form.Label> User ID </Form.Label>
            <Form.Control disabled type="text" placeholder={this.userid} value={this.userid} name="userId"/>
          </Form.Group>
          <Form.Group controlId="formUserProfilePicture">
            <Form.Label> Profile Picture </Form.Label>
            <img alt="Profile" src={userDetails.profilePicture} style={{ height: '52px', width: '52px', borderRadius: '50%', display: 'block', margin: '0 auto', marginBottom: '5px'}}></img>
            <Form.Control disabled type="text" placeholder={userDetails.profilePicture} value={userDetails.profilePicture} name="profilePicture"/>
          </Form.Group>
          <Form.Group controlId="formUserCreationDate">
            <Form.Label> Account Creation Date </Form.Label>
            <Form.Control disabled type="text" placeholder={userDetails.createdDate} value={userDetails.createdDate} name="createdDate"/>
          </Form.Group>
          <Form.Group controlId="formUserRank">
            <Form.Label> Rank </Form.Label>
            <Form.Control disabled type="text" placeholder={userDetails.rank} value={rank[userDetails.rank]} name="rank" onChange={this.handleInputChange}/>
          </Form.Group>
          <Form.Group controlId="formUserName">
            <Form.Label> Full Name </Form.Label>
            <Form.Control required type="text" placeholder={userDetails.name} value={userDetails.name} name="name" onChange={this.handleInputChange}/>
          </Form.Group>
          <Form.Group controlId="formBirthDay">
            <Form.Label> Birth Day </Form.Label>
            <Form.Control type="text" placeholder={userDetails.birthDay} value={userDetails.birthDay} name="birthDay" onChange={this.handleInputChange}/>
          </Form.Group>          
          <Form.Group controlId="formUserAccessibility">
            <Form.Label> Accessibility </Form.Label>
            <Form.Control as="select" name="accessibility" value={userDetails.accessibility} onChange={this.handleInputChange}>
              <option value={1}>Not-Disabled</option>
              <option value={2}>Disabled</option>
            </Form.Control>
          </Form.Group>          
          <Form.Group controlId="formUserEmail">
            <Form.Label> Email </Form.Label>
            <Form.Control disabled type="text" placeholder={userDetails.email} value={userDetails.email} name="email" onChange={this.handleInputChange}/>
          </Form.Group>
          <Form.Group controlId="formUserPassword">
            <Form.Label> Password </Form.Label>
            <Form.Control required type="password" placeholder={userDetails.password} value={userDetails.password} name="password" onChange={this.handleInputChange}/>
          </Form.Group>
          <Form.Group controlId="formUserPhoneNumber">
            <Form.Label> Phone Number </Form.Label>
            <Form.Control required type="number" placeholder={userDetails.phone} value={userDetails.phone} name="phone" onChange={this.handleInputChange}/>
          </Form.Group>
          <Alert show={this.state.show} variant={this.state.variant}>
            <Alert.Heading>Profile update message</Alert.Heading>
              <p>
                {this.state.variant === "success" ?  
                `Hello ${userDetails.name}, Your profile details updated successfully.`:
                `Hello ${userDetails.name}, There was a problem while updating your profile details.`
                }
              </p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button onClick={handleHide} variant={`outline-${this.state.variant}`}>
                OK, Close!
              </Button>
            </div>
         </Alert>
          { !this.state.show && <Button disabled={_.isEqual(this.state.initalUserDetails, this.state.userDetails)} style={{ display: "block", margin: "0 auto" }} variant="primary" type="submit">
              Update Details
          </Button>}
        </Form>
      </div>
    );
  }
}


export default Profile;
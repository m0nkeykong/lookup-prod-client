import React, { Component } from 'react';
import { Card, Breadcrumb } from 'react-bootstrap';
import axios from 'axios';
import { fetchDataHandleError, originURL } from '../globalService';
import './style/LiveNavigation.css';
import Map from './Map';
import { rank, accessibility, disabledFactor } from '../MISC';
import Menu from './Menu';
import { Header, Segment, Statistic, List, Icon, Image, Button } from 'semantic-ui-react'

class LiveNavigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userDetails: [],
      isLoading: true,
      isLocation: false,
      generatedTrack: this.props.location.generatedTrack ? this.props.location.generatedTrack: '' 
    }
    
    this.fetchData = this.fetchData.bind(this);

    this.getUserDetails = this.getUserDetails.bind(this);
    this.createStartPoint = this.createStartPoint.bind(this);
    this.createEndPoint = this.createEndPoint.bind(this);
    this.createTrack = this.createTrack.bind(this);
    this.addTrackRecord = this.addTrackRecord.bind(this);

  }
  
  async componentDidMount(){
    console.log(this.props);
    // If is it new route - redirected from auto\custom generate so save data in db, just navigate
    if(this.props.location.generatedTrack != null){
      this.setState({ isLocation: true });
      if(this.state.generatedTrack.isGenerated === true || this.state.generatedTrack.isCustomGenerated === true){
        await this.setState({ isLoading: true });
        await this.fetchData();
      }
      // Existing track - do not save data in db, just navigate
      else{
        await this.getUserDetails();
        await this.setState({ isLoading: false });
      }

    }}

  
  // Fetching all the needed data 
  fetchData = async () => {
    try{
      const userId = await this.getUserDetails();
      const startPoint = await this.createStartPoint();
      const endPoint = await this.createEndPoint();
      const createdTrack = await this.createTrack(startPoint, endPoint);
      const updatedUser = await this.addTrackRecord(userId, createdTrack);  
      console.log(`User ${updatedUser._id} added Track ${createdTrack._id} to his tracks record list`);
      await this.setState({ isLoading: false });
    }
    catch(error){
      this.setState({ isLoading: true });
      console.error(error);
    }
  }

  // Fetching the user data 
  getUserDetails(){
    var self = this;
    return new Promise(resolve => {
      self.userid = JSON.parse(sessionStorage.getItem('userDetails'));
      console.log(`Entered <LiveNavigation> getUserDetails(), fetching userid: ${self.userid}`);
      // Get the user details from database
      axios.get(`${originURL}user/getAccountDetails/${self.userid}`)
        .then(userResponse => {
          self.setState({ userDetails: userResponse.data, isLoading: false });
          console.log(userResponse.data);
          resolve(self.userid);
        })
        .catch(error => {
          fetchDataHandleError(error);
        });
    });
  }

  // Creating start point object
  createStartPoint(){
    return new Promise(resolve => {
      const { startPointObj } = this.props.location.generatedTrack.track;
      axios.post(`${originURL}point/insertPoint`, {...startPointObj})
      .then(startPointObj => {
        console.log(`startPoint ${startPointObj.data} created successfully`)
        resolve(startPointObj.data);
      })
      .catch(error => {
        fetchDataHandleError(error);
      });
    });
  }

  // Creating end point object
  createEndPoint(){
    return new Promise(resolve => {
      const { endPointObj } = this.props.location.generatedTrack.track;
      axios.post(`${originURL}point/insertPoint`, {...endPointObj})
      .then(endPointObj => {
        console.log(`endPoint ${endPointObj.data} created successfully`)
        resolve(endPointObj.data);
      })
      .catch(error => {
        fetchDataHandleError(error);
      });
    });
  }

  // Creating track Object with points id's
  createTrack(startPointId, endPointId) {
    const { track } = this.props.location.generatedTrack;
    const estimatedDuration = this.state.userDetails.accessibility === 1 ? {nonDisabledTime: {actual: track.estimatedDuration, count: 1}} : {disabledTime: {actual: parseFloat(track.estimatedDuration) * disabledFactor, count: 1}}
    return new Promise(resolve => {
      const trackObj = {
        startPoint: startPointId,
        endPoint: endPointId,
        wayPoints: track.wayPoints !== '' ? [...track.wayPoints] : [],
        travelMode: track.travelMode,
        description: track.description,
        title: track.title,
        distance: track.distance,
        rating: track.rating,
        ...estimatedDuration,
        difficultyLevel: track.difficultyLevel == '' ? {star: 1, countVotes: 1} : {star: track.difficultyLevel},
        changesDuringTrack: false,
      };
      axios.post(`${originURL}track/insertTrack`, { ...trackObj, })
        .then(createdTrackResponse => {
          console.log(`Track ${createdTrackResponse.data._id} created successfully`)
          resolve(createdTrackResponse.data);
        })
        .catch(error => {
          fetchDataHandleError(error);
        });
    })
  }

  // Adding the created track to user track records
  addTrackRecord(userId, createdTrack) {
    return new Promise( resolve => {
      axios.put(`${originURL}user/addTrackRecord/${userId}`, { trackid: createdTrack._id })
      .then(addedTrackRecord => {
        resolve(addedTrackRecord.data);
      })
      .catch(error => {
        fetchDataHandleError(error);
      })
    });
  }


  render() {

    return (
      <div>
        <Card>

          <Menu currentPage={"Live Navigation"}> </Menu>
          {this.state.isLocation === true ? 
            <div className="text-center">
              <Breadcrumb>
                <Breadcrumb.Item href="/">Login</Breadcrumb.Item>
                <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
                {/* Check if come from auto generated page*/}
                {this.state.generatedTrack.isGenerated === true && <Breadcrumb.Item href="/auto">Auto</Breadcrumb.Item>}
                {/* Check if come from custom generated page */}
                {this.state.generatedTrack.isCustomGenerated === true && <Breadcrumb.Item href="/custom">Custom</Breadcrumb.Item>} 
                {/* Check if come from choose existing page */}
                <Breadcrumb.Item active>Live Navigation</Breadcrumb.Item>
              </Breadcrumb>

              <Card.Header> 
                <h6> Live Navigation Map </h6> 
                  {console.log(this.state.generatedTrack.track)}
                  {!this.state.isLoading && 
                    <Map
                    track={this.state.generatedTrack.track}>
                    </Map>
                  }
              </Card.Header>
            </div> : 
            // @TODO: Implement a photo handling error message
                <div className="text-center">
                <Segment placeholder>
                <Header icon>
                  <Icon name='pdf file outline' />
                  No documents are listed for this customer.
                </Header>
              </Segment>
                </div>
              }
          <Card.Footer id="locationUpdate" className="text-muted"></Card.Footer>
        </Card>
      </div>
    );
  }
}


export default LiveNavigation;
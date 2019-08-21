import React, { Component } from 'react';
import {getTrackByIdURL} from '../globalService';
import TamplateComponent from './TemplateComponent';
import { NavLink} from "react-router-dom";
import TiArrowBackOutline from 'react-icons/lib/ti/arrow-back-outline';
import IoAndroidBicycle from 'react-icons/lib/io/android-bicycle';
import MdDirectionsWalk from 'react-icons/lib/md/directions-walk';
import Map from './TrackNavigator';
import Menu from './Menu';
import axios from 'axios';
import { Card, Breadcrumb } from 'react-bootstrap';
import './style/TrackDetails.css'
import BLE from './BLE';
class TrackDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      startPoint: [],
      userDetails: [],
      endPoint: [],
      wayPoints: [],
      travelMode: [],
      reports: [],
      updated: false
    }

    this.getTrackById = this.getTrackById.bind(this)
    this.addTrack = this.addTrack.bind(this)
    this.viewTrack = this.viewTrack.bind(this)
    this.updateTrack = this.updateTrack.bind(this)
    this.getReports = this.getReports.bind(this)
    // this.onSubmitAddReport = this.onSubmitAddReport.bind(this)
    this.handleChange  = this.handleChange.bind(this)
    this.initialState = this.initialState.bind(this)
    this.buildTrack = this.buildTrack.bind(this)
    this.getTimeOfTrack = this.getTimeOfTrack.bind(this)
  }
  
  componentDidMount() {
    let idOfTrack=this.props.location.idOfTrack;
    // console.log(idOfTrack);

    this.getTrackById(idOfTrack);
  // user session
  this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
  console.log(`Entered <TrackDetails> componentDidMount(), fetching userid: ${this.userid}`);

  // Get the user details from database
  axios.get(`http://localhost:3000/user/getAccountDetails/${this.userid}`)
    .then(userResponse => {
      this.setState({ userDetails: userResponse.data, loading: false });
      console.log(userResponse.data);
    })
    .catch(error => {
      console.error(error);
    });
  }

  getTrackById(trackId){
    fetch(getTrackByIdURL(trackId))
    .then((res) => {   
      console.log(res);     
      return res.json();      
    }).then((data) => { 
      console.log(data);       
      var self=this;      
      self.addTrack(data.track._id,data.track.title, data.track.travelMode, data.track.difficultyLevel.star, data.reports, data.userDetails,
        data.startPoint, data.endPoint, data.track.wayPoints, data.track.description,data.track.disabledTime,data.track.nonDisabledTime );        
    })

  }

  addTrack(_id,_title,_type, _difficultyLevel, _reports,_userDetails,_startPoint, _endPoint, _wayPoints, _description,_disabledTime,_nonDisabledTime) {
    this.setState(prevState => ({
      tracks: [
      ...prevState.tracks,
      {
          id: this.state.tracks.length + 1,
          idOfTrack: _id,
          title: _title,
          travelMode: _type,
          reports: _reports,
          userDetails: _userDetails,
          startPoint:_startPoint,
          endPoint:_endPoint,
          wayPoints:_wayPoints,
          description: _description,
          difficultyLevel: _difficultyLevel,
          disabledTime:_disabledTime,
          nonDisabledTime:_nonDisabledTime
      }]
    }))
  }

  updateTrack(newTrack, i) {
    this.setState(() => ({
      tracks: this.state.tracks.map(
        (trck) => (trck.id !== i) ? trck : {...trck, name: newTrack}
      )
    }))
  }

  getReports(reports, userDetails){
    let html=[];
    console.log(reports);
    // Outer loop to create parent
   if(reports.length !== 0){
    for (let i = 0; i < reports.length; i++) {
      html.push(
        <ul className="media-list">
          <li className="media">
              <img className="media-object img-circle" src={userDetails[i].profilePicture} alt="profile"></img>
            <div className="media-body">
              <div className="well well-lg">
                  <h5 className="media-heading text-uppercase nameTitle">{userDetails[i].name}</h5>
                  <p className="media-report">
                    {reports[i].report}
                  </p>
              </div>              
            </div>
          </li> 
        </ul> 
      );
    }
   }
   else{
    html.push(
      <p className="media-report"></p>
    );
   }
    return html;
  }

  getStartPoint(startPoint){
    let html=[];
      html.push(<p>	&#8227; &#9; latitude: {startPoint.latitude}</p>)
      html.push(<p>	&#8227; &#9; longitude: {startPoint.longitude}</p>)
    return html;
  }

  getEndPoint(endPoint){
    let html=[];
    html.push(<p>	&#8227; &#9; latitude: {endPoint.latitude}</p>)
    html.push(<p>	&#8227; &#9; longitude: {endPoint.longitude}</p>)
    return html;
  }

  getWayPoints(wayPoints){
    let html=[];
    if(wayPoints.length !== 0){
      for (let i = 0; i < wayPoints.length; i++) {
        html.push(<p style={{fontSize: '15px'}}> &#9; point number: {i}</p>)
        html.push(<p>	&#8227; &#9;latitude: {wayPoints[i].latitude}</p>)
        html.push(<p>	&#8227; &#9;longitude: {wayPoints[i].longitude}</p>)
      }
    }
    return html;
  }

  getIconType(type){
    if(type === 'Walking')
      return <MdDirectionsWalk size={20} color="black" />;
    else
      return <IoAndroidBicycle size={20} color="black" />;
     
  }

  initialState(){
    this.setState(prevState => ({tracks: []}))
  }

  handleChange(event){
    this.setState({ [event.target.name]: event.target.value})
  }

  getStarsForDifficultyLevel(diffLever){
    let html=[];
    let limitOfStars = 5;
    let diffNumber = Math.round(diffLever);

    for (let i = 0; i < limitOfStars; i++) {
      if(i < diffNumber)
        html.push(<span key={'starKey1'} className="fa fa-star colorStarOrange"></span>)
      else
        html.push(<span key={'starKey2'} className="fa fa-star"></span>)

    }
    return html;
  } 

  
  buildTrack(track){
    const trackObj = {
      id: track.idOfTrack,
      description: track.description,
      difficultyLevel: track.difficultyLevel !== '' ? track.difficultyLevel : {},
      disabledTime: track.disabledTime !== '' ? track.disabledTime : {},
      endPoint: track.endPoint.city,
      endPointObj: track.endPoint,
      // estimatedDuration: track.estimatedDuration,
      nonDisabledTime: track.nonDisabledTime !== '' ? track.nonDisabledTime : {},
      startPoint: track.startPoint.city,
      startPointObj: track.startPoint,
      title: track.title,
      travelMode: track.travelMode,
      wayPoints: track.wayPoints !== '' ? track.wayPoints : [],
      changesDuringTrack: false
    };

    return trackObj;
  }

  getTimeOfTrack(disabledTime,nonDisabledTime){
    let html=[];

    let num;
    if(this.state.userDetails.accessibility === 0)
      num = nonDisabledTime.actual;
    else
      num = disabledTime.actual;

    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);

    html.push(<span key={'conKey'} className="">{rhours}:{rminutes}</span>)
    return html;
  }

  viewTrack(track,i) {
    console.log(track);
    return (          
      <div key={'container'+i}>
          <div className="col-12 px-4">

          <TamplateComponent key={'track'+i} index={i} onChange={this.updateTrack}>  
            <h1 className="card-title title" style={{ textAlign:`center`, marginTop: '20px'}}>{track.title}</h1>
            <p className="typeTrack">{this.getIconType(track.travelMode)}</p>
            <p className="typeTrack">{this.getTimeOfTrack(track.disabledTime,track.nonDisabledTime)}</p>
            <p className="descriptionTrack"><br></br>{track.description}</p>
            <p className="starCenter">{this.getStarsForDifficultyLevel(track.difficultyLevel)}</p>


              <div className="row">
                <div className="col-sm-12 col-md-5" id="logout" style={{ margin:`20px auto`}}>
                    
                    <div className="report-tabs">
                        <ul className="nav nav-tabs" role="tablist">
                            <li className="active"><h4 className="reviews text-capitalize">Reports</h4></li>
                        </ul>    
                        {track.reports.length === 0 ? 
                          (
                            <div className="tab-content">
                              <div className="tab-pane active" id="reports-logout">  
                                <p> - No reports to display - </p>
                              </div>  
                            </div>
                          
                          ) 
                          :
                          (
                            <div className="tab-content">
                              <div className="tab-pane active" id="reports-logout">  
                                {this.getReports(track.reports,track.userDetails)}
                              </div>  
                            </div>
                           )}        
                        
                    </div>
              </div>
            </div>

          </TamplateComponent>

          <div style={{paddingBottom:'20px'}}>
          
            <Map 
            track={this.buildTrack(track)}
            idOfTrack={track._id}
            isFromTrackDetails={true}
            >
            </Map>

          </div>
        </div>
      </div>
    )
  }

  render() {
    
    return (
      <div>
        <Card>

          {/* Show Menu And User Details When Page Stop Loading sessionStorage */}
          <Menu currentPage={"Choose Existing"}> </Menu>

          {/* Page BreadCrumbs */}
          <Breadcrumb>
            <Breadcrumb.Item href="/">Login</Breadcrumb.Item>
            <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/choose">Choose</Breadcrumb.Item>
            <Breadcrumb.Item active>Details</Breadcrumb.Item>
            <BLE>
            </BLE>
          </Breadcrumb>
          <div className="text-center">
            {this.state.tracks.map(this.viewTrack)}
          </div>
          <Card.Footer id="locationUpdate" className="text-muted"></Card.Footer>
        </Card>
      </div>
    );
  }
}


export default TrackDetails;

 // <div className="col-12" style={{margin:'auto'}}>
      //   <NavLink to=
      //   //navigate to TrackDetails via TemplateComponent with the params
      //   {{pathname: `${process.env.PUBLIC_URL}/liveMap`, 
      //     idOfTrack: track.idOfTrack,
      //     track:this.buildTrack(track)}}
      //     activeStyle={this.active} 
      //     style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
      //     className="btn btn-primary" >Start Navigator</NavLink>
      // </div>
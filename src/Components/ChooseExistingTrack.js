import React, { Component } from 'react';
import TamplateComponent from './TemplateComponent'
import './style/ChooseExistingTrack.css'
import IoAndroidBicycle from 'react-icons/lib/io/android-bicycle';
import MdDirectionsWalk from 'react-icons/lib/md/directions-walk';
import {getAllTracksURL, getTracksByCityURL, getPointURL} from '../globalService'
import { NavLink } from "react-router-dom";
import { Card, Breadcrumb } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import Menu from './Menu'
import axios from 'axios';
import FavoriteButton from './FavoriteButton';
import { Button } from 'semantic-ui-react'

class ChooseExistingTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      startPoint: [],
      endPoint: [],
      wayPoints: [],
      userDetails: [],
      travelMode: ''
    }

    this.addTracks = this.addTracks.bind(this)
    this.viewTracks = this.viewTracks.bind(this)
    this.updateTracks = this.updateTracks.bind(this)
    this.getAllTracks = this.getAllTracks.bind(this)
    this.getReports = this.getReports.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleChange  = this.handleChange.bind(this)
    this.getTimeOfTrack = this.getTimeOfTrack.bind(this)
  }
  
  onSubmit(e){
    // e.preventDefault();
    e.preventDefault();
    var checkedTravelMode = this.refs.bicycling.checked ? 'Bicycling' : 'Walking';

    var checkedStar = "NO";
    console.log("REUT:");
    console.log(this.refs.star1);
    console.log(this.refs.star1 === 'undefined');
    if( typeof this.refs.star1 !== 'undefined'){
      if(this.refs.star1.checked)
        checkedStar = "1";
      if(this.refs.star2.checked)
        checkedStar = "2";
      if(this.refs.star3.checked)
        checkedStar = "3";
      if(this.refs.star4.checked)
        checkedStar = "4";
      if(this.refs.star5.checked)
        checkedStar = "5";
    }

    fetch(getTracksByCityURL(this.state.from,this.state.to,checkedTravelMode,checkedStar,this.state.userDetails.accessibility))
    .then((res) => { 
      return res.json();      
    }).then((data) => {
      console.log("DATTTTTA");
      console.log(data);  
      var self=this; 
      this.state.tracks = [];
      if( data.length == 0){
          self.addTracks('','','','','','','',''); 
      }  
      if( data.message == "No tracks found"){
        self.addTracks('','','','','','','',''); 
    }    
      else{
        data.map(json => { 
          console.log("JSONNNNNNNNN");
          console.log(json);
          let jsonParse = json[0];
          self.addTracks(jsonParse._id,jsonParse.title, jsonParse.travelMode, jsonParse.reports, jsonParse.description,json[1],json[2],"",jsonParse.difficultyLevel.star,jsonParse.disabledTime, jsonParse.nonDisabledTime); 
        })  
      } 
    })

  }

  onChange(e){
    this.setState({[e.target.name]:e.target.value});
  }

  addTracks(_id,_title,_type, _reports, _description, _startPoint, _endPoint, _wayPoints, _difficultyLevel,_disabledTime,_nonDisabledTime) {
    this.setState(prevState => ({
      tracks: [
        ...prevState.tracks,      
      {
          id: this.state.tracks.length + 1,
          idOfTrack: _id,
          title: _title,
          travelMode: _type,
          reports: _reports,
          description: _description,
          startPoint:_startPoint,
          endPoint:_endPoint,
          wayPoints:_wayPoints,
          difficultyLevel: _difficultyLevel,
          disabledTime:_disabledTime,
          nonDisabledTime:_nonDisabledTime
      }]
    }))
  }

  updateTracks(newTrack, i) {
    this.setState(() => ({
      tracks: this.state.tracks.map(
        (trck) => (trck.id !== i) ? trck : {...trck, name: newTrack}
      )
    }))
  }
  
  getReports(reports){
    let html=[];
    // Outer loop to create parent
    for (let i = 0; i < reports.length; i++) {
      html.push(<p>	&#8227; &#9;{reports[i]}</p>)
    }
    return html;
  }

  getIconType(type){
    console.log("TYPEEEEEEEEEEEEEEE");
    console.log(type);

    if(type === 'WALKING')
      return <MdDirectionsWalk size={20} color="black" />;
    else
      return <IoAndroidBicycle size={20} color="black" />;
     
  }

  getPointsById(point){

    fetch(getPointURL(point))
    .then((res) => { 
      return res.json();      
    }).then((data) => {
      console.log("getPoint:");
      console.log(data);  
      var self=this; 
      this.state.startPoint = data;
    })
  }

  getStarsForDifficultyLevel(diffLever){
    let html=[];
    let diffNumber = Math.round(diffLever);
    let limitOfStars = 5;

    for (let i = 0; i < limitOfStars; i++) {
      if(i < diffNumber)
        html.push(<span className="fa fa-star colorStarOrange"></span>)
      else
        html.push(<span className="fa fa-star"></span>)

    }
    return html;
  } 

  getStarsForAccesability(){
    let html=[];

    for (let i = 0; i < 3; i++)
        html.push(<span className="fa fa-star colorStarOrange starAccesability"></span>)
    for (let i = 0; i < 2; i++)
      html.push(<span className="fa fa-star colorStarGrey starAccesability"></span>)

    return html;
  }

  getTimeOfTrack(disabledTime,nonDisabledTime){
    let html=[];

    let num;
    
    // if user is nonDisabledTime
    if(this.state.userDetails.accessibility === 0)
      num = nonDisabledTime.actual;
    else
      num = disabledTime.actual;

    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);

    html.push(<span key={'uniqKey'} className="">{rhours}:{rminutes}</span>)
    return html;
  }

  
   viewTracks(track,i) {
    console.log("TRACKTTTT:");
    console.log(track);
    if (track.title === ''){
      console.log("there are no tracks to display !");
      return (
        <div>
          <h3 style={{ margin: '0 auto'}}> There are no tracks to display</h3>
        </div>
      )
    }
    else if (this.state.userDetails.rank < 2 & track.difficultyLevel === 5 ){
        return (<div></div>)
    }
    else{
      // <p className="starCenter">{end.lat.toString()}</p>
     
      // let start = await this.getPointsById(track.startPoint);
      // let end = await this.getPointsById(track.endPoint);
      // console.log("LAT AND LNG:");
      // console.log(start);
      // console.log(end);

      return (          
        <div key={'container'+i} className="col-10 p-md-4 card borderBlue" style={{ margin:`20px auto`}}>
            <div className="">
              <TamplateComponent key={'track'+i} index={i} onChange={this.updateTracks}>  
              
              <h1 className="card-title title" style={{ textAlign:`center`}}>{track.title}</h1>
                <p className="typeTrack">{this.getIconType(track.travelMode)}</p>
                <p className="typeTrack">{this.getTimeOfTrack(track.disabledTime,track.nonDisabledTime)} </p>
                <p className="descriptionTrack marginTop18" style={{ textAlign:`center`}}>{track.description}</p>
                <p className="starCenter">{this.getStarsForDifficultyLevel(track.difficultyLevel)}</p>


              <FavoriteButton
              trackid={track.idOfTrack}>
              </FavoriteButton>

              
              <NavLink to=
              //navigate to TrackDetails via TemplateComponent with the params
              {{pathname: `${process.env.PUBLIC_URL}/trackDetails`, 
                idOfTrack: track.idOfTrack}}
                activeStyle={this.active} 
                className="" >
                <Button primary style={{width: '100%'}}>
                Live Navigation
                </Button>
              </NavLink>

              </TamplateComponent>

              <div style={{paddingBottom:'20px'}}>
              </div>

          </div>
          
        </div>
      )
    }
  }

  getAllTracks(){
    fetch(getAllTracksURL())
    .then((res) => {        
      return res.json();      
    }).then((data) => {      
      var self=this;        
      data.map((json) => {   
        self.addTracks(json.track._id,json.track.title, json.track.type, json.track.reports, json.track.description,
          json.startPoint, json.endPoint, json.wayPoints, json.track.difficultyLevel.star);  
      })    // endOf data.map((data)  
    })
  }

  componentDidMount(){
    // user session
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
    console.log(`Entered <ChooseExistingTrack> componentDidMount(), fetching userid: ${this.userid}`);

    // Get the user details from database
    axios.get(`http://localhost:3000/user/getAccountDetails/${this.userid}`)
      .then(userResponse => {
        this.setState({ userDetails: userResponse.data, loading: false });
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleChange(event){
    console.log("event:");
    console.log(event.target.name);
    console.log(event.target.value);
    this.setState({ [event.target.name]: event.target.value})
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
            <Breadcrumb.Item active>Choose</Breadcrumb.Item>
          </Breadcrumb>

          <Card.Body className="text-center">
            <Card.Title>
              <h6> Choose Origin and Destination </h6>
            </Card.Title>

           <form onSubmit={this.onSubmit}>
                <div className="container">
                    <div className="row">
                      <div className="col">
                        <div className="rowForm">
                          <input required placeholder="Origin" className="mt-2 form-control float-left" type="text" name="from" onChange={this.handleChange} value={this.state.from}/>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                    <div className="col">
                      <div className="rowForm">
                        <input required placeholder="Destination" className="mt-2 form-control float-left" type="text" name="to" onChange={this.handleChange} value={this.state.to}/>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-md-center text-center">
                  <div className="form-group custom-control custom-radio mr-4 justify-content-md-center text-center"> 
                    <input className="marginInherit radioTravelMode" type="radio" ref="walking" name="type" id="walking" autoComplete="off" onChange={this.handleChange} value={this.state.walking} required />
                    <label className=''>Walking</label>
                  </div>
                  <div className="form-group custom-control custom-radio mr-4 justify-content-md-center radioTravelMode text-center"> 
                  <input className="marginInherit radioTravelMode" type="radio" ref="bicycling" name="type" id="bicycling" autoComplete="off" onChange={this.handleChange} value={this.state.bicycling} />                  
                  <label className=''>Bicycling</label>
                </div>
                </div>
                
                {
                  this.state.userDetails.accessibility === '2' ?
                  (
                    <div className="container">
                    <h6>Choose Difficulty Level</h6>
                    <p className="starCenter">{this.getStarsForAccesability()}</p>
                    </div>
                  ) 
                  :
                  (
                    <div>
                    <h6>Choose Difficulty Level</h6>
                      <div className="row rating">     
                          <input className="inputStarts" type="radio" name="stars" id="4_stars" value="4" ref="star5" onChange={this.handleChange} value={this.state.stars} />
                          <label className="stars" htmlFor="4_stars">4 stars</label>
                          <input className="inputStarts" type="radio" name="stars" id="3_stars" value="3" ref="star4" onChange={this.handleChange} value={this.state.stars} />
                          <label className="stars" htmlFor="3_stars">3 stars</label>
                          <input className="inputStarts" type="radio" name="stars" id="2_stars" value="2" ref="star3" onChange={this.handleChange} value={this.state.stars} />
                          <label className="stars" htmlFor="2_stars">2 stars</label>
                          <input className="inputStarts" type="radio" name="stars" id="1_stars" value="1" ref="star2" onChange={this.handleChange} value={this.state.stars} />
                          <label className="stars" htmlFor="1_stars">1 star</label>
                          <input className="inputStarts" type="radio" name="stars" id="0_stars" value="0" ref="star1" onChange={this.handleChange} value={this.state.stars} />
                          <label className="stars" htmlFor="0_stars">0 star</label>
                      </div>
                    </div>
                  )
                }

              <div className="row">
                <div className="w-100 mb-md-4"></div>
                <div className="col-12 mx-auto">
                    <button className='btn btn-primary' type='submit'>
                      Search Now
                    </button>
                </div>
              </div>
              
         </form>

          </Card.Body>

          <Card.Header> 
          </Card.Header>


          <div className="w-100 mb-md-4 pt-3"></div>
            <div className="col-12 mx-auto">
                {this.state.tracks.map(this.viewTracks)}
            </div>

            
          <Card.Body style={{ textAlign: 'center'}}>
            {this.state.loading ?
              (
            <div className="col-12 mx-auto">
                {this.state.tracks.map(this.viewTracks)}
            </div>
              )
              :
              (
                <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
              )
            }
          </Card.Body>
          <Card.Footer id="locationUpdate" className="text-muted"></Card.Footer>
        </Card>
      </div>
    );

  }
}


export default ChooseExistingTrack;
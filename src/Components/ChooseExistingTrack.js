import React, { Component } from 'react';
import TamplateComponent from './TemplateComponent'
import './style/ChooseExistingTrack.css'
import IoAndroidBicycle from 'react-icons/lib/io/android-bicycle';
import MdDirectionsWalk from 'react-icons/lib/md/directions-walk';
import IoMap from 'react-icons/lib/io/map';
import {getAllTracksURL, getTracksByCityURL, PostRequest} from '../globalService'
import { NavLink , Link} from "react-router-dom";
import { Card, Navbar, Nav } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import Map from './Map'
import axios from 'axios';


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

    // TODO: parse city to upper case and lower case:
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
          self.addTracks(json._id,json.title, json.type, json.reports, json.description,"","","",json.difficultyLevel.star,json.disabledTime, json.nonDisabledTime); 
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
    if(type == 'Walking')
      return <MdDirectionsWalk size={20} color="black" />;
    else
      return <IoAndroidBicycle size={20} color="black" />;
     
  }

  getStarsForDifficultyLevel(diffLever){
    let html=[];
    let diffNumber = Math.round(diffLever);
    let limitOfStars = 5;

    for (let i = 0; i < limitOfStars; i++) {
      if(i < diffNumber)
        html.push(<span class="fa fa-star colorStar"></span>)
      else
        html.push(<span class="fa fa-star"></span>)

    }
    return html;
  } 

  getTimeOfTrack(disabledTime,nonDisabledTime){
    let html=[];

    let num;
    // this.state.userDetails.accessibility;
    // if user is nonDisabledTime
    if(this.state.userDetails.accessibility == 0)
      num = nonDisabledTime.actual;
    else
      num = disabledTime.actual;

    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);

    html.push(<span class="">{rhours}:{rminutes}</span>)
    return html;
  }

  viewTracks(track,i) {
    if(track.title == ''){
      console.log("there are no tracks to display !");
      return (
        <div>
          <h3 style={{ margin: '0 auto'}}> There are no tracks to display</h3>
        </div>
      )
    }
    else{
     
      return (          
        <div key={'container'+i} className="col-10 p-md-4 card borderBlue" style={{ margin:`20px auto`}}>
            <div className="">
              <TamplateComponent key={'track'+i} index={i} onChange={this.updateTracks}>  
              
              <NavLink to=
              //navigate to TrackDetails via TemplateComponent with the params
              {{pathname: `${process.env.PUBLIC_URL}/trackDetails`, 
                idOfTrack: track.idOfTrack}}
                activeStyle={this.active} 
                className="" >
                <h1 className="card-title title" style={{ textAlign:`center`}}>{track.title}</h1>
                <p className="typeTrack">{this.getIconType(track.travelMode)}</p>
                <p className="typeTrack">{this.getTimeOfTrack(track.disabledTime,track.nonDisabledTime)} </p>
                <p className="descriptionTrack marginTop18" style={{ textAlign:`center`}}>{track.description}</p>
                <p>{this.getStarsForDifficultyLevel(track.difficultyLevel)}</p>
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
    // this.getAllTracks();
    // user session
    this.userid = JSON.parse(sessionStorage.getItem('userDetails'));
    console.log(`Entered <AutoGenerateTrack> componentDidMount(), fetching userid: ${this.userid}`);

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
    this.setState({ [event.target.name]: event.target.value})
  }

  render() {
    return (
      <div>
        <Card className="text-center">

          <Card.Header>
            <Navbar collapseOnSelect expand="lg">

              <Navbar.Brand href="#profilePicture" style={{ float: 'left' }}>
                {this.state.userDetails.profilePicture ?
                  (
                    <img alt="Profile" src={this.state.userDetails.profilePicture} style={{ height: '40px', width: '40px', float: 'left', borderRadius: '50%' }}></img>
                  )
                  :
                  (
                    <div className='sweet-loading'> <BeatLoader color={'#123abc'} /> </div>
                  )
                }
              </Navbar.Brand>

              <Navbar.Brand href="#name" style={{ float: 'center' }}>
                {this.state.userDetails.name ?
                  (
                    <div>
                      <p>{this.state.userDetails.name}</p>
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
                <Nav className="mr-auto">
                <NavLink to=
                  //navigate to TrackDetails via TemplateComponent with the params
                  {{pathname: `${process.env.PUBLIC_URL}/profile`}}
                    activeStyle={this.active} 
                    style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                    >View Profile</NavLink>

                  <NavLink to=
                  //navigate to TrackDetails via TemplateComponent with the params
                  {{pathname: `${process.env.PUBLIC_URL}/favorites`}}
                    activeStyle={this.active} 
                    style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                    >Favorite Tracks</NavLink>

                  <NavLink to=
                  //navigate to TrackDetails via TemplateComponent with the params
                  {{pathname: `${process.env.PUBLIC_URL}/auto`}}
                    activeStyle={this.active} 
                    style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                    >Generate Auto Track</NavLink>
                    
                  <NavLink to=
                  //navigate to TrackDetails via TemplateComponent with the params
                  {{pathname: `${process.env.PUBLIC_URL}/choose`}}
                    activeStyle={this.active} 
                    style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                    >Choose Existing Tracks</NavLink>

                  <NavLink to=
                  //navigate to TrackDetails via TemplateComponent with the params
                  {{pathname: `${process.env.PUBLIC_URL}/custom`}}
                    activeStyle={this.active} 
                    style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
                    >Custom Made Track</NavLink>

                </Nav>
              </Navbar.Collapse>

            </Navbar>
          </Card.Header>

          <Card.Body>
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

                <div className="d-flex flex-wrap justify-content-md-center">
                  <div className="form-group custom-control custom-radio mr-4 justify-content-md-center"> 
                    <input className="marginInherit radioTravelMode" type="radio" ref="walking" name="type" id="walking" autoComplete="off" onChange={this.handleChange} value={this.state.walking} required />
                    <label className=''>Walking</label>
                  </div>
                  <div className="form-group custom-control custom-radio mr-4 justify-content-md-center radioTravelMode"> 
                  <input className="marginInherit radioTravelMode" type="radio" ref="bicycling" name="type" id="bicycling" autoComplete="off" onChange={this.handleChange} value={this.state.bicycling} />                  
                  <label className=''>Bicycling</label>
                </div>
                </div>
               
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


              <div className="row">
                <div className="w-100 mb-md-4"></div>
                <div className="col-12 mx-auto">
                    <button className='btn btn-primary' type='submit'>
                      Build Route
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

            
          <Card.Body>
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
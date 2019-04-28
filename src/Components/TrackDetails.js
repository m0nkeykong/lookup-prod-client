import React, { Component } from 'react';
import {getTrackByIdURL} from '../globalService';
import TamplateComponent from './TemplateComponent';
import { NavLink , Link} from "react-router-dom";
import TiArrowBackOutline from 'react-icons/lib/ti/arrow-back-outline';
import IoAndroidBicycle from 'react-icons/lib/io/android-bicycle';
import MdDirectionsWalk from 'react-icons/lib/md/directions-walk';
import Map from './Map';
import { Button, Card, Form, Col, Row, Container, Navbar, NavItem, NavDropdown, Nav, MenuItem } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import './style/TrackDetails.css'


class TrackDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      startPoint: [],
      userDetails: [],
      endPoint: [],
      wayPoints: [],
      comments: [],
      userDetails: []
    }

    this.getTrackById = this.getTrackById.bind(this)
    this.addTrack = this.addTrack.bind(this)
    this.viewTrack = this.viewTrack.bind(this)
    this.updateTrack = this.updateTrack.bind(this)
    this.getComments = this.getComments.bind(this)
    // this.rating = this.rating.bind(this)
  }
  
  componentDidMount() {
    let idOfTrack=this.props.location.idOfTrack;
    console.log(idOfTrack);

    // this.getTrackById("5ca9d94c87d03b340f708ffd");
    this.getTrackById(idOfTrack);
  }

  getTrackById(trackId){
    fetch(getTrackByIdURL(trackId))
    .then((res) => {        
      return res.json();      
    }).then((data) => { 
      console.log("DATA:");
      console.log(data);       
      var self=this;      
      self.addTrack(data.track._id,data.track.title, data.track.type, data.comments, data.userDetails,
        data.startPoint, data.endPoint, data.wayPoints, data.track.description);        
    })

  }

  addTrack(_id,_title,_type, _comments,_userDetails,_startPoint, _endPoint, _wayPoints, _description) {
    this.setState(prevState => ({
      tracks: [
      ...prevState.tracks,
      {
          id: this.state.tracks.length + 1,
          idOfTrack: _id,
          title: _title,
          type: _type,
          comments: _comments,
          userDetails: _userDetails,
          startPoint:_startPoint,
          endPoint:_endPoint,
          wayPoints:_wayPoints,
          description: _description
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

  getComments(comments, userDetails){
    let html=[];
    console.log(comments);
    // Outer loop to create parent
    for (let i = 0; i < comments.length; i++) {
      // html.push(<p>	&#8227; &#9;{comments[i].comment}</p>)

      html.push(
        <ul class="media-list">
          <li class="media">
            <a class="pull-left" href="#">
              <img class="media-object img-circle" src={userDetails[i].profilePicture} alt="profile"></img>
            </a>
            <div class="media-body">
              <div class="well well-lg">
                  <h5 class="media-heading text-uppercase nameTitle">{userDetails[i].name}</h5>
                  <p class="media-comment">
                    {comments[i].comment}
                  </p>
              </div>              
            </div>
          </li> 
        </ul> 
      );
    }
    return html;
  }

  getStartPoint(startPoint){
    let html=[];
    console.log(`startPoint: ${startPoint}`);
    console.log(startPoint);

      html.push(<p>	&#8227; &#9; latitude: {startPoint.latitude}</p>)
      html.push(<p>	&#8227; &#9; longitude: {startPoint.longitude}</p>)
    return html;
  }

  getEndPoint(endPoint){
    let html=[];
    console.log(`endPoint: ${endPoint}`);
    console.log(endPoint);

    html.push(<p>	&#8227; &#9; latitude: {endPoint.latitude}</p>)
    html.push(<p>	&#8227; &#9; longitude: {endPoint.longitude}</p>)
    return html;
  }

  getWayPoints(wayPoints){
    let html=[];
    console.log(`wayPoints: ${wayPoints}`);

    if(wayPoints.length != 0){
      for (let i = 0; i < wayPoints.length; i++) {
        html.push(<p style={{fontSize: '15px'}}> &#9; point number: {i}</p>)
        html.push(<p>	&#8227; &#9;latitude: {wayPoints[i].latitude}</p>)
        html.push(<p>	&#8227; &#9;longitude: {wayPoints[i].longitude}</p>)
      }
    }
    return html;
  }

  getIconType(type){
    if(type == 'Walking')
      return <MdDirectionsWalk size={20} color="black" />;
    else
      return <IoAndroidBicycle size={20} color="black" />;
     
  }

  viewTrack(track,i) {
    console.log("TRACKKKKKKKKKKK _____________________");
    console.log(track);
    return (          
      <div key={'container'+i}>

        <div className="col-10 p-md-4">
        <NavLink to=
        //navigate to TrackDetails via TemplateComponent with the params
        {{pathname: `${process.env.PUBLIC_URL}/choose`}}
          activeStyle={this.active} 
          style={{padding:'6px', verticalAlign:'baseline'}}
          className="tring" >
          <TiArrowBackOutline size={29} color='black'/></NavLink>
      </div>


      <div className="col-10" style={{margin:'auto'}}>
        <NavLink to=
        //navigate to TrackDetails via TemplateComponent with the params
        {{pathname: `${process.env.PUBLIC_URL}/trackDetails`, 
          idOfTrack: track.idOfTrack}}
          activeStyle={this.active} 
          style={{padding:'6px', marginTop:'15px',verticalAlign:'middle'}}
          className="btn btn-primary" >Start Navigator</NavLink>
      </div>

          <div className="col-10 p-md-4" style={{ margin:`0 auto`,width: 18 + 'rem'}}>

          <TamplateComponent key={'track'+i} index={i} onChange={this.updateTrack}>  
            <h1 className="card-title title" style={{ textAlign:`center`, marginTop: '20px'}}>{track.title}</h1>
            <p className="typeTrack">{this.getIconType(track.type)}</p>
            <p className="descriptionTrack"><br></br>{track.description}</p>

              <div class="row">
                <div class="col-sm-10 col-sm-offset-1" id="logout">
                    
                    <div class="comment-tabs">
                        <ul class="nav nav-tabs" role="tablist">
                            <li class="active"><a href="#comments-logout" role="tab" data-toggle="tab"><h4 class="reviews text-capitalize">Comments</h4></a></li>
                        </ul>            
                        <div class="tab-content">
                            <div class="tab-pane active" id="comments-logout">  
                              {this.getComments(track.comments,track.userDetails)}
                            </div>  
                            
                            

                            <div class="col-sm-10 col-sm-offset-1 pt-2"> 
                            <ul class="nav nav-tabs" role="tablist">
                              <li class="active"><a href="#comments-logout" role="tab" data-toggle="tab"><h4 class="addComment text-capitalize">Add comment</h4></a></li>
                            </ul> 
                
                            <div class="tab-pane" id="add-comment">
                              <form action="#" method="post" class="form-horizontal" id="commentForm" role="form"> 
                                  <div class="form-group">
                                      <div class="col-sm-10">
                                        <textarea className="form-control textareaSize" name="addComment" id="addComment" rows="5"></textarea>
                                      </div>
                                  </div>
                                  <div class="form-group">
                                      <div class="col-sm-offset-2 col-sm-10">                    
                                          <button className="btn btn-success btn-circle text-uppercase" type="submit" id="submitComment"><span class="glyphicon glyphicon-send"></span> Submit comment</button>
                                      </div>
                                  </div>            
                              </form>
                            </div>
                          </div>

                        </div>
                    </div>
              </div>
            </div>

          </TamplateComponent>

          <div style={{paddingBottom:'20px'}}>
            <Map track={track}></Map>
          </div>
        </div>
      </div>
    )
  }

  // <Card.Body>
  //           <Card.Title>
  //             <h6> Choose Origin and Destination </h6>
  //          </Card.Title>
  //         </Card.Body>

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
                  <Nav.Link href="#profile">View Profile</Nav.Link>
                  <Nav.Link href="#favoriteTracks">Favorite Tracks</Nav.Link>
                  <NavDropdown title="Navigate a Route" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="#action/2.1">Choose Existing Track</NavDropdown.Item>
                    <NavDropdown.Item href="#action/2.2">Generate Auto Track</NavDropdown.Item>
                    <NavDropdown.Item href="#action/2.3">Custom Made Track</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/2.4">Info</NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link href="#searcgTracks">Serach Tracks</Nav.Link>
                  <Nav.Link href="#vibrations">Vibrations</Nav.Link>
                  <Nav.Link href="#about">About</Nav.Link>
                  <Nav.Link href="#contact">Contact us</Nav.Link>
                </Nav>
              </Navbar.Collapse>

            </Navbar>
          </Card.Header>
          {this.state.tracks.map(this.viewTrack)}
          <Card.Footer id="locationUpdate" className="text-muted"></Card.Footer>
        </Card>
      </div>
    );
  }
}


export default TrackDetails;


            // <p className="titles">start point: </p>
            //  <p style={{fontSize:'10px'}}>{this.getStartPoint(track.startPoint)}</p>
            //  <p className="titles">end point: </p>
            //  <p style={{fontSize:'10px'}}>{this.getEndPoint(track.endPoint)}</p>
            //  <p className="titles">middle points: </p>
            //     <p style={{fontSize:'10px'}}>{this.getWayPoints(track.wayPoints)}</p>
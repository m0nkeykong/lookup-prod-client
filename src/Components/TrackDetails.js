import React, { Component } from 'react';
import {getTrackByIdURL} from '../globalVariables';
import TamplateComponent from './TemplateComponent';
import { NavLink , Link} from "react-router-dom";
import TiBackspace from 'react-icons/lib/ti/backspace';
import IoAndroidBicycle from 'react-icons/lib/io/android-bicycle';
import MdDirectionsWalk from 'react-icons/lib/md/directions-walk';
import HomePage from './HomePage';
// import $ from 'jquery';
import './style/TrackDetails.css'


class TrackDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      startPoint: [],
      endPoint: [],
      wayPoints: []
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
      console.log(`DESCRIPTIONL: ${data.track.description}`)  
      self.addTrack(data.track._id,data.track.title, data.track.type, data.track.comments,
        data.startPoint, data.endPoint, data.wayPoints, data.track.description);        
    })

  }

  addTrack(_id,_title,_type, _comments,_startPoint, _endPoint, _wayPoints, _description) {
    this.setState(prevState => ({
      tracks: [
      ...prevState.tracks,
      {
          id: this.state.tracks.length + 1,
          idOfTrack: _id,
          title: _title,
          type: _type,
          comments: _comments,
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

  getComments(comments){
    let html=[];
    console.log(comments);
    // Outer loop to create parent
    for (let i = 0; i < comments.length; i++) {
      html.push(<p>	&#8227; &#9;{comments[i]}</p>)
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

  // rating(){
  
  //     /* 1. Visualizing things on Hover - See next part for action on click */
  //     $('#stars li').on('mouseover', function(){
  //       var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
       
  //       // Now highlight all the stars that's not after the current hovered star
  //       $(this).parent().children('li.star').each(function(e){
  //         if (e < onStar) {
  //           $(this).addClass('hover');
  //         }
  //         else {
  //           $(this).removeClass('hover');
  //         }
  //       });
        
  //     }).on('mouseout', function(){
  //       $(this).parent().children('li.star').each(function(e){
  //         $(this).removeClass('hover');
  //       });
  //     });
      
      
  //     /* 2. Action to perform on click */
  //     $('#stars li').on('click', function(){
  //       var onStar = parseInt($(this).data('value'), 10); // The star currently selected
  //       var stars = $(this).parent().children('li.star');
        
  //       for (let i = 0; i < stars.length; i++) {
  //         $(stars[i]).removeClass('selected');
  //       }
        
  //       for (let i = 0; i < onStar; i++) {
  //         $(stars[i]).addClass('selected');
  //       }
        
  //       // JUST RESPONSE (Not needed)
  //       var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
  //       var msg = "";
  //       if (ratingValue > 1) {
  //           msg = "Thanks! You rated this " + ratingValue + " stars.";
  //       }
  //       else {
  //           msg = "We will improve ourselves. You rated this " + ratingValue + " stars.";
  //       }
  //       responseMessage(msg);
        
  //     });
      
  //   function responseMessage(msg) {
  //     $('.success-box').fadeIn(200);  
  //     $('.success-box div.text-message').html("<span>" + msg + "</span>");
  //   }

  // }

  viewTrack(track,i) {
    console.log("TRACKKKKKKKKKKK _____________________");
    console.log(track);
    return (          
      <div key={'container'+i}>
           
      <NavLink to=
      //navigate to TrackDetails via TemplateComponent with the params
      {{pathname: `${process.env.PUBLIC_URL}/trackDetails`, 
        idOfTrack: track.idOfTrack}}
        activeStyle={this.active} 
        style={{backgroundColor:'black'}}
        className="btn float-right" >Start Navigator</NavLink>

        <NavLink to=
        //navigate to TrackDetails via TemplateComponent with the params
        {{pathname: `${process.env.PUBLIC_URL}/choose`, 
          idOfTrack: track.idOfTrack}}
          activeStyle={this.active}>
          <TiBackspace size={29} color='black'/> </NavLink>

          <div className="col-10 p-md-4" style={{ margin:`0 auto`,width: 18 + 'rem'}}>
          <TamplateComponent key={'track'+i} index={i} onChange={this.updateTrack}>  
            <h1 className="card-title" style={{ textAlign:`center`, color: 'white', marginTop: '20px'}}>{track.title} {this.getIconType(track.type)}</h1>
            <p style={{ textAlign:`center`, color: 'white'}}>Description: <br></br>{track.description}</p>
              <p className="titles">comments: </p>
             <p style={{ border:`groove`,fontSize:'10px'}}>{this.getComments(track.comments)}</p>
             
            <div>
              <p className="titles">comments: </p>

            </div>
          </TamplateComponent>
          <div>
            <HomePage track={track}></HomePage>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="container half-black">
        <div className ="row padding2em">
          {this.state.tracks.map(this.viewTrack)}
        </div>
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
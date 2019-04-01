import React, { Component } from 'react';
import {getTrackByIdURL} from '../globalVariables';
import TamplateComponent from './TemplateComponent';
import { NavLink , Link} from "react-router-dom";

class TrackDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      startPoint: [],
      endPoint: [],
      middlePoints: []

    }

    this.getTrackById = this.getTrackById.bind(this)
    this.addTrack = this.addTrack.bind(this)
    this.viewTrack = this.viewTrack.bind(this)
    this.updateTrack = this.updateTrack.bind(this)
    this.getComments = this.getComments.bind(this)

  }
  
  componentDidMount() {
    let idOfTrack=this.props.location.idOfTrack;
    console.log(idOfTrack);

    this.getTrackById('5c7bca6ef318fa537c9c6dbe');
    // this.doPostData(subName,'followSubject/');
    // this.doGetData(subName,'getSubjectByName/');  
  }

  getTrackById(trackId){
    fetch(getTrackByIdURL(trackId))
    .then((res) => {        
      return res.json();      
    }).then((data) => { 
      console.log("DATA:");
      console.log(data);       
      var self=this;        
      self.addTrack(data.track._id,data.track.title, data.track.type, data.track.comment,
        data.startPoint, data.endPoint, data.middlePoints);        
    })

  }

  addTrack(_id,_title,_type, _comment,_startPoint, _endPoint, _middlePoints) {
    this.setState(prevState => ({
      tracks: [
      ...prevState.tracks,
      {
          id: this.state.tracks.length + 1,
          idOfTrack: _id,
          title: _title,
          type: _type,
          comment: _comment,
          startPoint:_startPoint,
          endPoint:_endPoint,
          middlePoints:_middlePoints,
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
      html.push(<p>	&#8227; &#9; latitude: {startPoint.latitude}</p>)
      html.push(<p>	&#8227; &#9; longitude: {startPoint.longtitude}</p>)
    return html;
  }

  getEndPoint(endPoint){
    let html=[];
    console.log(`endPoint: ${endPoint}`);
    html.push(<p>	&#8227; &#9; latitude: {endPoint.latitude}</p>)
    html.push(<p>	&#8227; &#9; longitude: {endPoint.longtitude}</p>)
    return html;
  }

  // getMiddlePoints(middlePoints){
  //   let html=[];
  //   console.log(middlePoints);
  //   for (let i = 0; i < middlePoints.length; i++) {
  //     html.push(<p>	&#8227; &#9;{comments[i]}</p>)
  //   }
  //   return html;
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
        className="btn btn-primary float-right" >Start Navigator</NavLink>


          <div className="col-10 p-md-4" style={{ margin:`0 auto`,width: 18 + 'rem'}}>
          <TamplateComponent key={'track'+i} index={i} onChange={this.updateTrack}>  
            <h1 className="card-title" style={{ textAlign:`center`}}>{track.title} </h1>
            <p style={{ textAlign:`center`}}>type: {track.type}</p>
            <div>
              <p>comment: </p>
              <p style={{ border:`groove`,fontSize:'10px'}}>{this.getComments(track.comment)}</p>
              <p>start point: </p>
              <p style={{fontSize:'10px'}}>{this.getStartPoint(track.startPoint)}</p>
              <p>end point: </p>
              <p style={{fontSize:'10px'}}>{this.getEndPoint(track.endPoint)}</p>
              <p>middle points: </p>
              <p style={{fontSize:'10px'}}>{this.getComments(track.middlePoints)}</p>
            </div>
          </TamplateComponent>
        </div>
        
      </div>
    )
  }

  render() {
    return (
      <div className="container">
        <div className ="row">
          {this.state.tracks.map(this.viewTrack)}
        </div>
      </div>
    );
  }
}


export default TrackDetails;
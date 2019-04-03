import React, { Component } from 'react';
import {getTrackByIdURL} from '../globalVariables';
import TamplateComponent from './TemplateComponent';
import { NavLink , Link} from "react-router-dom";
import TiBackspace from 'react-icons/lib/ti/backspace';
import HomePage from './HomePage';
import './style/TrackDetails.css'


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
    console.log(startPoint);

      html.push(<p>	&#8227; &#9; latitude: {startPoint.latitude}</p>)
      html.push(<p>	&#8227; &#9; longitude: {startPoint.longtitude}</p>)
    return html;
  }

  getEndPoint(endPoint){
    let html=[];
    console.log(`endPoint: ${endPoint}`);
    console.log(endPoint);

    html.push(<p>	&#8227; &#9; latitude: {endPoint.latitude}</p>)
    html.push(<p>	&#8227; &#9; longitude: {endPoint.longtitude}</p>)
    return html;
  }

  getMiddlePoints(middlePoints){
    let html=[];
    console.log(`middlePoints: ${middlePoints}`);

    if(middlePoints.length != 0){
      for (let i = 0; i < middlePoints.length; i++) {
        html.push(<p style={{fontSize: '15px'}}> &#9; point number: {i}</p>)
        html.push(<p>	&#8227; &#9;latitude: {middlePoints[i].latitude}</p>)
        html.push(<p>	&#8227; &#9;longitude: {middlePoints[i].longtitude}</p>)
      }
    }
    return html;
  }

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
            <h1 className="card-title" style={{ textAlign:`center`, color: 'white'}}>{track.title} </h1>
            <p style={{ textAlign:`center`, color: 'white'}}>type: {track.type}</p>
              <p className="titles">comments: </p>
             <p style={{ border:`groove`,fontSize:'10px'}}>{this.getComments(track.comment)}</p>
             <p className="titles">start point: </p>
             <p style={{fontSize:'10px'}}>{this.getStartPoint(track.startPoint)}</p>
             <p className="titles">end point: </p>
             <p style={{fontSize:'10px'}}>{this.getEndPoint(track.endPoint)}</p>
             <p className="titles">middle points: </p>
                <p style={{fontSize:'10px'}}>{this.getMiddlePoints(track.middlePoints)}</p>
            <div>
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
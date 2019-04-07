import React, { Component } from 'react';
import TamplateComponent from './TemplateComponent'
import './style/ChooseExistingTrack.css'
import IoAndroidBicycle from 'react-icons/lib/io/android-bicycle';
import MdDirectionsWalk from 'react-icons/lib/md/directions-walk';
import {getAllTracksURL, getTracksByCityURL} from '../globalVariables'
import { NavLink , Link} from "react-router-dom";

class ChooseExistingTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      type: ''
    }

    this.addTracks = this.addTracks.bind(this)
    this.viewTracks = this.viewTracks.bind(this)
    this.updateTracks = this.updateTracks.bind(this)
    this.getAllTracks = this.getAllTracks.bind(this)
    this.getComments = this.getComments.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleChange  = this.handleChange.bind(this)

  }
  
  onSubmit(e){

    // e.preventDefault();
    // console.log("VALUES: " + this.state.from + ", " + this.state.to + ", " + this.state.travelers );

    //   this.props.history.push({
    // pathname: "/results",
    // state: this.state
    // });

    e.preventDefault();
  //   const target = event.target;
  // const value = target.type === 'checkbox' ? target.checked : target.value;
  // const name = target.name;

  // this.setState({
  //   [name]: value
  // });

    console.log("FROM:");
    console.log(this.state.from);
    console.log("to:");
    console.log(this.state.to);
    console.log("TYPE:");
    console.log(this.refs.walking.checked);
    console.log(this.refs.bicycling.checked);
    var checked = this.refs.bicycling.checked ? 'Bicycling' : 'Walking';

    // TODO: parse city to upper case and lower case:
    fetch(getTracksByCityURL(this.state.from,this.state.to,checked))
    .then((res) => { 
      // console.log(`RES::::::::::`);
      // console.log(res.status);       
      return res.json();      
    }).then((data) => {
      var self=this; 
      this.state.tracks = [];

      if( data.length == 0){
          self.addTracks('','','',''); 
      }    
      else{
        data.map(json => { 
          console.log(JSON.stringify(json) ); 
          self.addTracks(json._id,json.title, json.type, json.comments); 
        })  
      } 
    })

  }

  onChange(e){
    console.log(this.props.width);
  this.setState({[e.target.name]:e.target.value});
    // event.preventDefault();
    // const target = event.target;
    // const value = target.type === 'checkbox' ? target.checked : target.value;
    // const name = target.name;

    // console.log(`Value: ${value}`)
    // this.setState({
    //   [name]: value
    // });
  }

  addTracks(_id,_title,_type, _comments) {
    this.setState(prevState => ({
      tracks: [
        ...prevState.tracks,      
      {
          id: this.state.tracks.length + 1,
          idOfTrack: _id,
          title: _title,
          type: _type,
          comments: _comments
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
  
  getComments(comments){
    let html=[];
    // Outer loop to create parent
    for (let i = 0; i < comments.length; i++) {
      html.push(<p>	&#8227; &#9;{comments[i]}</p>)
    }
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
        <div key={'container'+i} className="col-10 p-md-4 card" style={{ margin:`0 auto`,width: 18 + 'rem'}}>
            <div className="">
              <TamplateComponent key={'track'+i} index={i} onChange={this.updateTracks}>  
  
              <NavLink to=
              //navigate to TrackDetails via TemplateComponent with the params
              {{pathname: `${process.env.PUBLIC_URL}/trackDetails`, 
                idOfTrack: track.idOfTrack}}
                activeStyle={this.active} 
                className="" >
                <h1 className="card-title" style={{ textAlign:`center`}}>{track.title} </h1>
                <p style={{ textAlign:`center`}}>type: {track.type}</p>
              </NavLink>
  
              <div>
                <p>comments: </p>
                <p style={{ border:`groove`,fontSize:'10px'}}>{this.getComments(track.comments)}</p>
              </div>
              
              </TamplateComponent>
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
        // console.log(JSON.stringify(json) );          
        self.addTracks(json._id,json.title, json.type, json.comments);        
          console.log(json);  
      })    // endOf data.map((data)  
    })
  }

  componentDidMount(){
    this.getAllTracks();
  }

  handleChange(event){
    
    this.setState({ [event.target.name]: event.target.value})
  }

  render() {
    return (
      <div className="container padding20px">
        <div className ="row">
        <div className="col-12 p-md-4">
          <form onSubmit={this.onSubmit}>
            <div className="row">
              
            <div className="col bg-white rounded">
              <label>From city:
              <input required className="mt-2 form-control float-left" type="text" name="from" onChange={this.handleChange} value={this.state.from}/>
            </label>
            <label>To city:
              <input required className="mt-2 form-control float-left" type="text" name="to" onChange={this.handleChange} value={this.state.to}/>
            </label>
          </div>

          <div className="col bg-white rounded">
              <label>Type:</label>
              <span className="d-block">
              <input className="float-left" type="radio" ref="walking" name="type" id="walking" autocomplete="off" onChange={this.handleChange} value={this.state.walking} required />
                <MdDirectionsWalk /> 
              </span>
              <span className="d-block">
              <input className="float-left" type="radio" ref="bicycling" name="type" id="bicycling" autocomplete="off" onChange={this.handleChange} value={this.state.bicycling} />
                <IoAndroidBicycle /> 
              </span>
              
          </div> 
        
          <div className="w-100 mb-md-4"></div>
          <div className="col-12 mx-auto">
            <button type="submit" className=" btn btn-primary mt-2 tn-block rounded-0 w-100 border-0">search tracks</button>
          </div>

            </div>
          </form>
        </div>
        
        <div className="w-100 mb-md-4 pt-3"></div>
          <div className="col-12 mx-auto">
              {this.state.tracks.map(this.viewTracks)}
		      </div>
        </div>
      </div>
    );
  }
}


export default ChooseExistingTrack;

// <input className="float-left" type="radio" name="option" id="walking" autocomplete="off" checked onChange={this.handleChange} value={this.state.type1} /> 
// 

// <input className="float-left" type="checkbox" ref="walking" name="walking" onChange={this.onChange} value={this.state.walking} aria-label="..."/>
// <input className="float-left" type="checkbox" ref="bicycling" name="bicycling" onChange={this.onChange} value={this.state.bicycling} aria-label="..."/>

// <label> Difficulty level:
//               <input required className="mt-2 form-control float-left" type="number" name="difficulty" min="1" max="5" onChange={this.handleChange} value={this.state.difficulty}></input>
//             </label>

// <input className="float-left" type="radio" ref="walking" name="walking" autocomplete="off" onChange={this.handleChangeRadio} value={this.state.walking} /> 
// <input className="float-left" type="radio" ref="bicycling" name="bicycling" autocomplete="off" onChange={this.handleChangeRadio} value={this.state.bicycling} /> 

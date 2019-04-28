import React, { Component } from 'react';
import TamplateComponent from './TemplateComponent'
import './style/ChooseExistingTrack.css'
import IoAndroidBicycle from 'react-icons/lib/io/android-bicycle';
import MdDirectionsWalk from 'react-icons/lib/md/directions-walk';
import {getAllTracksURL, getTracksByCityURL, PostRequest} from '../globalService'
import { NavLink , Link} from "react-router-dom";
import { Button, Card, Form, Col, Row, Container, Navbar, NavItem, NavDropdown, Nav, MenuItem } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';

class ChooseExistingTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: [],
      userDetails: [],
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
          self.addTracks(json._id,json.title, json.type, json.comments, json.description); 
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

  addTracks(_id,_title,_type, _comments, _description) {
    this.setState(prevState => ({
      tracks: [
        ...prevState.tracks,      
      {
          id: this.state.tracks.length + 1,
          idOfTrack: _id,
          title: _title,
          type: _type,
          comments: _comments,
          description: _description
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

  getIconType(type){
    if(type == 'Walking')
      return <MdDirectionsWalk size={20} color="black" />;
    else
      return <IoAndroidBicycle size={20} color="black" />;
     
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
        <div key={'container'+i} className="col-10 p-md-4 card" style={{ margin:`20px auto`,width: 18 + 'rem'}}>
            <div className="">
              <TamplateComponent key={'track'+i} index={i} onChange={this.updateTracks}>  
              
              <NavLink to=
              //navigate to TrackDetails via TemplateComponent with the params
              {{pathname: `${process.env.PUBLIC_URL}/trackDetails`, 
                idOfTrack: track.idOfTrack}}
                activeStyle={this.active} 
                className="" >
                <h1 className="card-title" style={{ textAlign:`center`}}>{track.title} {this.getIconType(track.type)}</h1>
                <p style={{ textAlign:`center`}}>{track.description}</p>
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
        self.addTracks(json._id,json.title, json.type, json.comments, json.description);        
          console.log(json);  
      })    // endOf data.map((data)  
    })
  }

  componentDidMount(){
    this.getAllTracks();

    let data = {city:"Kfar Saba", latitude:100, longitude:100 };
    console.log("DATA:");
    console.log(data);
    console.log(JSON.stringify(data));
    var res = PostRequest('point/insertPoint',data);
    console.log("response:");
    console.log(res);
  }

  handleChange(event){
    
    this.setState({ [event.target.name]: event.target.value})
  }

  render() {
    return (
      <div>

        
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
            <button type="submit" className=" btn btn-primary mt-2 tn-block rounded-0 w-100 border-0" style={{backgroundColor:'black', color:'#68e8db'}}>search tracks</button>
          </div>

            </div>
          </form>
            <div className="w-100 mb-md-4 pt-3"></div>
            <div className="col-12 mx-auto">
                {this.state.tracks.map(this.viewTracks)}
            </div>
        </div>
    );
  }
}


export default ChooseExistingTrack;
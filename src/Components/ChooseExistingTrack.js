import React, { Component } from 'react';
import TamplateComponent from './TemplateComponent'
import './style/AutoGenerateTrack.css';

class ChooseExistingTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tracks: []
    }

    this.addTracks = this.addTracks.bind(this)
    this.viewTracks = this.viewTracks.bind(this)
    this.updateTracks = this.updateTracks.bind(this)
    this.getTracks = this.getTracks.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

  }
  
  onSubmit(){
    // this.getTracks();
  }


  addTracks(_title,_type) {
    this.setState(prevState => ({
      tracks: [
      ...prevState.tracks,
      {
          id: this.state.tracks.length + 1,
          title: _title,
          type: _type,
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

  viewTracks(track,i) {
    return (          
      <div key={'container'+i} className="col-10 p-md-4" style={{ margin:`0 auto`,width: 18 + 'rem'}}>
          <div className="">
          <TamplateComponent key={'track'+i} index={i} onChange={this.updateTracks}>    
                <h1 className="card-title" style={{ textAlign:`center`}}>{track.title} </h1>
                <p style={{ textAlign:`center`}}>{track.type}</p>
           
          </TamplateComponent>
        </div>
        
      </div>
    )
  }

  getTracks(){
    fetch('http://localhost:3000/track/getAllTracks')
    .then((res) => {        
      return res.json();      
    }).then((data) => {        
      var self=this;        
      data.map((json) => {            
        self.addTracks(json.title, json.type);        
          console.log(json);  
      })    // endOf data.map((data)  
    })
  }

  componentDidMount(){
    this.getTracks();
  }

  render() {
    return (
      <div className="container">
        <div className ="row">
        <div className="col-12 p-md-4 border">
          <from onSubmit={this.onSubmit}>
            <div className="row">
              

            <div className="col bg-white border rounded  float-left">
              <label>from:
              <input className="form-control float-left" type="text" name="from" value={this.state.from} onChange={this.onChange}/>
          </label>
          </div>
          <div className="col bg-white border rounded  float-left">
              <label>To
              <input className="d-block form-control  float-left" type="text" name="to" value={this.state.to} onChange={this.onChange}/>
              </label>
          </div> 
        

            </div>
          </from>
        </div>
        
        
        {this.state.tracks.map(this.viewTracks)}
        </div>
      </div>
    );
  }
}


export default ChooseExistingTrack;
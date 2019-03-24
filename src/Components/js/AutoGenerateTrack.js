import React, { Component } from 'react';
import '../css/AutoGenerateTrack.css';

class AutoGenerateTrack extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  
  render() {
    return (
      <div className="container">
        <div className ="row">
        <div className="col-12 p-md-4 bg-dark border">
          <from onSubmit={this.onSubmit}>
            <div className="row">
              

            <div className="col bg-white border rounded  float-left">
              <label>from:
              <input className="form-control float-left" type="text" name="from" value={this.state.from} onChange={this.onChange}/>
          </label>
          </div>
          <div className="col bg-white border rounded  float-left">
              <label>To</label>
              <input className="d-block form-control  float-left" type="text" name="to" value={this.state.to} onChange={this.onChange}/>
          </div> 
        

            </div>
          </from>
        </div>
        
      
        </div>
      </div>
    );
  }
}


export default AutoGenerateTrack;
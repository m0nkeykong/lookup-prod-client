import React, { Component } from 'react';
import '../css/SomePage.css';

class somePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }


  }

  currentLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position);
        return position;
      })
    }
  }
  
  render() {
    return (
      <div className="container">
        <div className ="row">
          <p> hello SomePage! </p>
          {this.currentLocation()}
        </div>
      </div>
    );
  }
}


export default somePage;
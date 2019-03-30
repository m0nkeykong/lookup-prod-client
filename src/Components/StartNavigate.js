import React, { Component } from 'react';
import './css/StartNavigate_style.css';

class StartNavigate extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  
  render() {
    return (
      <div className="container">
        <div className ="row">
          <p> hello StartNavigate! </p>
        </div>
      </div>
    );
  }
}


export default StartNavigate;
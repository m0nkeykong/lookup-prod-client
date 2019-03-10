import React, { Component } from 'react';
import '../css/somePage_style.css';

class somePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  
  render() {
    return (
      <div className="container">
        <div className ="row">
          <p> hello world! </p>
        </div>
      </div>
    );
  }
}


export default somePage;
import React, { Component } from 'react';
import './style/CustomTrack.css';
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { BeatLoader } from 'react-spinners';

class CustomTrack extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
        userDetails: null,
        loading: true
    }

  }


    // Remember to replace this method because UNSAFE
    componentWillMount(){
        let userid = JSON.parse(sessionStorage.getItem('userDetails'))._id;
        axios.get(`http://localhost/user/getAccountDetails/${userid}`)
        .then(response => {
            console.log(response);
            this.setState({
                userDetails: response.data,
                loading: false
            })
        })
        .catch(error => {
            console.log(error);
        });

    // NotificationManager.info(message, title, timeOut, callback, priority);
    // NotificationManager.success(message, title, timeOut, callback, priority);
    // NotificationManager.warning(message, title, timeOut, callback, priority);
    // NotificationManager.error(message, title, timeOut, callback, priority);
  }


//   {this.state.loading ? (this.state.edit ? this.renderFORM() : this.showDetails()) :
//     <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div> }

render() {
    return (
      <div className="container">
        <div className ="row">
        </div>
        {this.state.loading ? "Done." : <div className='sweet-loading'> <BeatLoader color={'#123abc'}/> </div>}

      </div>
    );
  }
}


export default CustomTrack;



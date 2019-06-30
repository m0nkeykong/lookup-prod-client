import React, { Component } from 'react';
import BLEController from './BLEController';
import { makeStyles } from '@material-ui/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
// import { Icon, Button } from 'semantic-ui-react'
import Icon from '@material-ui/core/Icon';

// UI elements.
// const deviceNameLabel = document.getElementById('device-name');

class BLE extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBLEConnected: false
    }


    this.BLEController = new BLEController();

    this.receive = this.receive.bind(this);
    this._log = this._log.bind(this);
    this.send = this.send.bind(this);
    this.connectButton = this.connectButton.bind(this);
    this.disconnectButton = this.disconnectButton.bind(this);
    this.submited = this.submited.bind(this);

  }

  submited = () => {
    console.log(this.refs.inputField.value);
    this.send(this.refs.inputField.value);
    this.refs.inputField.value = '';
    this.refs.inputField.focus();
  }

  // log to console received data from component
  receive = () => {
    this.BLEController.receive = (data) => {
      this.BLEController._log(data);
    };
  }

  // log to console function
  _log = () => {
    this.BLEController._log = (...messages) => {
      messages.forEach((message) => {
        console.log(message);
      });
    }
  }

  // send data to component and log it in the console
  send = (data) => {
    this.BLEController.send(data).
      then(() => this.BLEController._log(data)).
      catch((error) => this.BLEController._log(error));
  };

  // connect button functionallity (open available bluetooth device list)                  
  connectButton = () => {
    this.BLEController.connect()
    .then((device) => {console.log('device connected')
      this.setState({
        isBLEConnected: true
      });}
    );
  };

  // disconnect button functionallity (disconnet component)               
  disconnectButton = () => {
    this.BLEController.disconnect();
    this.setState({ 
      isBLEConnected: false,
      showBLEnotification: false
     });
  };

  

  render() {
    const classes = (function () {
      makeStyles(theme => ({
        root: {
          maxWidth: 600,
        },
        snackbar: {
          margin: theme.spacing(1),
        },
      }));
    });
    return (
      <div>
        {!this.state.isBLEConnected ?
        <div style={{ fontSize: '120%', lineHight: '160%'}}>
            <Icon style={{ color: 'gray', fontSize: '35px' }} id="connect" onClick={this.connectButton} >bluetooth_disabled</Icon>
            {/* <Icon color='teal' size='big' name='bluetooth b' style={{ backgroundColor: 'light gray', borderRadius: '50%' }}/>Bluetooth */}
        </div> :
          <div style={{ fontSize: '120%', lineHight: '160%' }}>
            <Icon style={{ color: 'teal', fontSize: '35px' }} id="disconnect" onClick={this.disconnectButton}>bluetooth_connected</Icon>
        </div>
      }
        

          {/* <div className="item" >connect</div>
          <div className="item"  >disconnect</div>

        </div> */}

            {/* {
              !this.state.isBLEConnected ?
            <SnackbarContent
              className={classes.snackbar}
              message={
                'No device connected'
              }
            /> : null
            } */}
      </div>
    );
  }
}

export default BLE;

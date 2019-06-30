import React, { Component } from 'react';
import BLEController from './BLEController';
import { Modal, Button, Form } from 'react-bootstrap';
import { makeStyles } from '@material-ui/styles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
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
        <button id="connect" onClick={this.connectButton} type="button" aria-label="Connect" ref="device-name">
          <img alt="bleConnect" src={`/images/bleOnIcon.png`} style={{ height: '25px', width: '25px' }}></img><br></br>
        </button>
        <button id="disconnect" onClick={this.disconnectButton} type="button" aria-label="Disconnect">
          <img alt="bleDisconnect" src={`/images/bleOffIcon.png`} style={{ height: '25px', width: '25px' }}></img><br></br>
        </button>
            {
              !this.state.isBLEConnected ?
            <SnackbarContent
              className={classes.snackbar}
              message={
                'No device connected'
              }
            /> : null
              
              
              
              /* <>
              <Modal
                show={this.state.showBLEnotification}
                onHide={this.handleHide}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
              >
                <Modal.Header closeButton>
                  <Modal.Title id="example-custom-modal-styling-title">
                    Custom Modal Styling
            </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae
                    unde commodi aspernatur enim, consectetur. Cumque deleniti
                    temporibus ipsam atque a dolores quisquam quisquam adipisci
                    possimus laboriosam. Quibusdam facilis doloribus debitis! Sit
                    quasi quod accusamus eos quod. Ab quos consequuntur eaque quo rem!
                    Mollitia reiciendis porro quo magni incidunt dolore amet atque
                    facilis ipsum deleniti rem!
            </p>
                </Modal.Body>
              </Modal>
            </> */}
      </div>
    );
  }
}

export default BLE;

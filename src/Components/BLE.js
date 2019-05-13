import React, { Component } from 'react';
import './style/BLE.css';
import './style/normalize.css';
import BLEController from './BLEController';

// UI elements.
// const deviceNameLabel = document.getElementById('device-name');

class BLE extends Component {
  constructor(props) {
    super(props);
    
    this.terminal = new BLEController();
    
    this.receive = this.receive.bind(this);
    this._log = this._log.bind(this);
    this.send = this.send.bind(this);
    this.connectButton = this.connectButton.bind(this);
    this.disconnectButton = this.disconnectButton.bind(this);
    this.submited = this.submited.bind(this);
  
    this.defaultDeviceName = 'LookUP';
  }

  submited = () => {
    console.log(this.refs.inputField.value);
    this.send(this.refs.inputField.value);
    this.refs.inputField.value = '';
    this.refs.inputField.focus();
  }

  // log to console received data from component
  receive = () => {
    this.terminal.receive = (data) => {
      this.terminal._log(data);
    };
  }

  // log to console function
  _log = () => {
    this.terminal._log = (...messages) => {
      messages.forEach((message) => {
        console.log(message);
      });
    }
  }

  // send data to component and log it in the console
  send = (data) => {
    this.terminal.send(data).
      then(() => this.terminal._log(data)).
      catch((error) => this.terminal._log(error));
  };

  // connect button functionallity (open device browser)                  ------need to handle the device name------
  connectButton = () => {
    this.terminal.connect().
      then(() => {
        //this.refs.deviceNameLabel.textContent = this.terminal.getDeviceName() ? this.terminal.getDeviceName() : this.defaultDeviceName;
      });
  };

  // disconnect button functionallity (disconnet component)               ------need to handle the device name------
  disconnectButton = () => {
    this.terminal.disconnect();
    // this.refs.deviceNameLabel.textContent = this.defaultDeviceName;
  };
  
  render() {
    return (
      <div className="app">
        <div className="toolbar">
          <div id="device-name" className="name" ref="deviceNameLabel">Terminal</div>
          <div className="buttons">
            <button id="connect" onClick={this.connectButton} type="button" aria-label="Connect" ref="device-name">
              <i className="material-icons">bluetooth_connected</i>
            </button>
            <button id="disconnect" onClick={this.disconnectButton} type="button" aria-label="Disconnect">
              <i className="material-icons">bluetooth_disabled</i>
            </button>
          </div>
        </div>
        <div id="terminal" ref="terminalContainer" className="terminal"></div>
          <input id="input" ref="inputField" type="text" aria-label="Input" autoComplete="off" placeholder="Type something to send..." />
          <button onClick={this.submited} aria-label="Send">
            <i className="material-icons">send</i>
          </button>
      </div>
    );
  }
}

export default BLE;

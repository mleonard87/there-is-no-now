import React, { Component } from 'react';
import Splash from "./Splash";
import AccelerometerDemo from "./AccelerometerDemo";
import io from "socket.io-client";
import NoSleep from "./nosleep.js";
import './App.css';

const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clientId:  guid(),
      groupId: Math.round((Math.random() * 2) + 1),
      splashVisible: true,
      orientationClassName: "",
      dataFrequency: 1000,
      clockSkew: 0,
    };
  }

  componentDidMount = () => {
    window.addEventListener('orientationchange', this.handleOrientationChange);
    this.handleOrientationChange();
  };

  handleOrientationChange = () => {
    // alert("orientation change: " + window.orientation);
    // If the device does not support lock orientation then we deal with it
    // in CSS by rotating all the content in the opposite direction to compensate.
    let orientationClassName = "";
    switch(window.orientation) {
      case 90:
        orientationClassName =  " orientleft";
        break;
      case -90:
        orientationClassName = " orientright";
        break;
      default:
        orientationClassName =  "";
        break;
    }

    this.setState({
      orientationClassName: orientationClassName,
    })
  };

  handleBegin = () => {
    setTimeout(this.launchMainContent, 250);
  };

  noSleep = new NoSleep();

  launchMainContent = () => {
    this.setState({splashVisible: false});

    this.noSleep.enable();

    // Supports most browsers and their versions.
    const mainContent = this.mainContent;
    const requestMethod = mainContent.requestFullScreen || mainContent.webkitRequestFullScreen || mainContent.mozRequestFullScreen || mainContent.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
      requestMethod.call(mainContent);
    }

    if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
      window.screen.orientation.lock("portrait");
    }

    this.socket = io(`${process.env.REACT_APP_SERVER_URL}/app`);
    this.socket.on('connect', function(){});
    this.socket.on('disconnect', function(){});

    this.socket.on('control', this.updateControlData);
  };

  updateControlData = (controlData) => {
    let clockDelay = this.state.clockDelay;
    if (this.state.clockSkew !== controlData.clockSkew * 1000) {
      clockDelay = Math.round(Math.random() * (controlData.clockSkew * 1000));
    }

    if (controlData.clockSkew === 0) {
      clockDelay = 0;
    }

    this.setState({
      dataFrequency: controlData.dataFrequency * 1000,
      clockSkew: controlData.clockSkew * 1000,
      clockDelay: clockDelay,
      simulatedOutage: controlData.simulatedOutage,
    });
  };

  sendGyroData = (gyro) => {
    const data = {
      clientId: this.state.clientId,
      gamma: gyro.do.gamma,  // left-right
      beta: gyro.do.beta,  // front-back
    };
    this.socket.emit('gyroData', data);
  };

  backToSplash = () => {
    this.setState({splashVisible: true});

    this.noSleep.disable();

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }

    if (this.socket) {
      this.socket.close();
    }
  };

  mainContent = null;

  registerContent = (contentElem) => {
    this.mainContent = contentElem;
  };

  render() {
    // Only apply the rotation to the main app.
    let appClassName = "";
    if (!this.state.splashVisible) {
      appClassName = this.state.orientationClassName;
    }

    return (
      <div className={"app" + appClassName}>
        <Splash
          visible={this.state.splashVisible}
          onBegin={this.handleBegin}
          />
        <AccelerometerDemo
          groupId={this.state.groupId}
          registerContent={this.registerContent}
          onBackToSplash={this.backToSplash}
          visible={!this.state.splashVisible}
          sendGyroData={this.sendGyroData}
          dataFrequency={this.state.dataFrequency}
          clockSkew={this.state.clockSkew}
          clockDelay={this.state.clockDelay}
          simulatedOutage={this.state.simulatedOutage}
          />
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import Splash from "./Splash";
import AccelerometerDemo from "./AccelerometerDemo";
import './App.css';
import NoSleep from "./nosleep.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupId: Math.round((Math.random() * 2) + 1),
      splashVisible: true,
      orientationClassName: "",
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

    window.screen.orientation.lock("portrait");
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
          />
      </div>
    );
  }
}

export default App;

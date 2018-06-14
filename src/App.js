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
    }
  }

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

    try {
      window.screen.orientation.lock("portrait");
    } catch (err) {}
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
    return (
      <div className="app">
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

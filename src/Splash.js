import React, { Component } from "react";
import "./Splash.css";

export default class Splash extends Component {
  render() {
    return (
      <div className={"splash" + (this.props.visible ? " visible" : "")}>
        <header>
          <h1>Sensor Data Demo-matic 9000</h1>
        </header>
        <div className="intro">
          <p>To participate in this demo accelerometer data will be sent from
            your device to the cloud whilst this page is open. Please hold your device flat.</p>
          <p>This app will go fullscreen.</p>
          <button
            onClick={this.props.onBegin}>
            Got it, Lets Go!
          </button>
        </div>
      </div>
    );
  }
}
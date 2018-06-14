import React, { Component } from "react";
import AutoRotateIcon from "./ios_auto_rotate_on.png";
import "./Splash.css";

export default class Splash extends Component {
  render() {
    const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    return (
      <div className={"splash" + (this.props.visible ? " visible" : "")}>
        <header>
          <h1>Sensor Data Demo-matic 9000</h1>
        </header>
        <div className="intro">
          <p>To participate in this demo accelerometer data will be sent from
            your device to the cloud whilst this page is open. Please hold your device flat.</p>

          {iOS
            ? <div className="ios-auto-rotate-help">
                <div>
                  <p>It is recommended you disable auto screen rotation for this demo.</p>
                </div>
                <div>
                  <img src={AutoRotateIcon} alt="iOS auto rotate icon" height="75" />
                </div>
              </div>
            : <p>This app will go fullscreen.</p>}

          <button
            onClick={this.props.onBegin}>
            Got it, Lets Go!
          </button>
        </div>
      </div>
    );
  }
}
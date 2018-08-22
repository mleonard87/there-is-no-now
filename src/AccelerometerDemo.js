import React, { Component } from "react";
import { withGyroNorm } from "./GyroNorm";
import Crosshair from "./Crosshair";
import "./AccelerometerDemo.css";

class AccelerometerDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crosshairSize: 0,
    };
  }

  gyroDataBuffer = [];
  backoffMultiplier = Math.random() * (1.7 - 1) + 1;

  componentDidMount = () => {
    window.addEventListener("resize", this.handleResize);
    const delay = Math.round(Math.random() * this.props.dataFrequency);
    setTimeout(this.startGyroDataInterval, delay);
  };

  componentWillUnmount = () => {
    clearInterval(this.gyroDataInterval);
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.visible && !nextProps.visible) {
      clearInterval(this.gyroDataInterval);
    }

    if (this.props.dataFrequency !== nextProps.dataFrequency || this.props.clockSkew !== nextProps.clockSkew  || this.props.clockDelay !== nextProps.clockDelay) {
      clearInterval(this.gyroDataInterval);
      setTimeout(this.startGyroDataInterval, nextProps.clockDelay);
    }

    if (this.props.simulatedOutage && !nextProps.simulatedOutage && this.props.outageStrategy === "immediate") {
      this.sendBufferImmediate();
    }
  };

  sendBufferImmediate = () => {
    for (let i = 0; i < this.gyroDataBuffer.length; i++) {
      this.props.sendGyroData(this.gyroDataBuffer[i]);
    }
  };

  startGyroDataInterval = () => {
    this.gyroDataInterval = setInterval(this.sendGyroData, this.props.dataFrequency);
  };

  sendGyroData = () => {
    if (this.props.visible && this.props.gyro) {
      if (this.props.simulatedOutage) {
          this.bufferGyroData();
          if (this.props.outageStrategy === "exponential-backoff") {
            this.beginExponentialBackoff();
          }
      } else {
        this.props.sendGyroData(this.props.gyro);
      }
    }
  };

  beginExponentialBackoff = () => {
    if (!this.backoffTimeout) {
      this.backoffTimeout = setTimeout(() => this.exponentialBackoff(100), 100);
    }
  };

  exponentialBackoff = (delay) => {
    if (this.props.simulatedOutage) {
      const nextDelay = delay*this.backoffMultiplier;
      this.backoffTimeout = setTimeout(() => this.exponentialBackoff(nextDelay), nextDelay);
      this.setState({
        delay: nextDelay,
      });
    } else {
      // alert("sending exp. backoff");
      this.sendBufferImmediate();
      this.setState({
        delay: 0,
      });
    }
  };

  bufferGyroData = () => {
    this.gyroDataBuffer.push({
      do: {
        gamma: this.props.gyro.do.gamma,
        beta: this.props.gyro.do.beta,
      }
    });
  };

  registerVisualisation = (elem) => {
    this.visualisationElem = elem;
    this.setCrosshairSize(elem);
  };

  setCrosshairSize = (elem) => {
    let size = 0;
    if (elem) {
      size = Math.min(elem.offsetWidth, elem.offsetHeight);
    }
    this.setState({
      crosshairSize: size,
    });
  };

  handleResize = () => {
    if (this.visualisationElem) {
      this.setCrosshairSize(this.visualisationElem);
    }
  };

  render() {
    return (
      <div
        ref={this.props.registerContent}
        className={`accel-demo${this.props.visible ? " visible" : ""}${this.props.simulatedOutage ? " outage" : ""}`}
        >
        {this.props.visible
          ? <React.Fragment>
              <div className="header">
                <div className="back-to-splash">
                  <button onClick={this.props.onBackToSplash}>
                    ←
                  </button>
                </div>
                <div className="network">
                  <div className="sending">
                    {/*<span*/}
                      {/*className="pulse"*/}
                      {/*style={{*/}
                        {/*animation: this.props.simulatedOutage*/}
                          {/*? 'none'*/}
                          {/*: `pulseAnimation ${this.props.dataFrequency / 1000}s infinite ease-in-out`,*/}
                        {/*opacity:  this.props.simulatedOutage ? 0 : 1,*/}
                      {/*}}*/}
                      {/*>*/}
                      {/*<span className="big">(</span>*/}
                      {/*<span className="medium">(</span>*/}
                      {/*<span className="small">(</span>*/}
                    {/*</span>*/}
                    <span className="message">
                      {this.props.simulatedOutage
                        ? 'OFFLINE'
                        : 'ONLINE'}
                    </span>
                    {/*<span*/}
                      {/*className="pulse"*/}
                      {/*style={{*/}
                        {/*animation: this.props.simulatedOutage*/}
                          {/*? 'none'*/}
                          {/*: `pulseAnimation ${this.props.dataFrequency / 1000}s infinite ease-in-out`,*/}
                        {/*opacity:  this.props.simulatedOutage ? 0 : 1,*/}
                      {/*}}*/}
                      {/*>*/}
                      {/*<span className="small">)</span>*/}
                      {/*<span className="medium">)</span>*/}
                      {/*<span className="big">)</span>*/}
                    {/*</span>*/}
                  </div>
                  <div className="connection-status">{this.props.dataFrequency / 1000} {this.props.dataFrequency > 1000 ? 'Seconds' : 'Second'} Interval</div>
                  <div className="connection-status">{+(this.props.clockDelay / 1000).toFixed(2)} {this.props.clockDelay > 1000 ? 'Seconds' : 'Second'} Clock Drift</div>
                </div>
              </div>
              <div
                ref={this.registerVisualisation}
                className="visualisation"
                >
                {true
                  ? <Crosshair
                      gamma={this.props.gyro ? this.props.gyro.do.gamma : 0} // left-right
                      beta={this.props.gyro ? this.props.gyro.do.beta : 0} // front-back
                      size={this.state.crosshairSize}
                      />
                  : null}
              </div>
              <div className="group-container">
                {this.props.outageStrategy === "exponential-backoff" && this.state.delay
                  ? `${+(this.state.delay / 1000).toFixed(1)} seconds`
                  : null}

              </div>
            </React.Fragment>
          : null}
      </div>
    );
  }
}

// 6699CC

export default withGyroNorm(AccelerometerDemo);
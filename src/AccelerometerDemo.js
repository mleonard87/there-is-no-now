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

    if (this.props.dataFrequency !== nextProps.dataFrequency) {
      clearInterval(this.gyroDataInterval);
      const delay = Math.round(Math.random() * nextProps.dataFrequency);
      setTimeout(this.startGyroDataInterval, delay);
    }
  };

  startGyroDataInterval = () => {
    this.gyroDataInterval = setInterval(this.sendGyroData, this.props.dataFrequency);
  };

  sendGyroData = () => {
    if (this.props.visible && this.props.gyro) {
      this.props.sendGyroData(this.props.gyro);
    }
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
    console.log("resizing");
    if (this.visualisationElem) {
      this.setCrosshairSize(this.visualisationElem);
    }
  };

  render() {
    return (
      <div
        ref={this.props.registerContent}
        className={"accel-demo" + (this.props.visible ? " visible" : "")}
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
                    <span className="pulse">
                      <span className="big">(</span>
                      <span className="medium">(</span>
                      <span className="small">(</span>
                    </span>
                    <span className="message">SENDING</span>
                    <span className="pulse">
                      <span className="small">)</span>
                      <span className="medium">)</span>
                      <span className="big">)</span>
                    </span>
                  </div>
                  <div className="connection-status">{this.props.dataFrequency / 1000} secs</div>
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
                {/*{window.orientation}*/}
                Group #{this.props.groupId}
              </div>
            </React.Fragment>
          : null}
      </div>
    );
  }
}

// 6699CC

export default withGyroNorm(AccelerometerDemo);
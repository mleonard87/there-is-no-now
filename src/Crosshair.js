import React, { Component } from "react";
import "./Crosshair.css";

const MAX_VW = 45;

export default class Crosshair extends Component {
  computeTranslates = () => {
    let x, y;
    if (this.props.gamma < 0) {
      x = -((Math.abs(this.props.gamma) / 90) * MAX_VW);
    } else if (this.props.gamma > 90) {
      x = MAX_VW;
    } else if (this.props.gamma < -90) {
      x = -MAX_VW;
    } else {
      x = (Math.abs(this.props.gamma) / 90) * MAX_VW;
    }

    if (this.props.beta < 0) {
      y = -((Math.abs(this.props.beta) / 90) * MAX_VW);
    } else if (this.props.beta > 90) {
      y = MAX_VW;
    } else if (this.props.beta < -90) {
      y = -MAX_VW;
    } else {
      y = (Math.abs(this.props.beta) / 90) * MAX_VW;
    }

    return {x, y};
  };

  render() {
    const { x, y } = this.computeTranslates();
    return (
      <div
        className="crosshair"
        style={{
          width: `${this.props.size}px`,
          height: `${this.props.size}px`,
        }}>
        <div className="circle" />
        <div className="vertical" />
        <div className="horizontal" />
        <div
          className="ball"
          style={{
            transform: `translate(${x}vw, ${y}vw)`,
          }}
          />
      </div>
    );
  }
}
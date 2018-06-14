import React, { Component } from "react";
// import GyroNorm from 'gyronorm';
var GyroNorm = require('gyronorm/dist/gyronorm.complete.js');

export function withGyroNorm(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        data: null,
      };
    }

    componentDidMount = () => {
      const gn = new GyroNorm();
      const thisComponent = this;
      gn.init().then(function() {
        gn.start(function(data) {
          console.log(data);
          thisComponent.setState({data: data});
        })
      })
    };

    render() {
      return <WrappedComponent gyro={this.state.data} {...this.props} />;
    }
  };
}
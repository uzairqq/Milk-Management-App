import React, { Component } from "react";

class CustomerSupplied extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: []
    };
  }
  render() {
    return (
      <div>
        <h1>hello world from customer supplier</h1>
      </div>
    );
  }
}

export default CustomerSupplied;

import React, { Component } from "react";
import "./App.css";

class App extends Component {
  customerAddButton = () => {
    console.log("button clicked");
  };
  customerUpdateButton = () => {
    console.log("Update Button Clicked");
  };
  customerDeleteButton = () => {
    console.log("Delete Button Clicked");
  };
  render() {
    return (
      <div>
        <h1>Customer Form</h1>
        <label>Customer Name:</label>
        <input
          required
          placeholder="Enter Customer Name"
          type="text"
          name="customerName"
        />
        <br />
        <label>Customer Address:</label>
        <input
          type="text"
          placeholder="Enter Customer Address"
          name="customerAddress"
        />
        <br />
        <label>Customer Contact:</label>
        <input
          type="text"
          placeholder="Enter Customer Contact"
          name="customerContact"
        />
        <br />
        <button type="submit" onClick={this.customerAddButton}>
          Add
        </button>
        <br />
        <button type="submit" onClick={this.customerUpdateButton}>
          Update
        </button>
        <br />
        <button type="submit" onClick={this.customerDeleteButton}>
          Delete
        </button>
      </div>
    );
  }
}

export default App;

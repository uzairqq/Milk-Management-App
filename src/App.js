import React, { Component } from "react";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div>
        <h1>Customer Form</h1>
        <label>Customer Name:</label>
        <input type="text" name="customerName" />
        <br />
        <label>Customer Address:</label>
        <input type="text" name="customerAddress" />
        <br />
        <label>Customer Contact:</label>
        <input type="text" name="customerContact" />
        <br />
        <button type="submit">Add</button>
        <br />
        <button type="submit">Update</button>
        <br />
        <button type="submit">Delete</button>
      </div>
    );
  }
}

export default App;

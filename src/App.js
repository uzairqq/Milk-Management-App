import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { Table } from "reactstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerTypeId: 0,
      customerType: "",
      customerName: "",
      customerAddress: "",
      customerContact: "",
      customers: []
    };
  }
  componentDidMount() {
    axios.get(`http://localhost:56996/api/Customer/all`).then(res => {
      const customers = res.data;
      this.setState({ customers });
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    console.log("Customer Type Id:" + this.state.customerTypeId);
    console.log("Customer Name: " + this.state.customerName);
    console.log("Customer Address: " + this.state.customerAddress);
    console.log("Customer Contact: " + this.state.customerContact);
    const customer = {
      customerTypeId: this.state.customerTypeId,
      name: this.state.customerName,
      address: this.state.customerAddress,
      contact: this.state.customerContact
    };
    axios
      .post(`http://localhost:56996/api/Customer`, { ...customer })
      .then(res => {
        console.log(res);
        console.log(res.data);
      });
  };
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    console.log(e.target.value);
  }
  render() {
    return (
      <div>
        <h1>Customer Form</h1>
        <form action="post">
          <label>Customer Type</label>
          <select
            name="customerTypeId"
            value={this.state.value}
            onChange={e => this.handleChange(e)}
          >
            <option value="1">Daily</option>
            <option value="2">Weekly</option>
          </select>
          <br />
          <label>Customer Name:</label>
          <input
            required
            placeholder="Enter Customer Name"
            type="text"
            name="customerName"
            value={this.state.value}
            onChange={e => this.handleChange(e)}
          />
          <br />
          <label>Customer Address:</label>
          <input
            type="text"
            placeholder="Enter Customer Address"
            name="customerAddress"
            value={this.state.value}
            onChange={e => this.handleChange(e)}
          />
          <br />
          <label>Customer Contact:</label>
          <input
            type="text"
            placeholder="Enter Customer Contact"
            name="customerContact"
            value={this.state.value}
            onChange={e => this.handleChange(e)}
          />
          <br />
          <button type="submit" onClick={this.handleSubmit}>
            Add
          </button>
          <br />
          <button type="submit">Update</button>
          <br />
          <button type="submit">Delete</button>
        </form>
        <div>
          <Table striped>
            <thead>
              <tr>
                <th>Id</th>
                <th>Customer Type</th>
                <th>Customer Name</th>
                <th>Customer Contact</th>
                <th>Customer Address</th>
              </tr>
            </thead>
            <tbody>
              <tr scope="row">1</tr>
              {this.state.customers.map(cust => (
                <tr>
                  <td>{cust.id}</td>
                  <td>{cust.type}</td>
                  <td>{cust.name}</td>
                  <td>{cust.address}</td>
                  <td>{cust.contact}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default App;

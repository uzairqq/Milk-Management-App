import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { Table } from "reactstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      customerTypeId: 0,
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
  handleRowsValuesInTextBox(e) {
    this.setState({
      id: e.id,
      customerTypeId: e.customerTypeId,
      customerName: e.name,
      customerAddress: e.address,
      customerContact: e.contact
    });
    console.log("Populate button clicked");
    console.log(e);
  }
  handleUpdate = e => {
    console.log("update clicked");
    console.log(e);
    e.preventDefault();
    console.log("Customer Type Id:" + this.state.customerTypeId);
    console.log("Customer Name: " + this.state.customerName);
    console.log("Customer Address: " + this.state.customerAddress);
    console.log("Customer Contact: " + this.state.customerContact);
    const customer = {
      id: this.state.id,
      customerTypeId: this.state.customerTypeId,
      name: this.state.customerName,
      address: this.state.customerAddress,
      contact: this.state.customerContact
    };
    axios
      .put(`http://localhost:56996/api/Customer`, { ...customer })
      .then(res => {
        console.log(res);
        console.log(res.data);
      });
  };
  handleDelete = cust => {
    axios
      .delete(`http://localhost:56996/api/Customer`, { data: cust })
      .then(res => {
        console.log(res);
        console.log(res.data);
      });
    console.log("Delete Clicked");
    console.log(cust);
  };

  render() {
    return (
      <div>
        <h1>Customer Form</h1>
        <form action="post">
          <input type="hidden" name="id" value={this.state.id} />
          <label>Customer Type</label>
          <select
            name="customerTypeId"
            value={this.state.customerTypeId}
            onChange={e => this.handleChange(e)}
            required
          >
            <option value="0">--Select--</option>
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
            value={this.state.customerName}
            onChange={e => this.handleChange(e)}
          />
          <br />
          <label>Customer Address:</label>
          <input
            required
            type="text"
            placeholder="Enter Customer Address"
            name="customerAddress"
            value={this.state.customerAddress}
            onChange={e => this.handleChange(e)}
          />
          <br />
          <label>Customer Contact:</label>
          <input
            required
            type="text"
            placeholder="Enter Customer Contact"
            name="customerContact"
            value={this.state.customerContact}
            onChange={e => this.handleChange(e)}
          />
          <br />
          <button type="submit" onClick={this.handleSubmit}>
            Add
          </button>
          <br />
          <button type="submit" onClick={this.handleUpdate}>
            Update
          </button>
          <br />
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.customers.map(cust => (
                <tr key={cust.id}>
                  <td>{cust.id}</td>
                  <td>{cust.type}</td>
                  <td>{cust.name}</td>
                  <td>{cust.address}</td>
                  <td>{cust.contact}</td>
                  <td>
                    <input
                      type="button"
                      value="Update"
                      onClick={() => this.handleRowsValuesInTextBox(cust)}
                    />
                    <input
                      type="button"
                      value="Delete"
                      onClick={() => this.handleDelete(cust)}
                    />
                  </td>
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

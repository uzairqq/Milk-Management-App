import React, { Component } from "react";
import axios from "axios";
import {
  Container,
  Form,
  FormGroup,
  Table,
  Input,
  Label,
  Button,
  FormFeedback,
  Col
} from "reactstrap";
import { showFormErrors, showInputError } from "../utils/Validation";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      id: 0,
      customerTypeId: 0,
      customerName: "",
      customerAddress: "",
      customerContact: "",
      customers: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios.get(`http://localhost:56996/api/Customer/all`).then(res => {
      const customers = res.data;
      this.setState({ customers });
    });
  }

  handleIsEnabled() {
    const isEnabled =
      this.state.customerTypeId === 0 &&
      this.state.customerName.length === 0 &&
      this.state.customerAddress.length === 0 &&
      this.state.customerContact.length === 0;
    return isEnabled;
  }

  handleSubmit = e => {
    e.preventDefault();
    showFormErrors("#root > div > form > div > div > input,select");

    // console.log("Component state:", JSON.stringify(this.state));
    const customer = {
      customerTypeId: this.state.customerTypeId,
      name: this.state.customerName,
      address: this.state.customerAddress,
      contact: this.state.customerContact
    };

    if (!this.handleIsEnabled())
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
    showInputError(e.target);
  }
  handleRowsValuesInTextBox(e) {
    this.setState({
      id: e.id,
      customerTypeId: e.customerTypeId,
      customerName: e.name,
      customerAddress: e.address,
      customerContact: e.contact
    });
  }

  handleUpdate = e => {
    e.preventDefault();
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
  };

  render() {
    return (
      <Container>
        <h1>Customer Form</h1>
        <Form action="post" onSubmit={this.handleSubmit} noValidate={true}>
          <FormGroup row={true}>
            <Input type="hidden" name="id" value={this.state.id} />
            <Label for="customerTypeId" sm={2}>
              Customer Type
            </Label>
            <Col sm={10}>
              <Input
                name="customerTypeId"
                id="customerTypeId"
                value={this.state.customerTypeId}
                onChange={this.handleChange}
                required
                type="select"
              >
                <option value="-1">--Select--</option>
                <option value="1">Daily</option>
                <option value="2">Weekly</option>
              </Input>
              <FormFeedback className="invalid" id="customerTypeIdError" />
            </Col>
          </FormGroup>
          <FormGroup row={true}>
            <Label for="customerName" sm={2}>
              Customer Name
            </Label>
            <Col sm={10}>
              <Input
                required
                placeholder="Enter Customer Name"
                type="text"
                name="customerName"
                id="customerName"
                value={this.state.customerName}
                onChange={this.handleChange}
              />
              <FormFeedback className="invalid" id="customerNameError" />
            </Col>
          </FormGroup>
          <FormGroup row={true}>
            <Label for="customerAddress" sm={2}>
              Customer Address
            </Label>
            <Col sm={10}>
              <Input
                required
                type="text"
                placeholder="Enter Customer Address"
                name="customerAddress"
                id="customerAddress"
                value={this.state.customerAddress}
                onChange={this.handleChange}
              />
              <FormFeedback className="invalid" id="customerAddressError" />
            </Col>
          </FormGroup>
          <FormGroup row={true}>
            <Label for="customerContact" sm={2}>
              Customer Contact
            </Label>
            <Col sm={10}>
              <Input
                required
                type="text"
                placeholder="Enter Customer Contact"
                name="customerContact"
                id="customerContact"
                value={this.state.customerContact}
                onChange={this.handleChange}
              />
              <FormFeedback className="invalid" id="customerContactError" />
            </Col>
          </FormGroup>
          <FormGroup row={true}>
            <Button type="submit" className="mr-3">
              Add
            </Button>
            <Button type="submit" onClick={this.handleUpdate}>
              Update
            </Button>
          </FormGroup>
        </Form>
        <Table striped={true} responsive={true}>
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
                <th scope="row">{cust.id}</th>
                <td>{cust.type}</td>
                <td>{cust.name}</td>
                <td>{cust.address}</td>
                <td>{cust.contact}</td>
                <td>
                  <Input
                    type="button"
                    value="Update"
                    onClick={() => this.handleRowsValuesInTextBox(cust)}
                  />
                  <Input
                    type="button"
                    value="Delete"
                    onClick={() => this.handleDelete(cust)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <br />
        {/* <Grid /> */}
      </Container>
    );
  }
}

export default App;

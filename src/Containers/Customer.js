import React, { Component } from "react";
import axios from "axios";
import {
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  FormFeedback,
  Col
} from "reactstrap";
import Grid from "../Components/Grid";
import Swal from "sweetalert2";
import { showFormErrors, showInputError } from "../utils/Validation";

class Customer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      customerTypeId: -1,
      customerName: "",
      customerAddress: "",
      customerContact: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDataForUpdate = this.handleDataForUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }
  handleDataForUpdate(val) {
    this.setState({
      id: val.id,
      customerTypeId: val.customerTypeId,
      customerType: val.type,
      customerName: val.name,
      customerAddress: val.address,
      customerContact: val.contact
    });
  }
  loadData() {
    fetch("http://localhost:56996/api/Customer/all")
      .then(result => result.json())
      .then(customers => {
        customers.forEach(i => {
          i.handleDataForUpdate = this.handleDataForUpdate;
          i.handleDelete = this.handleDelete;
        });
        this.setState({ customers });
      });
  }
  handleDelete = val => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        axios
          .delete(`http://localhost:56996/api/Customer`, { data: val })
          .then(res => {
            console.log(res);
            console.log(res.data);
            this.loadData();
            Swal.fire("Deleted!", "Your Record Has Been Deleted.", "success");
          });
      }
    });
  };

  handleIsEnabled() {
    const haveValues =
      this.state.customerTypeId !== 0 &&
      this.state.customerName !== "" &&
      this.state.customerAddress !== "" &&
      this.state.customerContact !== "";
    return haveValues;
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

    if (this.handleIsEnabled() === true)
      axios
        .post(`http://localhost:56996/api/Customer`, { ...customer })
        .then(res => {
          this.loadData();
          this.initialState();
          console.log(res);
          console.log(res.data);

          if (res.data.success) {
            Swal.fire({
              position: "top-end",
              type: "success",
              title: res.data.successMessage,
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire({
              position: "top-end",
              type: "error",
              title: res.data.failureMessage,
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
  };
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
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
  initialState() {
    this.setState({
      id: 0,
      customerTypeId: -1,
      customerName: "",
      customerContact: "",
      customerAddress: ""
    });
  }
  handleUpdate() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then(result => {
      if (result.value) {
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
            this.loadData();
            this.initialState();
            if (res.data.success) {
              Swal.fire({
                position: "top-end",
                type: "success",
                title: res.data.successMessage,
                showConfirmButton: false,
                timer: 2000
              });
            } else {
              Swal.fire({
                position: "top-end",
                type: "error",
                title: res.data.failureMessage,
                showConfirmButton: false,
                timer: 2000
              });
            }
          });
      }
    });
  }
  handleDelete = cust => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        axios
          .delete(`http://localhost:56996/api/Customer`, { data: cust })
          .then(res => {
            console.log(res);
            console.log(res.data);
            this.loadData();
            if (res.data.success) {
              Swal.fire({
                position: "top-end",
                type: "success",
                title: res.data.successMessage,
                showConfirmButton: false,
                timer: 2000
              });
            } else {
              Swal.fire({
                position: "top-end",
                type: "error",
                title: res.data.failureMessage,
                showConfirmButton: false,
                timer: 2000
              });
            }
          });
      }
    });
  };

  render() {
    return (
      <Container>
        <h1>Customer Form</h1>
        <Form action="post" noValidate={true}>
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
            <Button
              disabled={this.state.id ? true : false}
              className="mr-3"
              onClick={this.handleSubmit}
            >
              Add
            </Button>
            <Button disabled={!this.state.id} onClick={this.handleUpdate}>
              Update
            </Button>
          </FormGroup>
        </Form>
        {/* <Table striped={true} responsive={true}>
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
        </Table> */}
        <br />
        <Grid
          rowData={this.state.customers}
          columnDef={[
            // {
            //   headerName: "Id",
            //   field: "id",
            //   checkboxSelection: true,
            //   editable: true
            // },
            {
              headerName: "Customer Type",
              field: "type",
              checkboxSelection: true,
              editable: true
            },
            {
              headerName: "Customer Name",
              field: "name",
              checkboxSelection: true,
              editable: true
            },
            {
              headerName: "Customer Address",
              field: "address",
              checkboxSelection: true,
              editable: true
            },
            {
              headerName: "Customer Contact",
              field: "contact",
              checkboxSelection: true,
              editable: true
            },
            {
              headerName: "Actions",
              field: "value",
              cellRenderer: "childMessageRenderer",
              colId: "params",
              width: 180,
              editable: false
            }
          ]}
        />
      </Container>
    );
  }
}

export default Customer;

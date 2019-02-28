import React, { Component } from "react";
import {
  Container,
  Input,
  Label,
  Card,
  Form,
  CardBody,
  FormGroup,
  Col,
  FormFeedback
} from "reactstrap";
import axios from "axios";
import InputComponent from "../Components/InputFeilds";
import Swal from "sweetalert2";
import { showFormErrors, showInputError } from "../utils/Validation";
import ButtonComponent from "../Components/Button";
import Grid from "../Components/Grid";
import InputFeilds from "../Components/InputFeilds";

class CustomerRates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customersDropDown: [],
      customerId: 0,
      currentRate: "",
      previousRate: "",
      gridVisible: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideOrShowGrid = this.hideOrShowGrid.bind(this);
    this.handleDataForUpdate = this.handleDataForUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
  }
  initialState() {
    this.setState({
      id: 0,
      customerId: 0,
      currentRate: "",
      previousRate: ""
    });
  }
  hideOrShowGrid(e) {
    e.preventDefault();
    this.setState({ gridVisible: !this.state.gridVisible });
  }
  handleIsEnabled() {
    if (
      this.state.customerId === 0 &&
      this.state.currentRate === "" &&
      this.state.previousRate === ""
    ) {
      return false;
    } else {
      return true;
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    showFormErrors("input,select");

    const customer = {
      CustomerId: this.state.customerId,
      CurrentRate: this.state.currentRate,
      PreviousRate: this.state.previousRate
    };
    if (this.handleIsEnabled())
      axios
        .post(`http://localhost:56996/api/CustomerRates`, { ...customer })
        .then(res => {
          this.loadData();
          this.initialState();

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

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
    showInputError(e.target);
  };
  handleDataForUpdate(val) {
    this.setState({
      id: val.id,
      customerId: val.customerId,
      currentRate: val.currentRate,
      previousRate: val.previousRate
    });
  }
  handleDelete = customer => {
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
          .delete(`http://localhost:56996/api/CustomerRates/`, {
            data: customer
          })
          .then(res => {
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

  handleUpdate(e) {
    e.preventDefault();
    // showFormErrors("#root > div > form > div > div > input,select");
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
          CustomerId: this.state.customerId,
          CurrentRate: this.state.currentRate,
          PreviousRate: this.state.previousRate
        };
        axios
          .put(`http://localhost:56996/api/CustomerRates/`, { ...customer })
          .then(res => {
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
  loadData() {
    fetch("http://localhost:56996/api/CustomerRates/all")
      .then(result => result.json())
      .then(customers => {
        customers.forEach(i => {
          i.handleDataForUpdate = this.handleDataForUpdate;
          i.handleDelete = this.handleDelete;
        });
        this.setState({ customers });
        console.log(customers);
      });
  }
  handleClearForm(e) {
    e.preventDefault();
    this.initialState();
  }

  componentDidMount() {
    this.loadDataDropDown();
    this.loadData();
  }

  loadDataDropDown() {
    axios
      .get(
        "http://localhost:56996/api/CustomerRates/customersForCustomerRatesDropdown"
      )
      .then(res => {
        this.setState({ customersDropDown: res.data });
        console.log("Load Parent", res.data);
      });
  }

  updateValue(value) {}
  render() {
    return (
      <Container>
        <h1>Customer Rates</h1>

        <Card body outline color="warning">
          <CardBody sm={5}>
            <Form method="post" noValidate={true}>
              <FormGroup row>
                <Col sm={{ size: 6, order: 5, offset: 0 }}>
                  <Label for={"customerId"}>{"Select Customer"}</Label>
                  <Input
                    type="select"
                    value={this.state.customerId}
                    name="customerId"
                    id="customerId"
                    onChange={this.handleChange}
                    required={true}
                  >
                    <option value="-1">Select Customer</option>
                    {this.state.customersDropDown.map(function(data, key) {
                      return (
                        <option key={key} value={data.customerId}>
                          {data.customerName}
                        </option>
                      );
                    })}
                  </Input>
                  <FormFeedback className="invalid" id="customerIdError" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={{ size: 6, order: 5, offset: 0 }}>
                  <InputFeilds
                    required={true}
                    name={"currentRate"}
                    title={"Current Rate"}
                    placeholder={"Enter Current Rate"}
                    value={this.state.currentRate}
                    handlechange={this.handleChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Col sm={{ size: 6, order: 5, offset: 0 }}>
                  <InputComponent
                    required={true}
                    title={"Previous Rate"}
                    name={"previousRate"}
                    type={"text"}
                    placeholder={"Enter Previous Rate"}
                    value={this.state.previousRate}
                    handlechange={this.handleChange}
                  />
                </Col>
              </FormGroup>
              <ButtonComponent
                action={this.handleSubmit}
                title={"Save"}
                class={"btn btn-success"}
                disable={this.state.id ? true : false}
                size={"lg"}
              />{" "}
              <ButtonComponent
                action={this.handleUpdate}
                title={"Update"}
                class={"btn btn-info"}
                disable={!this.state.id}
                size={"lg"}
              />{" "}
              <ButtonComponent
                action={this.handleClearForm}
                title={"Clear All"}
                class={"btn btn-danger"}
                size={"lg"}
              />{" "}
              <ButtonComponent
                action={this.hideOrShowGrid}
                title={!this.state.gridVisible ? "Show Grid" : "Hide Grid"}
                class={"btn btn-danger"}
                size={"lg"}
              />{" "}
            </Form>
          </CardBody>
        </Card>
        {this.state.gridVisible ? (
          <Grid
            rowData={this.state.customers}
            columnDef={[
              {
                headerName: "Id",
                field: "id",
                checkboxSelection: true,
                editable: true,
                width: 200
              },
              {
                headerName: "Customer Id",
                field: "customerId",
                checkboxSelection: true,
                editable: true,
                width: 200
              },
              {
                headerName: "Customer Type",
                field: "type",
                checkboxSelection: true,
                editable: true,
                width: 200
              },
              {
                headerName: "Customer Name",
                field: "customerName",
                checkboxSelection: true,
                editable: true,
                width: 200
              },
              {
                headerName: "Current Rate",
                field: "currentRate",
                checkboxSelection: true,
                editable: true,
                width: 200
              },
              {
                headerName: "Previous Rate",
                field: "previousRate",
                checkboxSelection: true,
                editable: true,
                width: 200
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
        ) : null}
      </Container>
    );
  }
}

export default CustomerRates;

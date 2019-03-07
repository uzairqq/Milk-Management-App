import React, { Component } from "react";
import axios from "axios";
import {
  Container,
  FormGroup,
  Col,
  Label,
  FormFeedback,
  Input,
  Card,
  CardBody,
  Form
} from "reactstrap";
import InputFeilds from "../Components/InputFeilds";
import ButtonComponent from "../Components/Button";
import Swal from "sweetalert2";
import Grid from "../Components/Grid";

class CustomerSupplied extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerSuppliedid: 0,
      customerId: -1,
      customersDropDown: [],
      customers: [],
      morningMilk: "",
      afternoonMilk: "",
      debitAmount: 0,
      customerType: -1,
      morningUnit: "Mund",
      afternoonUnit: "Kg",
      selectedDate: new Date().toDateString()
    };
    this.loadDataDropDown = this.loadDataDropDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCustomerTypeChange = this.handleCustomerTypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleDataForUpdate = this.handleDataForUpdate.bind(this);
    this.handleSelectedDate = this.handleSelectedDate.bind(this);
  }
  componentDidMount() {
    this.loadData(this.state.selectedDate);
    this.loadDataDropDown(-1);
  }
  handleUpdate(e) {
    e.preventDefault();
    // showFormErrors("input,select");
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
            this.loadData(this.state.customerType);
            this.loadDataDropDown(this.state.customerType);
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

  handleChange = e => {
    this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => {
        console.log("Updated State", this.state);
      }
    );
    console.log("Un Updated State", this.state);
    // showInputError(e.target);
  };
  handleCustomerTypeChange(e) {
    this.setState(
      {
        customerType: e.target.value
      },
      () => {
        // this.loadData(this.state.customerType);
        this.loadDataDropDown(this.state.customerType);
      }
    );
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
            this.loadData(this.state.customerType);
            this.loadDataDropDown(this.state.customerType);
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
  };

  handleDataForUpdate(val) {
    console.log("values", val);

    this.setState(
      {
        // selectedDate: val.createdOn.toString().substring(0, 10),
        customerSuppliedid: val.id,
        customerType: val.customerTypeId,
        customerId: val.customerId,
        morningMilk: val.morningSupply.match(/\d+/g).map(Number)[0],
        morningUnit: val.morningSupply.split(/(\d+)/)[2].trim(),
        afternoonMilk: val.afternoonSupply.match(/\d+/g).map(Number)[0],
        afternoonUnit: val.afternoonSupply.split(/(\d+)/)[2].trim(),
        debitAmount: val.debit
      },
      () => {
        console.log("Update After", this.state);
      }
    );
  }

  loadData() {
    if (this.state.selectedDate.length !== 0) {
      fetch(
        "http://localhost:56996/api/CustomerSupplied/all/selectedDate/" +
          this.state.selectedDate
      )
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
  }
  loadDataDropDown(typeId) {
    if (typeId !== -1) {
      axios
        .get(
          "http://localhost:56996/api/CustomerSupplied/customerSuppliedDropDown/typeId/" +
            typeId +
            "/date/" +
            this.state.selectedDate
        )
        .then(res => {
          this.setState({ customersDropDown: res.data });
          console.log("Load Parent", res.data);
        });
    }
  }
  handleIsEnabled() {
    const haveValues =
      this.state.customerType !== -1 &&
      this.state.customerId !== 0 &&
      this.state.morningMilk !== "" &&
      this.state.morningUnit !== "" &&
      this.state.afternoonMilk !== "" &&
      this.state.afternoonUnit !== "" &&
      this.state.debitAmount !== "";
    return haveValues;
  }
  handleSelectedDate(e) {
    this.setState(
      {
        selectedDate: e.target.value
      },
      () => {
        this.loadData();
      }
    );
  }
  handleSubmit = e => {
    e.preventDefault();
    // showFormErrors("input,select,radio");
    const customerSupplied = {
      CreatedOn: this.state.selectedDate,
      CustomerTypeId: this.state.customerType,
      CustomerId: this.state.customerId,
      MorningSupply: this.state.morningMilk + " " + this.state.morningUnit,
      AfternoonSupply:
        this.state.afternoonMilk + " " + this.state.afternoonUnit,
      Debit: this.state.debitAmount
    };
    if (this.handleIsEnabled())
      axios
        .post(`http://localhost:56996/api/CustomerSupplied`, {
          ...customerSupplied
        })
        .then(res => {
          // this.loadData(this.state.customerType);
          this.loadDataDropDown(this.state.customerType);
          // this.initialState();

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

  render() {
    return (
      <Container>
        <h1>CustomerSupplied</h1>
        <Card body outline color="warning">
          <CardBody sm={5}>
            <Form method="post" noValidate={true} />
            <FormGroup row>
              <Col sm={{ size: 4, order: 1, offset: 4 }}>
                <Label for="selectedDate">Select Date:</Label>
                <Input
                  type="date"
                  name="selectedDate"
                  id="selectedDate"
                  placeholder="Select Date"
                  onChange={this.handleSelectedDate}
                  value={this.state.selectedDate}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={{ size: 6, order: 5, offset: 0 }}>
                <Label for={"customerType"}>{"Customer Type"}</Label>
                <Input
                  onChange={this.handleCustomerTypeChange}
                  type="select"
                  value={this.state.customerType}
                  name="customerType"
                  id="customerType"
                  // required={true}
                >
                  <option value="-1">Select Customer Type</option>
                  <option value="0">All</option>
                  <option value="1">Daily</option>
                  <option value="2">Weekly</option>
                </Input>
                <FormFeedback className="invalid" id="customerTypeError" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={{ size: 6, order: 5, offset: 0 }}>
                <Label for={"customerId"}>{"Select Customer"}</Label>
                <Input
                  autoFocus
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
              <Col md={6}>
                <InputFeilds
                  type={"number"}
                  required={true}
                  name={"morningMilk"}
                  title={"Morning Milk"}
                  placeholder={"Enter Morning Milk"}
                  value={this.state.morningMilk}
                  handlechange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup tag="fieldset">
              <FormGroup check inline>
                <Label check>
                  <Input
                    type="radio"
                    name="morningUnit"
                    checked={this.state.morningUnit === "Kg"}
                    value="Kg"
                    onChange={this.handleChange}
                  />{" "}
                  Kg
                </Label>
              </FormGroup>
              <FormGroup check inline>
                <Label check>
                  <Input
                    type="radio"
                    name="morningUnit"
                    value="Mund"
                    checked={this.state.morningUnit === "Mund"}
                    onChange={this.handleChange}
                  />{" "}
                  Mund
                </Label>
              </FormGroup>
            </FormGroup>
            <FormGroup row>
              <Col sm={{ size: 6, order: 5, offset: 0 }}>
                <InputFeilds
                  type={"number"}
                  required={true}
                  name={"afternoonMilk"}
                  title={"Afternoon Milk"}
                  placeholder={"Enter Afternoon Milk"}
                  value={this.state.afternoonMilk}
                  handlechange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup tag="fieldset">
              <FormGroup check inline>
                <Label check>
                  <Input
                    type="radio"
                    name="afternoonUnit"
                    value="Kg"
                    checked={this.state.afternoonUnit === "Kg"}
                    onChange={this.handleChange}
                  />{" "}
                  Kg
                </Label>
              </FormGroup>
              <FormGroup check inline>
                <Label check>
                  <Input
                    type="radio"
                    name="afternoonUnit"
                    value="Mund"
                    checked={true}
                    checked={this.state.afternoonUnit === "Mund"}
                    onChange={this.handleChange}
                  />{" "}
                  Mund
                </Label>
              </FormGroup>
            </FormGroup>
            <FormGroup row>
              <Col sm={{ size: 6, order: 5, offset: 0 }}>
                <InputFeilds
                  type={"number"}
                  required={true}
                  name={"debitAmount"}
                  title={"Debit Amount"}
                  placeholder={"Enter Debit Amount"}
                  value={this.state.debitAmount}
                  handlechange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <ButtonComponent
              action={this.handleSubmit}
              title={"Save"}
              class={"btn btn-success"}
              disable={this.state.customerSuppliedid ? true : false}
              size={"lg"}
            />{" "}
            <ButtonComponent
              //action={this.handleUpdate}
              title={"Update"}
              class={"btn btn-info"}
              disable={!this.state.customerSuppliedid}
              size={"lg"}
            />{" "}
            <ButtonComponent
              // action={this.handleClearForm}
              title={"Clear All"}
              class={"btn btn-danger"}
              size={"lg"}
            />{" "}
            <ButtonComponent
              // action={this.hideOrShowGrid}
              title={!this.state.gridVisible ? "Show Grid" : "Hide Grid"}
              class={"btn btn-danger"}
              size={"lg"}
            />{" "}
          </CardBody>
        </Card>
        {/* {this.state.gridVisible ? ( */}
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
              field: "customerType",
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
              headerName: "Morning Milk",
              field: "morningSupply",
              checkboxSelection: true,
              editable: true,
              width: 200
            },
            {
              headerName: "Morning Amount",
              field: "morningAmount",
              checkboxSelection: true,
              editable: true,
              width: 200
            },
            {
              headerName: "Afternoon Milk",
              field: "afternoonSupply",
              checkboxSelection: true,
              editable: true,
              width: 200
            },
            {
              headerName: "Afternoon Amount",
              field: "afternoonAmount",
              checkboxSelection: true,
              editable: true,
              width: 200
            },
            {
              headerName: "Rate",
              field: "rate",
              checkboxSelection: true,
              editable: true,
              width: 200
            },
            {
              headerName: "Debit",
              field: "debit",
              checkboxSelection: true,
              editable: true,
              width: 200
            },
            {
              headerName: "Credit",
              field: "credit",
              checkboxSelection: true,
              editable: true,
              width: 200
            },
            {
              headerName: "Total",
              field: "total",
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
        {/* ) : null} */}
      </Container>
    );
  }
}
export default CustomerSupplied;

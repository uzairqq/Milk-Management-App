import React, { Component } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Col,
  CustomInput,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input,
  Row
} from "reactstrap";
import "../Customer/Customer.css";
import Grid from "../Components/Grid";
import Api from "../../utils/BaseUrl";
import Swal from "sweetalert2";
import {
  showFormErrors,
  showInputError,
  clearInputsColours
} from "../../utils/Validation";

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
    showFormErrors("input,select,radio");
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
        Api.put(`/CustomerRates/`, {
          ...customer
        }).then(res => {
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
        Api.delete(`/CustomerRates/`, {
          data: customer
        }).then(res => {
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
      Api.get("/CustomerSupplied/all/selectedDate/" + this.state.selectedDate)
        .then(res => {
          const person = res.data;
          person.forEach(i => {
            i.handleDataForUpdate = this.handleDataForUpdate;
            i.handleDelete = this.handleDelete;
          });
          this.setState({ customers: person });
          console.log(person);
        })
        .catch(error => console.log(error));
    }
  }
  loadDataDropDown(typeId) {
    if (typeId !== -1) {
      Api.get(
        "/CustomerSupplied/customerSuppliedDropDown/typeId/" +
          typeId +
          "/date/" +
          this.state.selectedDate
      ).then(res => {
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
    showFormErrors("input,select,radio");
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
      Api.post(`/CustomerSupplied`, {
        ...customerSupplied
      }).then(res => {
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
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="icon-note" />
            <strong>Daily Customer Supply</strong>
            <div className="card-header-actions" />
          </CardHeader>
          <CardBody>
            <hr />
            <Row>
              <Col lg="6">
                <Form
                  // onSubmit={this.handleSubmit}
                  noValidate
                >
                  <FormGroup>
                    <Label for="selectedDate">Select Date:</Label>
                    <Input
                      type="date"
                      name="selectedDate"
                      id="selectedDate"
                      placeholder="Select Date"
                      onChange={this.handleSelectedDate}
                      value={this.state.selectedDate}
                      autoComplete="given-name"
                      // valid={this.state.customerTypeId > 0}
                      // invalid={this.state.customerTypeId == -1}
                      required
                      // onBlur={handleBlur}
                    />
                    {/* <FormFeedback
                      className="invalid"
                      id="customerTypeIdError"
                    /> */}
                  </FormGroup>

                  <FormGroup>
                    <Label for="customerType">Customer Type</Label>
                    <Input
                      onChange={this.handleCustomerTypeChange}
                      type="select"
                      value={this.state.customerType}
                      name="customerType"
                      id="customerType"
                      // required={true}
                      placeholder="Customer Name"
                      autoComplete="given-name"
                      // valid={!errors.customerName}
                      // invalid={touched.customerName && !!errors.customerName}
                      // autoFocus={true}
                      required
                      // onBlur={handleBlur}
                    >
                      <option value="-1">Select Customer Type</option>
                      <option value="0">All</option>
                      <option value="1">Daily</option>
                      <option value="2">Weekly</option>
                    </Input>
                    <FormFeedback className="invalid" id="customerTypeError" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="customerId">Select Customer</Label>
                    <Input
                      autoFocus
                      type="select"
                      value={this.state.customerId}
                      name="customerId"
                      id="customerId"
                      onChange={this.handleChange}
                      required={true}
                      autoComplete="family-name"
                      // valid={!errors.customerAddress}
                      // invalid={
                      //   touched.customerAddress && !!errors.customerAddress
                      // }
                      required
                      // onBlur={handleBlur}
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
                  </FormGroup>
                  <FormGroup>
                    <Label for="morningMilk">Morning Milk</Label>
                    <Input
                      type={"number"}
                      required={true}
                      id="morningMilk"
                      name={"morningMilk"}
                      title={"Morning Milk"}
                      placeholder={"Enter Morning Milk"}
                      value={this.state.morningMilk}
                      onChange={this.handleChange}
                      // autoComplete="username"
                      // valid={!errors.customerContact}
                      // invalid={
                      //   touched.customerContact && !!errors.customerContact
                      // }
                      // onBlur={handleBlur}
                    />
                    <FormFeedback className="invalid" id="morningMilkError" />
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
                  {/* Morning Milk Unit */}
                  <FormGroup>
                    <Label for="afternoonMilk">Afternoon Milk</Label>
                    <Input
                      type={"number"}
                      required={true}
                      name={"afternoonMilk"}
                      id="afternoonMilk"
                      title={"Afternoon Milk"}
                      placeholder={"Enter Afternoon Milk"}
                      value={this.state.afternoonMilk}
                      onChange={this.handleChange}
                      // autoComplete="username"
                      // valid={!errors.customerContact}
                      // invalid={
                      //   touched.customerContact && !!errors.customerContact
                      // }
                      // onBlur={handleBlur}
                    />
                    <FormFeedback className="invalid" id="afternoonMilkError" />
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
                  {/* Afternoon Unit */}
                  <FormGroup>
                    <Label for="debitAmount">Debit Amount</Label>
                    <Input
                      type={"number"}
                      required={true}
                      id="debitAmount"
                      name={"debitAmount"}
                      title={"Debit Amount"}
                      placeholder={"Enter Debit Amount"}
                      value={this.state.debitAmount}
                      onChange={this.handleChange}
                      // autoComplete="username"
                      // valid={!errors.customerContact}
                      // invalid={
                      //   touched.customerContact && !!errors.customerContact
                      // }
                      // onBlur={handleBlur}
                    />
                    <FormFeedback className="invalid" id="debitAmountError" />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      color="primary"
                      className="mr-1"
                      onClick={this.handleSubmit}
                      disabled={this.state.id}
                    >
                      {/* {isSubmitting ? "Wait..." : "Submit"} */}
                      Submit
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      className="mr-1"
                      onClick={this.handleUpdate}
                      disabled={!this.state.id}
                    >
                      {/* {isSubmitting ? "Wait..." : "Update"} */}
                      Update
                    </Button>
                    {/* <Button
                      type="button"
                      color="success"
                      className="mr-1"
                      // onClick={() => this.touchAll(setTouched, errors)}
                      // disabled={isValid}
                    >
                      Validate
                    </Button> */}
                    <Button
                      type="reset"
                      color="danger"
                      className="mr-1"
                      onClick={this.initialState}
                    >
                      Reset
                    </Button>
                    <Button
                      className={
                        !this.state.gridVisible
                          ? "btn btn-success"
                          : "btn btn-secondary"
                      }
                      onClick={this.hideOrShowGrid}
                    >
                      {!this.state.gridVisible ? "Show Grid" : "Hide Grid"}
                    </Button>
                  </FormGroup>
                </Form>
              </Col>
              <Col lg="6">
                <Card className="bg-info">
                  <CardBody>
                    <h1>Total Hotels: {this.state.customers.length}</h1>
                    <h1>
                      Total Daily Hotels:{" "}
                      {
                        this.state.customers.filter(i => i.customerTypeId === 1)
                          .length
                      }
                    </h1>
                    <h1>
                      Total Weekly Hotels:{" "}
                      {
                        this.state.customers.filter(i => i.customerTypeId === 2)
                          .length
                      }
                    </h1>
                    {/* <pre>values: {JSON.stringify(values, null, 2)}</pre>
                    <pre>errors: {JSON.stringify(errors, null, 2)}</pre>
                    <pre>touched: {JSON.stringify(touched, null, 2)}</pre> */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <hr />
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
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default CustomerSupplied;
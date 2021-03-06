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

class CustomerRates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      customersDropDown: [],
      customerId: -1,
      currentRate: "",
      previousRate: "",
      gridVisible: true,
      customerTypeId: -1
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hideOrShowGrid = this.hideOrShowGrid.bind(this);
    this.handleDataForUpdate = this.handleDataForUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleCustomerTypeChange = this.handleCustomerTypeChange.bind(this);
    this.initialState = this.initialState.bind(this);
  }
  initialState() {
    this.setState({
      id: 0,
      customerId: -1,
      currentRate: "",
      previousRate: ""
    });
  }
  hideOrShowGrid(e) {
    e.preventDefault();
    this.setState({ gridVisible: !this.state.gridVisible });
  }
  handleIsEnabled() {
    const haveValues =
      this.state.customerTypeId !== 0 &&
      this.state.customerId !== 0 &&
      this.state.previousRate !== "" &&
      this.state.currentRate !== "";
    return haveValues;
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
      Api.post(`/CustomerRates`, {
        ...customer
      }).then(res => {
        this.loadData(this.state.customerTypeId);
        this.loadDataDropDown(this.state.customerTypeId);
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
        clearInputsColours("input,select");
      });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(this.state);
    showInputError(e.target);
  };
  handleDataForUpdate(val) {
    console.log(val);
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
        Api.delete(`/CustomerRates/`, {
          data: customer
        }).then(res => {
          this.loadData(this.state.customerTypeId);
          this.loadDataDropDown(this.state.customerTypeId);
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

  handleUpdate(e) {
    e.preventDefault();
    showFormErrors("input,select");
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
          this.loadData(this.state.customerTypeId);
          this.loadDataDropDown(this.state.customerTypeId);
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
          clearInputsColours("input,select");
        });
      }
    });
  }

  loadData(customerTypeValue) {
    if (customerTypeValue !== -1)
      Api.get("CustomerRates/all/typeId/" + customerTypeValue)
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
  handleClearForm(e) {
    e.preventDefault();
    this.initialState();
  }

  componentDidMount() {
    // this.loadDataDropDown();
    this.loadData(0);
  }

  loadDataDropDown(id) {
    if (id !== -1) {
      Api.get(
        "/CustomerRates/customersForCustomerRatesDropdown/typeId/" + id
      ).then(res => {
        this.setState({ customersDropDown: res.data });
        console.log("Load Parent", res.data);
      });
    }
  }
  handleCustomerTypeChange(e) {
    this.setState(
      {
        customerTypeId: e.target.value
      },
      () => {
        this.loadData(this.state.customerTypeId);
        this.loadDataDropDown(this.state.customerTypeId);
      }
    );
  }
  updateValue(value) {}
  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="icon-note" />
            <strong>New Customer Rates</strong>
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
                    <Label for="customerTypeId">Customer Type</Label>
                    <Input
                      type="select"
                      name="customerTypeId"
                      id="customerTypeId"
                      autoComplete="given-name"
                      // valid={this.state.customerTypeId > 0}
                      // invalid={this.state.customerTypeId == -1}
                      autoFocus={true}
                      required
                      onChange={this.handleCustomerTypeChange}
                      // onBlur={handleBlur}
                      value={this.state.customerTypeId}
                    >
                      <option value="-1">--Please Select--</option>
                      <option value="0">Select All</option>
                      <option value="1">Daily</option>
                      <option value="2">Weekly</option>
                    </Input>
                    <FormFeedback
                      className="invalid"
                      id="customerTypeIdError"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="customerId">Select Customer</Label>
                    <Input
                      value={this.state.customerId}
                      name="customerId"
                      id="customerId"
                      onChange={this.handleChange}
                      required={true}
                      type="select"
                      autoComplete="given-name"
                      // valid={this.state.customerTypeId > 0}
                      // invalid={this.state.customerTypeId == -1}
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
                    <Label for="currentRate">Current Rate</Label>
                    <Input
                      type={"number"}
                      required={true}
                      id="currentRate"
                      name={"currentRate"}
                      placeholder={"Enter Current Rate"}
                      value={this.state.currentRate}
                      onChange={this.handleChange}
                      autoComplete="family-name"
                      // valid={!errors.customerAddress}
                      // invalid={
                      //   touched.customerAddress && !!errors.customerAddress
                      // }
                      // onBlur={handleBlur}
                    />
                    <FormFeedback className="invalid" id="currentRateError" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="previousRate">Previous Rate</Label>
                    <Input
                      type={"number"}
                      required={true}
                      title={"Previous Rate"}
                      id={"previousRate"}
                      name={"previousRate"}
                      placeholder={"Enter Previous Rate"}
                      value={this.state.previousRate}
                      onChange={this.handleChange}
                      // autoComplete="username"
                      // valid={!errors.customerContact}
                      // invalid={
                      //   touched.customerContact && !!errors.customerContact
                      // }
                      // onBlur={handleBlur}
                    />
                    <FormFeedback className="invalid" id="previousRateError" />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      color="primary"
                      className="mr-1"
                      onClick={this.handleSubmit}
                      disabled={this.state.id ? true : false}
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
            {this.state.gridVisible ? (
              <Grid
                rowData={this.state.customers}
                columnDef={[
                  // {
                  //   headerName: "Id",
                  //   field: "id",
                  //   checkboxSelection: true,
                  //   editable: true,
                  //   width: 200
                  // },
                  // {
                  //   headerName: "Customer Id",
                  //   field: "customerId",
                  //   checkboxSelection: true,
                  //   editable: true,
                  //   width: 200
                  // },
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
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default CustomerRates;

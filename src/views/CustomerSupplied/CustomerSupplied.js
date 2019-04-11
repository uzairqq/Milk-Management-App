import React, { Component } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
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
import { MilkCounter, GrandTotalMilkCounter } from "../../utils/Counters";
import {TotalTax,MorningTax,AfternoonTax} from '../../utils/Taxes';

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
      totalAmount:0,
      customerType: -1,
      morningUnit: "Mund",
      afternoonUnit: "Kg",
      selectedDate: new Date().toDateString(),
      gridVisible: true,
      totalMorningMilk: 0.0,
      totalAfternoonMilk: 0.0,
      totalMilk: 0.0,
      large: false,
      largeEdit:false,
      primary: false,
      primaryConfirm: false,
      fastEntryData: [],
      fastEntrySelectedDate: new Date().toDateString(),
    };
    this.loadDataDropDown = this.loadDataDropDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCustomerTypeChange = this.handleCustomerTypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleDataForUpdate = this.handleDataForUpdate.bind(this);
    this.handleSelectedDate = this.handleSelectedDate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.initialState = this.initialState.bind(this);
    this.hideOrShowGrid = this.hideOrShowGrid.bind(this);
    this.toggleLarge = this.toggleLarge.bind(this);
    this.toggleLargeForEdit = this.toggleLargeForEdit.bind(this);
    this.fastEntry = this.fastEntry.bind(this);
    this.handleFastEntrySelectedDate = this.handleFastEntrySelectedDate.bind(
      this
    );
    this.getFastEntryDataOnSelectedDate = this.getFastEntryDataOnSelectedDate.bind(
      this
    );
    this.handleClearPaymentFastInEdit=this.handleClearPaymentFastInEdit.bind(this);
  }
  componentDidMount() {
    this.loadData();
    this.loadDataDropDown(-1);
  }
  initialState() {
    this.setState({
      customerSuppliedid: 0,
      customerId: -1,
      morningMilk: "",
      afternoonMilk: "",
      debitAmount: 0,
      morningUnit: "Mund",
      afternoonUnit: "Kg"
    });
  }
  toggleLarge() {
    this.setState({
      large: !this.state.large
    });
  }
  toggleLargeForEdit() {
    this.setState({
      largeEdit: !this.state.largeEdit
    });
    this.initialState();
  }
  handleFastEntrySelectedDate(e) {
    debugger;
    this.setState({
      fastEntrySelectedDate: e.target.value
    });
  }
  handleClearPaymentFastInEdit(e){
console.log("Clicked")
e.preventDefault();
showFormErrors("input,select");
Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  type: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, Clear Payment!"
}).then(result => {
  if (result.value) {
    debugger;
    const customer = {
      Id: this.state.customerSuppliedid,
      LastUpdatedOn: this.state.selectedDate,
      CustomerTypeId: this.state.customerType,
      CustomerId: this.state.customerId,
      MorningSupply: this.state.morningMilk + " " + this.state.morningUnit,
      AfternoonSupply:
        this.state.afternoonMilk + " " + this.state.afternoonUnit,
      Debit: this.state.totalAmount
    };

    console.log("abhi update", customer);
    debugger;
    Api.put(`/CustomerSupplied/`, {
      ...customer
    }).then(res => {
      this.loadData();
      this.loadDataDropDown();
      this.initialState();
      this.setState({
        largeEdit:false
      })
      if (res.data.success) {
        Swal.fire({
          position: "top-end",
          type: "success",
          title: res.data.successMessage,
          showConfirmButton: false,
          timer: 1000
        });
      } else {
        Swal.fire({
          position: "top-end",
          type: "error",
          title: res.data.failureMessage,
          showConfirmButton: false,
          timer: 1000
        });
        this.setState({
          largeEdit:true
        })
      }
      clearInputsColours("input,select");
    });
  }
});

  }
  totalMilkCalculation(){
    var b= this.state.customers.reduce(function(total, customer) {
      return total + parseInt(customer.total);
    }, 0);
    if(this.state.customers.length>=15){
     b=b-TotalTax;
    }
    return b;
  }
  totalMorningAmountCalculation(){
   var result= this.state.customers.reduce(function(total, customer) {
      return  total + parseInt(customer.morningAmount);
    }, 0)
    if(this.state.customers.length>=15){
      result=result-MorningTax;
     }
     return result;  
  }
  totalAfterAmountCalculation(){
    var result=this.state.customers.reduce(function(total, customer) {
      return total + parseInt(customer.afternoonAmount);
    }, 0)
    if(this.state.customers.length>=15){
      result=result-AfternoonTax;
     }
     return result;     
  }
  totalCreditAmount(){
    var result=this.state.customers.reduce(function(total, customer) {
      return total + parseInt(customer.credit);
    }, 0)
    if(this.state.customers.length>=15){
      result=result-TotalTax;
     }
     return result;
  }

  totalDebitCalculation(){
      var result=this.state.customers.reduce(function(total, customer) {
                        return total + parseInt(customer.debit);
                      }, 0)
                      if(this.state.customers.length>=15 ){
                        result=result-TotalTax;
                       }
                       return Math.abs(result);                
                    
}

  

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
        debugger;
        const customer = {
          Id: this.state.customerSuppliedid,
          LastUpdatedOn: this.state.selectedDate,
          CustomerTypeId: this.state.customerType,
          CustomerId: this.state.customerId,
          MorningSupply: this.state.morningMilk + " " + this.state.morningUnit,
          AfternoonSupply:
            this.state.afternoonMilk + " " + this.state.afternoonUnit,
          Debit: this.state.debitAmount
        };
        console.log("abhi update", customer);
        debugger;
        Api.put(`/CustomerSupplied/`, {
          ...customer
        }).then(res => {
          this.loadData();
          this.loadDataDropDown();
          this.initialState();
          this.setState({
            largeEdit:false
          })
          if (res.data.success) {
            Swal.fire({
              position: "top-end",
              type: "success",
              title: res.data.successMessage,
              showConfirmButton: false,
              timer: 1000
            });
          } else {
            Swal.fire({
              position: "top-end",
              type: "error",
              title: res.data.failureMessage,
              showConfirmButton: false,
              timer: 1000
            });
            this.setState({
              largeEdit:true
            })
          }
          clearInputsColours("input,select");
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
    showInputError(e.target);
  };
  handleCustomerTypeChange(e) {
    debugger;
    this.setState(
      {
        customerType: e.target.value
      },
      () => {
        this.loadData(this.state.customerType);
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
        Api.delete(`/CustomerSupplied/`, {
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
  getFastEntryDataOnSelectedDate() {
    Api.get(
      "/CustomerSupplied/fastEntry/date/" + this.state.fastEntrySelectedDate
    ).then(res => {
      this.setState({ fastEntryData: res.data });
    });
    this.toggleLarge();
  }

  handleDataForUpdate(val) {
    this.setState({
      customerSuppliedid: val.id,
      customerType: val.customerTypeId,
      customerId: val.customerId,
      morningMilk: val.morningSupply.split(/([0-9.]+)/)[1],
      morningUnit: val.morningSupply.split(/([0-9.]+)/)[2].trim(),
      afternoonMilk: val.afternoonSupply.split(/([0-9.]+)/)[1],
      afternoonUnit: val.afternoonSupply.split(/([0-9.]+)/)[2].trim(),
      debitAmount: val.debit,
      totalAmount:val.total,
      largeEdit:true
    });
  }
  handleFastEntrySubmit = e => {
    e.preventDefault();
    Api.post(
      `/CustomerSupplied/ListPost/date/${this.state.selectedDate}`,
      this.state.fastEntryData
    )
      .then(res => {
        if (res.data.success) {
          this.setState({
            primary: false,
            primaryConfirm: false,
            large: false
          });
          this.loadData();
          this.loadDataDropDown();
          this.initialState();
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
      })
      .catch(console.log);
  };

  loadData() {
    if (this.state.selectedDate.length !== 0) {
      Api.get(
        `/CustomerSupplied/all/selectedDate/${
          this.state.selectedDate
        }/customerTypeId/${this.state.customerType}`
      )
        .then(res => {
          const person = res.data;
          person.forEach(i => {
            i.handleDataForUpdate = this.handleDataForUpdate;
            i.handleDelete = this.handleDelete;
          });
          this.setState({ customers: person });
          this.setState({
            totalMorningMilk: MilkCounter(
              this.state.customers.map(i => i.morningSupply)
            ),
            totalAfternoonMilk: MilkCounter(
              this.state.customers.map(i => i.afternoonSupply)
            )
          });
          this.setState({
            totalMilk: GrandTotalMilkCounter(
              this.state.totalMorningMilk,
              this.state.totalAfternoonMilk
            )
          });
        })
        .catch(error => console.log(error));
    }
  }
  hideOrShowGrid(e) {
    e.preventDefault();
    this.setState({ gridVisible: !this.state.gridVisible });
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
  fastEntry() {
    this.setState({
      primary: !this.state.primary
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    showFormErrors("input,select");

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
        this.loadData(this.state.customerType);
        this.loadDataDropDown(this.state.customerType);
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
            <Col lg="4">
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
                  required
                />
              </FormGroup>
            </Col>
            <hr />
            <Row>
              <Col lg="6">
                <Form noValidate>
                  <FormGroup>
                    <Label for="customerType">Customer Type</Label>
                    <Input
                      onChange={this.handleCustomerTypeChange}
                      type="select"
                      value={this.state.customerType}
                      name="customerType"
                      id="customerType"
                      placeholder="Customer Name"
                      autoComplete="given-name"
                      required
                    >
                      <option value="-1">Select Customer Type</option>
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
                          checked={this.state.afternoonUnit === "Mund"}
                          onChange={this.handleChange}
                        />{" "}
                        Mund
                      </Label>
                    </FormGroup>
                  </FormGroup>
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
                    />
                    <FormFeedback className="invalid" id="debitAmountError" />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      color="primary"
                      className="mr-1"
                      onClick={this.handleSubmit}
                      disabled={this.state.customerSuppliedid ? true : false}
                    >
                      Submit
                    </Button>
                    {/* <Button
                      type="submit"
                      color="secondary"
                      className="mr-1"
                      onClick={this.handleUpdate}
                      disabled={!this.state.customerSuppliedid}
                    >
                      Update
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
                    </Button>{" "}
                    <Button
                      color="primary"
                      onClick={this.fastEntry}
                      className="mr-1"
                    >
                      Fast Entries
                    </Button>
                  </FormGroup>
                </Form>
              </Col>
              <Modal
                isOpen={this.state.primary}
                toggle={this.fastEntry}
                className={"modal-primary " + this.props.className}
              >
                <ModalHeader toggle={this.fastEntry}>Modal title</ModalHeader>
                <ModalBody>
                  <Input
                    type="date"
                    name="fastEntrySelectedDate"
                    id="fastEntrySelectedDate"
                    placeholder="Select Date"
                    onChange={this.handleFastEntrySelectedDate}
                    value={this.state.fastEntrySelectedDate}
                    autoComplete="given-name"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    onClick={this.getFastEntryDataOnSelectedDate}
                  >
                    Get Data
                  </Button>{" "}
                  <Button color="secondary" onClick={this.fastEntry}>
                    Cancel
                  </Button>
                </ModalFooter>
              </Modal>
              {/* <Col lg="6">
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
                  
                  </CardBody>
                </Card>
              </Col> */}
              <Col lg="6">
                <Card className="bg-info">
                  <CardBody>
                    <h4>Total Customers: {this.state.customers.length}</h4>
                    <h4>
                      Total Daily Hotels:{" "}
                      {
                        this.state.customers.filter(i => i.customerTypeId === 1)
                          .length
                      }
                    </h4>
                    <h4>
                      Total Weekly Hotels:{" "}
                      {
                        this.state.customers.filter(i => i.customerTypeId === 2)
                          .length
                      }
                    </h4>
                    <h4>
                      Total Amount:{" "}
                      
                      {/* {this.state.customers.reduce(function(total, customer) {
                        return total + parseInt(customer.total);
                      }, 0)} */}
                      {this.totalMilkCalculation()}
                      {"/="}
                    </h4>
                    <h4>
                      Total Morning Milk: {this.state.totalMorningMilk}
                      {"من"}
                    </h4>
                    <h4>
                      Total Morning Amount:{" "}
                      {/* {this.state.customers.reduce(function(total, customer) {
                        return  total + parseInt(customer.morningAmount);
                      }, 0)} */}
                      {this.totalMorningAmountCalculation()}
                      {"/="}
                    </h4>
                    <h4>
                      Total Afternoon Milk: {this.state.totalAfternoonMilk}
                      {"من"}
                    </h4>
                    <h4>
                      Total Afternoon Amount:{" "}
                      {this.state.customers.reduce(function(total, customer) {
                        return total + parseInt(customer.afternoonAmount);
                      }, 0)}
                      {/* {this.totalAfterAmountCalculation()} */}
                      {"/="}
                    </h4>
                    <h4>
                      Total Debit Amount:{" "}
                      {/* {this.state.customers.reduce(function(total, customer) {
                        return total + parseInt(customer.debit);
                      }, 0)} */}
                      {this.totalDebitCalculation()}
                      {"/="}
                    </h4>
                    <h4>
                      Total Credit Amount:{" "}
                      {this.state.customers.reduce(function(total, customer) {
                        return total + parseInt(customer.credit);
                      }, 0)}
                      {/* {this.totalCreditAmount()} */}
                      {"/="}
                    </h4>
                    <h4>
                      Total Milk: {this.state.totalMilk} {"من"}
                    </h4>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <hr />
            {this.state.gridVisible ? (
              <Grid
                rowData={this.state.customers}
                columnDef={[
                  {
                    headerName: "Actions",
                    field: "value",
                    cellRenderer: "childMessageRenderer",
                    colId: "params",
                    width: 180,
                    editable: false
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
                  }
                ]}
              />
            ) : null}
          </CardBody>
        </Card>
        {/* <Button onClick={this.toggleLarge} className="mr-1">
          Launch large modal
        </Button> */}
        <Modal
          isOpen={this.state.large}
          toggle={this.toggleLarge}
          className={"modal-lg " + this.props.className}
        >
          <ModalHeader toggle={this.toggleLarge}>Modal title</ModalHeader>
          <ModalBody>
            <Grid
              rowData={this.state.fastEntryData}
              columnDef={[
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
                  headerName: "Afternoon Milk",
                  field: "afternoonSupply",
                  checkboxSelection: true,
                  editable: true,
                  width: 200
                }
              ]}
            />
            {/*  */}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              disabled={this.state.fastEntryData.length === 0}
              onClick={this.handleFastEntrySubmit}
            >
              Save List Data
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleLarge}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {/* /Edit Modal/ */}
        
                <Modal
                  isOpen={this.state.largeEdit}
                  toggle={this.toggleLargeForEdit}
                  className={"modal-lg " + this.props.className}
                >
                  <ModalHeader toggle={this.toggleLargeForEdit}>
                    Edit Daily Customer Supply
                  </ModalHeader>
                  <ModalBody>
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
                          checked={this.state.afternoonUnit === "Mund"}
                          onChange={this.handleChange}
                        />{" "}
                        Mund
                      </Label>
                    </FormGroup>
                  </FormGroup>
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
                    />
                    <FormFeedback className="invalid" id="debitAmountError" />
                  </FormGroup>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onClick={this.handleClearPaymentFastInEdit}>
                      Clear Payment
                    </Button>{" "}
                    <Button color="primary" onClick={this.handleUpdate}>
                     Update
                    </Button>{" "}
                    <Button color="secondary" onClick={this.toggleLargeForEdit}>
                      Cancel
                    </Button>
                  </ModalFooter>
                </Modal>
      </div>
    );
  }
}

export default CustomerSupplied;

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
  Row
} from "reactstrap";
import Grid from "../Components/Grid";
import Api from "../../utils/BaseUrl";
import Swal from "sweetalert2";
import {
  showFormErrors,
  showInputError,
  clearInputsColours
} from "../../utils/Validation";

class SupplierSupplied extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierSuppliedId: 0,
      supplierId: -1,
      suppliersDropDown: [],
      suppliers: [],
      morningMilk: "",
      afternoonMilk: "",
      //   debitAmount: 0,
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
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.initialState = this.initialState.bind(this);
  }
  componentDidMount() {
    this.loadData(this.state.selectedDate);
    this.loadDataDropDown(-1);
  }
  initialState() {
    this.setState({
      supplierSuppliedid: 0,
      supplierId: -1,
      morningMilk: "",
      afternoonMilk: "",
      //   debitAmount: 0,
      morningUnit: "Mund",
      afternoonUnit: "Kg"
    });
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
          //   CreatedOn: this.state.selectedDate,
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

  handleDataForUpdate(val) {
    console.log("values", val);

    var a = val.afternoonSupply.match(/(\d+)/);
    debugger;

    debugger;
    this.setState(
      {
        // selectedDate: val.createdOn.toString().substring(0, 10),
        customerSuppliedid: val.id,
        customerType: val.customerTypeId,
        customerId: val.customerId,
        morningMilk: val.morningSupply.match(/\b\d+(?:.\d+)?/)[0],
        // morningUnit: val.morningSupply.split(/(\d+)/)[2].trim(),
        afternoonMilk: val.afternoonSupply.match(/\b\d+(?:.\d+)?/)[0],
        // afternoonUnit: val.afternoonSupply.split(/(\d+)/)[2].trim(),
        debitAmount: val.debit
      },
      () => {
        console.log("Update After", this.state);
      }
    );
  }

  loadData() {
    if (this.state.selectedDate.length !== 0) {
      Api.get("/SupplierSupplied/gridWithDate/date/" + this.state.selectedDate)
        .then(res => {
          const person = res.data;
          person.forEach(i => {
            i.handleDataForUpdate = this.handleDataForUpdate;
            i.handleDelete = this.handleDelete;
          });
          this.setState({ suppliers: person });
          console.log(person);
        })
        .catch(error => console.log(error));
    }
  }
  loadDataDropDown() {
    Api.get("/SupplierSupplied/supplierSuppliedDropDown").then(res => {
      this.setState({ suppliersDropDown: res.data });
    });
  }

  handleIsEnabled() {
    const haveValues =
      this.state.supplierId !== 0 &&
      this.state.morningMilk !== "" &&
      this.state.morningUnit !== "" &&
      this.state.afternoonMilk !== "" &&
      this.state.afternoonUnit !== "";
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
    showFormErrors("input,select");

    const supplierSupplied = {
      CreatedOn: this.state.selectedDate,
      SupplierId: this.state.supplierId,
      MorningPurchase: this.state.morningMilk + " " + this.state.morningUnit,
      AfternoonPurchase:
        this.state.afternoonMilk + " " + this.state.afternoonUnit
    };
    if (this.handleIsEnabled())
      Api.post(`/SupplierSupplied`, {
        ...supplierSupplied
      }).then(res => {
        this.loadData();
        this.loadDataDropDown();
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
            <strong>Daily Supplier</strong>
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
                {/* <FormFeedback
                      className="invalid"
                      id="customerTypeIdError"
                    /> */}
              </FormGroup>
            </Col>
            <hr />
            <Row>
              <Col lg="6">
                <Form
                  // onSubmit={this.handleSubmit}
                  noValidate
                >
                  <FormGroup>
                    <Label for="supplierId">Select Supplier</Label>
                    <Input
                      autoFocus
                      type="select"
                      value={this.state.supplierId}
                      name="supplierId"
                      id="supplierId"
                      onChange={this.handleChange}
                      required={true}
                      autoComplete="family-name"
                    >
                      <option value="-1">Select Supplier</option>
                      {this.state.suppliersDropDown.map(function(data, key) {
                        return (
                          <option key={key} value={data.supplierId}>
                            {data.supplierName}
                          </option>
                        );
                      })}
                    </Input>
                    <FormFeedback className="invalid" id="supplierIdError" />
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
                    <Button
                      color="primary"
                      className="mr-1"
                      onClick={this.handleSubmit}
                      disabled={this.state.supplierSuppliedId ? true : false}
                    >
                      Submit
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      className="mr-1"
                      onClick={this.handleUpdate}
                      disabled={!this.state.supplierSuppliedId}
                    >
                      Update
                    </Button>
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
                    <h1>Total Suppliers: {this.state.suppliers.length}</h1>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <hr />
            {/* {this.state.gridVisible ? ( */}
            <Grid
              rowData={this.state.suppliers}
              columnDef={[
                {
                  headerName: "Supplier Supplied Id",
                  field: "id",
                  checkboxSelection: true,
                  editable: true,
                  width: 200
                },
                {
                  headerName: "Supplier Id",
                  field: "supplierId",
                  checkboxSelection: true,
                  editable: true,
                  width: 200
                },
                {
                  headerName: "Supplier Name",
                  field: "supplierName",
                  checkboxSelection: true,
                  editable: true,
                  width: 200
                },
                {
                  headerName: "Morning Milk",
                  field: "morningPurchase",
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
                  field: "afternoonPurchase",
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

export default SupplierSupplied;

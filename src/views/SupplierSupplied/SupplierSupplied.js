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
import { MilkCounter, GrandTotalMilkCounter } from "../../utils/Counters";

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
      morningUnit: "Mund",
      afternoonUnit: "Kg",
      selectedDate: new Date().toDateString(),
      morningMilkTotal: "",
      gridVisible: true,
      totalMorningMilk: 0.0,
      totalAfternoonMilk: 0.0,
      totalMilk: 0.0
    };
    this.loadDataDropDown = this.loadDataDropDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleDataForUpdate = this.handleDataForUpdate.bind(this);
    this.handleSelectedDate = this.handleSelectedDate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.initialState = this.initialState.bind(this);
    this.hideOrShowGrid = this.hideOrShowGrid.bind(this);
    this.Calculate = this.FastEntries.bind(this);
  }
  componentDidMount() {
    this.loadData();
    this.loadDataDropDown();
  }

  initialState() {
    this.setState({
      supplierSuppliedId: 0,
      supplierId: -1,
      morningMilk: "",
      afternoonMilk: "",
      morningUnit: "Mund",
      afternoonUnit: "Kg"
    });
  }
  FastEntries() {
    debugger;
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
        const supplier = {
          Id: this.state.supplierSuppliedId,
          LastUpdatedOn: this.state.selectedDate,
          SupplierId: this.state.supplierId,
          morningPurchase:
            this.state.morningMilk + " " + this.state.morningUnit,
          AfternoonPurchase:
            this.state.afternoonMilk + " " + this.state.afternoonUnit
        };
        console.log("abhi update", supplier);
        Api.put(`/SupplierSupplied/`, {
          ...supplier
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

  handleDelete = supplier => {
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
        Api.delete(`/SupplierSupplied/`, {
          data: supplier
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
        supplierSuppliedId: val.id,
        supplierId: val.supplierId,
        morningMilk: val.morningPurchase.split(/([0-9.]+)/)[1],
        morningUnit: val.morningPurchase.split(/([0-9.]+)/)[2].trim(),
        afternoonMilk: val.afternoonPurchase.split(/([0-9.]+)/)[1],
        afternoonUnit: val.afternoonPurchase.split(/([0-9.]+)/)[2].trim()
      },
      () => {
        console.log("Update After", this.state);
      }
    );
  }

  loadData() {
    Api.get("/SupplierSupplied/gridWithDate/date/" + this.state.selectedDate)
      .then(res => {
        const person = res.data;
        person.forEach(i => {
          i.handleDataForUpdate = this.handleDataForUpdate;
          i.handleDelete = this.handleDelete;
        });
        this.setState({ suppliers: person });
        this.setState({
          totalMorningMilk: MilkCounter(
            this.state.suppliers.map(i => i.morningPurchase)
          ),
          totalAfternoonMilk: MilkCounter(
            this.state.suppliers.map(i => i.afternoonPurchase)
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
  loadDataDropDown(date) {
    Api.get(
      "/SupplierSupplied/supplierSuppliedDropDown/date/" +
        this.state.selectedDate
    ).then(res => {
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
        this.loadDataDropDown();
      }
    );
  }
  hideOrShowGrid(e) {
    e.preventDefault();
    this.setState({ gridVisible: !this.state.gridVisible });
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
                    <Button onClick={this.FastEntries}>Fast Entries</Button>
                  </FormGroup>
                </Form>
              </Col>
              <Col lg="6">
                <Card className="bg-info">
                  <CardBody>
                    <h4>Total Suppliers: {this.state.suppliers.length}</h4>
                    <h4>
                      Total Amount:{" "}
                      {this.state.suppliers.reduce(function(total, supplier) {
                        return total + parseInt(supplier.total);
                      }, 0)}
                      {"/="}
                    </h4>
                    <h4>
                      Total Morning Milk: {this.state.totalMorningMilk}
                      {"من"}
                    </h4>
                    <h4>
                      Total Morning:{" "}
                      {this.state.suppliers.reduce(function(total, supplier) {
                        return total + parseInt(supplier.morningAmount);
                      }, 0)}
                      {"/="}
                    </h4>
                    <h4>
                      Total Afternoon Milk: {this.state.totalAfternoonMilk}
                      {"من"}
                    </h4>
                    <h4>
                      Total Afternoon:{" "}
                      {this.state.suppliers.reduce(function(total, supplier) {
                        return total + parseInt(supplier.afternoonAmount);
                      }, 0)}
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
                rowData={this.state.suppliers}
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

export default SupplierSupplied;

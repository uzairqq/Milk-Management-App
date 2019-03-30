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

class MarketSell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marketSellId: 0,
      marketSupplierId: -1,
      marketSuppliersDropDown: [],
      marketSells: [],
      morningMilk: "",
      morningRate:0,
      afternoonMilk: "",
      afternoonRate:0,
      morningUnit: "Mund",
      afternoonUnit: "Mund",
      selectedDate: new Date().toDateString(),
      commissionRate:0,
      gridVisible: true,
      totalMorningMilk: 0.0,
      totalAfternoonMilk: 0.0,
      totalMilk: 0.0,
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
  }
  componentDidMount() {
    this.loadData();
    this.loadDataDropDown();
  }
  initialState() {
    this.setState({
      marketSellId: 0,
      marketSupplierId: -1,
      morningMilk: "",
      morningRate:0,
      afternoonMilk: "",
      afternoonRate:0,
      morningUnit: "Mund",
      afternoonUnit: "Mund",
      commissionRate:0
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
        const marketSell = {
          Id: this.state.marketSellId,
          LastUpdatedOn: this.state.selectedDate,
          MarketSupplierId: this.state.marketSupplierId,
          MorningSell: this.state.morningMilk + " " + this.state.morningUnit,
          MorningRate:this.state.morningRate,
          AfternoonSell:
            this.state.afternoonMilk + " " + this.state.afternoonUnit,
            AfternoonRate:this.state.afternoonRate,
            ComissionRate:this.state.commissionRate
        };
        Api.put(`/MarketSell/`, {
          ...marketSell
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
      }
    );
    showInputError(e.target);
  };
 
  handleDelete = marketSell => {
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
        Api.delete(`/MarketSell/`, {
          data: marketSell
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
    this.setState({
      marketSellId: val.id,
      marketSupplierId: val.marketSupplierId,
      morningMilk: val.morningSell.split(/([0-9.]+)/)[1],
      morningUnit: val.morningSell.split(/([0-9.]+)/)[2].trim(),
      morningRate:val.morningRate,
      afternoonMilk: val.afternoonSell.split(/([0-9.]+)/)[1],
      afternoonUnit: val.afternoonSell.split(/([0-9.]+)/)[2].trim(),
      afternoonRate:val.afternoonRate,
      commissionRate:val.comissionRate
    });
  }
  

  loadData() {
    debugger;
    if (this.state.selectedDate.length !== 0) {
      Api.get(
        `/MarketSell/grid/date/${
          this.state.selectedDate
        }`
      )
        .then(res => {
          const person = res.data;
          person.forEach(i => {
            i.handleDataForUpdate = this.handleDataForUpdate;
            i.handleDelete = this.handleDelete;
          });
          this.setState({ marketSells: person });
          this.setState({
            totalMorningMilk: MilkCounter(
              this.state.marketSells.map(i => i.morningSell)
            ),
            totalAfternoonMilk: MilkCounter(
              this.state.marketSells.map(i => i.afternoonSell)
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
  loadDataDropDown() {
      Api.get(
        "/MarketPurchase/drpDownAll/date/" +this.state.selectedDate
      ).then(res => {
        this.setState({ marketSuppliersDropDown: res.data });
      });
    }
  handleIsEnabled() {
    const haveValues =
      this.state.marketSupplierId !== 0 &&
      this.state.morningMilk !== "" &&
      this.state.morningRate !== "" &&
      this.state.morningUnit !== "" &&
      this.state.afternoonMilk !== "" &&
      this.state.afternoonRate !== "" &&
      this.state.afternoonUnit !== "" &&
      this.state.commissionRate !== "" 
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

    const marketSell = {
      CreatedOn: this.state.selectedDate,
      MarketSupplierId: this.state.marketSupplierId,
      MorningSell: this.state.morningMilk + " " + this.state.morningUnit,
      MorningRate:this.state.morningRate,
      AfternoonSell:
        this.state.afternoonMilk + " " + this.state.afternoonUnit,
        AfternoonRate:this.state.afternoonRate,
        ComissionRate:this.state.commissionRate
    };
    if (this.handleIsEnabled())
      Api.post(`/MarketSell`, {
        ...marketSell
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
            <strong>Daily Market Sell</strong>
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
                    <Label for="marketSupplierId">Select Market Supplier</Label>
                    <Input
                      autoFocus
                      type="select"
                      value={this.state.marketSupplierId}
                      name="marketSupplierId"
                      id="marketSupplierId"
                      onChange={this.handleChange}
                      required={true}
                      autoComplete="family-name"
                    >
                      <option value="-1">Select Market Supplier</option>
                      {this.state.marketSuppliersDropDown.map(function(data, key) {
                        return (
                          <option key={key} value={data.marketSupplierId}>
                            {data.marketSupplierName}
                          </option>
                        );
                      })}
                    </Input>
                    <FormFeedback className="invalid" id="marketSupplierIdError" />
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
                    <Label for="morningRate">Morning Rate</Label>
                    <Input
                      type={"number"}
                      required={true}
                      id="morningRate"
                      name={"morningRate"}
                      title={"Morning Rate"}
                      placeholder={"Enter Morning Rate"}
                      value={this.state.morningRate}
                      onChange={this.handleChange}
                    />
                    <FormFeedback className="invalid" id="morningRateError" />
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
                    <Label for="afternoonRate">Afternoon Rate</Label>
                    <Input
                      type={"number"}
                      required={true}
                      id="afternoonRate"
                      name={"afternoonRate"}
                      title={"Afternoon Rate"}
                      placeholder={"Enter Afternoon Rate"}
                      value={this.state.afternoonRate}
                      onChange={this.handleChange}
                    />
                    <FormFeedback className="invalid" id="afternoonRateError" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="commissionRate">Commission Rate</Label>
                    <Input
                      type={"number"}
                      required={true}
                      id="commissionRate"
                      name={"commissionRate"}
                      title={"Commission Rate"}
                      placeholder={"Enter Commission Rate"}
                      value={this.state.commissionRate}
                      onChange={this.handleChange}
                    />
                    <FormFeedback className="invalid" id="commissionRateError" />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      color="primary"
                      className="mr-1"
                      onClick={this.handleSubmit}
                      disabled={this.state.marketSellId ? true : false}
                    >
                      Submit
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      className="mr-1"
                      onClick={this.handleUpdate}
                      disabled={!this.state.marketSellId}
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
                    </Button>{" "}
                  </FormGroup>
                </Form>
              </Col>
              
              <Col lg="6">
                <Card className="bg-info">
                  <CardBody>
                    <h4>Total Suppliers: {this.state.marketSells.length}</h4>
                    <h4>
                      Total Amount:{" "}
                      {this.state.marketSells.reduce(function(total, marketSell) {
                        return total + parseInt(marketSell.totalAmount);
                      }, 0)}
                      {"/="}
                    </h4>
                    <h4>
                      Total Morning Milk: {this.state.totalMorningMilk}
                      {"من"}
                    </h4>
                    <h4>
                      Total Morning Amount:{" "}
                      {this.state.marketSells.reduce(function(total, marketSell) {
                        return total + parseInt(marketSell.morningAmount);
                      }, 0)}
                      {"/="}
                    </h4>
                    <h4>
                      Total Afternoon Milk: {this.state.totalAfternoonMilk}
                      {"من"}
                    </h4>
                    <h4>
                      Total Afternoon Amount:{" "}
                      {this.state.marketSells.reduce(function(total, marketSell) {
                        return total + parseInt(marketSell.afternoonAmount);
                      }, 0)}
                      {"/="}
                    </h4>
                    <h4>
                      Total Milk: {this.state.totalMilk} {"من"}
                    </h4>
                    <h4>
                      Total Commission:  {this.state.marketSells.reduce(function(total, marketSell) {
                        return total + parseInt(marketSell.totalComission);
                      }, 0)}
                      {"/="}
                    </h4>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <hr />
            {this.state.gridVisible ? (
              <Grid
                rowData={this.state.marketSells}
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
                    field: "marketSupplierName",
                    checkboxSelection: true,
                    editable: true,
                    width: 200
                  },
                  {
                    headerName: "Morning Milk",
                    field: "morningSell",
                    checkboxSelection: true,
                    editable: true,
                    width: 200
                  },
                  {
                    headerName: "Morning Rate",
                    field: "morningRate",
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
                    field: "afternoonSell",
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
                    headerName: "Afternoon Rate",
                    field: "afternoonRate",
                    checkboxSelection: true,
                    editable: true,
                    width: 200
                  },
                  {
                    headerName: "Commission Rate",
                    field: "comissionRate",
                    checkboxSelection: true,
                    editable: true,
                    width: 200
                  },
                  {
                    headerName: "Total Commission",
                    field: "totalComission",
                    checkboxSelection: true,
                    editable: true,
                    width: 200
                  },
                  {
                    headerName: "Total",
                    field: "totalAmount",
                    checkboxSelection: true,
                    editable: true,
                    width: 200
                  },
                  {
                    headerName: "Total Milk",
                    field: "totalMilk",
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

export default MarketSell;

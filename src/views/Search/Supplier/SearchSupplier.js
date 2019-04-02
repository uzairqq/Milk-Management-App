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
import Grid from "../../Components/Grid";
import Api from "../../../utils/BaseUrl";
import { MilkCounter, GrandTotalMilkCounter } from "../../../utils/Counters";
import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import "../../../utils/react_dates_overrides.css";

class SearchSupplier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierId: -1,
      suppliersDropDown: [],
      suppliers: [],
      gridVisible: true,
      totalMorningMilk: 0.0,
      totalAfternoonMilk: 0.0,
      totalMilk: 0.0,
    };
    this.loadDataDropDown = this.loadDataDropDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hideOrShowGrid = this.hideOrShowGrid.bind(this);
    this.handleSearch=this.handleSearch.bind(this);
  }
  componentDidMount() {
    this.loadDataDropDown();
  }

  handleChange = e => {
    this.setState(
      {
        [e.target.name]: e.target.value
      }
    );
  };

  handleSearch(e) {
    e.preventDefault();
   var startDate=this.state.startDate.utc()
   .startOf('day')
   .toISOString()
   var endDate=this.state.endDate.utc()
   .startOf('day')
   .toISOString()
      Api.get(
       `/SupplierSupplied/supplierId/${this.state.supplierId}/fromDate/${startDate}/toDate/${endDate}`
      )
        .then(res => {
          const person = res.data;
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
  hideOrShowGrid(e) {
    e.preventDefault();
    this.setState({ gridVisible: !this.state.gridVisible });
  }
  loadDataDropDown() {
      Api.get(
        "SupplierSupplied/GetDropDownForSearch"
      ).then(res => {
        this.setState({ suppliersDropDown: res.data });
      });
    }
  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="icon-note" />
            <strong>Search Supplier Purchase</strong>
            <div className="card-header-actions" />
          </CardHeader>
          <CardBody>
             <Col>
             <Label for="selectDates">Select Dates</Label>
                </Col>
                <CardBody>
                <DateRangePicker
                  startDate={this.state.startDate}
                  startDateId="startDate"
                  endDate={this.state.endDate}
                  endDateId="endDate"
                  onDatesChange={({ startDate, endDate }) =>
                    this.setState({ startDate, endDate })
                  }
                  isOutsideRange={() => false}
                  focusedInput={this.state.focusedInput}
                  onFocusChange={focusedInput =>
                    this.setState({ focusedInput })
                  }
                  displayFormat="DD/MM/YYYY"
                  orientation={this.state.orientation}
                  openDirection={this.state.openDirection}
                />
              </CardBody>
            <Row>
              <Col lg="6">
                <Form noValidate>
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
                    <Button
                      color="primary"
                      className="mr-1"
                      onClick={this.handleSearch}
                    >
                      Search
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
                  <h4>Total Days Purchased: {this.state.suppliers.length}</h4>
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
            {this.state.gridVisible ? (
              <Grid
                rowData={this.state.suppliers}
                columnDef={[
                    {
                        headerName: "Date",
                        field: "date",
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

export default SearchSupplier;

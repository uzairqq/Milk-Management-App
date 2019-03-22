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
import Grid from "../Components/Grid";
import Api from "../../utils/BaseUrl";
import Swal from "sweetalert2";
import {
  showFormErrors,
  showInputError,
  clearInputsColours
} from "../../utils/Validation";

class DailyExpense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dailyExpenseId: 0,
      expenseId: 0,
      expenseDropDown: [],
      expenses: [],
      expenseAmount: 0,
      selectedDate: new Date().toDateString(),
      gridVisible: false
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
  }
  componentDidMount() {
    this.loadData();
    this.loadDataDropDown();
  }
  initialState() {
    this.setState({
      dailyExpenseId: 0,
      expenseId: 0,
      expenseAmount: 0
    });
  }
  hideOrShowGrid(e) {
    e.preventDefault();
    this.setState({ gridVisible: !this.state.gridVisible });
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
        const expense = {
          Id: this.state.dailyExpenseId,
          LastUpdatedOn: this.state.selectedDate,
          ExpenseId: this.state.expenseId,
          Rate: this.state.expenseAmount
        };
        console.log("abhi update", expense);
        debugger;
        Api.put(`/DailyExpense/`, {
          ...expense
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
  handleCustomerTypeChange(e) {
    this.setState(
      {
        customerType: e.target.value
      },
      () => {
        // this.loadData(this.state.customerType);
        this.loadDataDropDown();
      }
    );
  }
  handleDelete = expense => {
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
        Api.delete(`/DailyExpense`, {
          data: expense
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
        dailyExpenseId: val.id,
        expenseID: val.expenseId,
        expenseAmount: val.expenseAmount
      },
      () => {
        console.log("Update After", this.state);
      }
    );
  }

  loadData() {
    if (this.state.selectedDate.length !== 0) {
      Api.get("/DailyExpense/date/" + this.state.selectedDate)
        .then(res => {
          const person = res.data;
          person.forEach(i => {
            i.handleDataForUpdate = this.handleDataForUpdate;
            i.handleDelete = this.handleDelete;
          });
          this.setState({ expenses: person });
          console.log(person);
        })
        .catch(error => console.log(error));
    }
  }
  loadDataDropDown() {
    Api.get("/DailyExpense/drpdown").then(res => {
      this.setState({ expenseDropDown: res.data });
    });
  }

  handleIsEnabled() {
    const haveValues =
      this.state.expenseId !== 0 && this.state.expenseAmount !== "";
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
    const dailyExpense = {
      CreatedOn: this.state.selectedDate,
      ExpenseId: this.state.expenseId,
      Rate: this.state.expenseAmount
    };
    if (this.handleIsEnabled())
      Api.post(`/DailyExpense`, {
        ...dailyExpense
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
            <strong>Daily Expense</strong>
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
                    <Label for="customerId">Select Expense</Label>
                    <Input
                      autoFocus
                      type="select"
                      value={this.state.expenseId}
                      name="expenseId"
                      id="expenseId"
                      onChange={this.handleChange}
                      required={true}
                      autoComplete="family-name"
                    >
                      <option value="-1">Select Expense</option>
                      {this.state.expenseDropDown.map(function(data, key) {
                        return (
                          <option key={key} value={data.expenseId}>
                            {data.expenseName}
                          </option>
                        );
                      })}
                    </Input>
                    <FormFeedback className="invalid" id="expenseIdError" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="expenseAmount">Expense Amount</Label>
                    <Input
                      type={"number"}
                      required={true}
                      id="expenseAmount"
                      name={"expenseAmount"}
                      title={"expenseAmount Milk"}
                      placeholder={"Enter Expense"}
                      value={this.state.expenseAmount}
                      onChange={this.handleChange}
                    />
                    <FormFeedback className="invalid" id="expenseAmountError" />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      color="primary"
                      className="mr-1"
                      onClick={this.handleSubmit}
                      disabled={this.state.id ? true : false}
                    >
                      Submit
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      className="mr-1"
                      onClick={this.handleUpdate}
                      disabled={!this.state.id}
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
                    <h3>Total Expenses: {this.state.expenses.length}</h3>
                    <h3>
                      Total Expense Amount:{" "}
                      {this.state.expenses.reduce(function(total, expense) {
                        return total + parseInt(expense.rate);
                      }, 0)}
                      {"/="}
                    </h3>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <hr />
            {this.state.gridVisible ? (
              <Grid
                rowData={this.state.expenses}
                columnDef={[
                  {
                    headerName: "Id",
                    field: "id",
                    checkboxSelection: true,
                    editable: true,
                    width: 200
                  },
                  {
                    headerName: "Expense Id",
                    field: "expenseId",
                    checkboxSelection: true,
                    editable: true,
                    width: 200
                  },
                  {
                    headerName: "Expense Name",
                    field: "expenseName",
                    checkboxSelection: true,
                    editable: true,
                    width: 200
                  },
                  {
                    headerName: "Amount",
                    field: "rate",
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
            ) : null}{" "}
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default DailyExpense;

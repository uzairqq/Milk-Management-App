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
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
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
      gridVisible: true,
      primary: false,
      primaryConfirm: false,

      fastEntryData: [],
      fastEntrySelectedDate: new Date().toDateString()
    };
    this.handleFastEntrySelectedDate = this.handleFastEntrySelectedDate.bind(
      this
    );
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
    this.fastEntries = this.fastEntries.bind(this);
    this.fastEntry = this.fastEntry.bind(this);
    this.getFastEntryDataOnSelectedDate = this.getFastEntryDataOnSelectedDate.bind(
      this
    );
    this.fastEntryConfirm = this.fastEntryConfirm.bind(this);
    this.handleFastEntrySubmit = this.handleFastEntrySubmit.bind(this);
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

  fastEntries() {
    alert("fast entres");
  }
  fastEntry() {
    this.setState({
      primary: !this.state.primary
    });
  }
  fastEntryConfirm() {
    this.setState({
      primaryConfirm: !this.state.primaryConfirm
    });
  }

  hideOrShowGrid(e) {
    e.preventDefault();
    this.setState({ gridVisible: !this.state.gridVisible });
  }
  getFastEntryDataOnSelectedDate() {
    debugger;
    Api.get("/DailyExpense/date/" + this.state.fastEntrySelectedDate).then(
      res => {
        this.setState({ fastEntryData: res.data });
      }
    );
    this.fastEntryConfirm();
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
    this.setState({
      [e.target.name]: e.target.value
    });
    showInputError(e.target);
  };

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
    this.setState({
      dailyExpenseId: val.id,
      expenseId: val.expenseId,
      expenseAmount: val.rate
    });
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
    Api.get("/DailyExpense/drpdown/date/" + this.state.selectedDate).then(
      res => {
        this.setState({ expenseDropDown: res.data });
      }
    );
  }
  handleFastEntrySelectedDate(e) {
    debugger;
    this.setState({
      fastEntrySelectedDate: e.target.value
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
        this.loadDataDropDown();
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
  handleFastEntrySubmit = e => {
    debugger;
    e.preventDefault();
    // var params = {
    //   date: this.state.selectedDate,
    //   dto: this.state.fastEntryData
    // };
    Api.post(
      `/DailyExpense/ListPost/date/${this.state.selectedDate}`,
      this.state.fastEntryData
    )
      .then(res => {
        if (res.data.success) {
          this.setState({
            primary: false,
            primaryConfirm: false
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
                      disabled={this.state.dailyExpenseId ? true : false}
                    >
                      Submit
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      className="mr-1"
                      onClick={this.handleUpdate}
                      disabled={!this.state.dailyExpenseId}
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
                    <Button
                      color="primary"
                      onClick={this.fastEntry}
                      className="mr-1"
                    >
                      Fast Entries
                    </Button>
                    <Modal
                      isOpen={this.state.primary}
                      toggle={this.fastEntry}
                      className={"modal-primary " + this.props.className}
                    >
                      <ModalHeader toggle={this.fastEntry}>
                        Modal title
                      </ModalHeader>
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
            <Modal
              isOpen={this.state.primaryConfirm}
              toggle={this.fastEntryConfirm}
              className={"modal-primary " + this.props.className}
            >
              <ModalHeader toggle={this.fastEntryConfirm}>
                Modal title
              </ModalHeader>
              <ModalBody>
                <Grid
                  rowData={this.state.fastEntryData}
                  columnDef={[
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
                    }
                    // {
                    //   headerName: "Actions",
                    //   field: "value",
                    //   cellRenderer: "childMessageRenderer",
                    //   colId: "params",
                    //   width: 180,
                    //   editable: false
                    // }
                  ]}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  disabled={this.state.fastEntryData.length === 0}
                  onClick={this.handleFastEntrySubmit}
                >
                  Save This Data
                </Button>{" "}
                <Button color="secondary" onClick={this.fastEntryConfirm}>
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default DailyExpense;

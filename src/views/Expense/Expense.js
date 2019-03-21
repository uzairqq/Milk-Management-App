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
import {
  showFormErrors,
  showInputError,
  clearInputsColours
} from "../../utils/Validation";
import Swal from "sweetalert2";

class Expense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenseId: 0,
      expenseName: "",
      expenses: [],
      gridVisible: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDataForUpdate = this.handleDataForUpdate.bind(this);
    this.initialState = this.initialState.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.hideOrShowGrid = this.hideOrShowGrid.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }
  loadData() {
    Api.get("/Expense/all")
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
  handleDataForUpdate(val) {
    this.setState({
      expenseId: val.id,
      expenseName: val.expenseName
    });
  }
  hideOrShowGrid(e) {
    e.preventDefault();
    this.setState({ gridVisible: !this.state.gridVisible });
  }
  initialState() {
    this.setState({
      expenseId: 0,
      expenseName: ""
    });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    showInputError(e.target);
  }

  handleRowsValuesInTextBox(e) {
    this.setState({
      id: e.id,
      expenseName: e.name
    });
  }
  handleUpdate(e) {
    e.preventDefault();
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
        const expense = {
          id: this.state.expenseId,
          expenseName: this.state.expenseName
        };
        Api.put(`/Expense`, { ...expense }).then(res => {
          this.loadData();
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

  handleDelete = val => {
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
        Api.delete(`/Expense/`, { data: val }).then(res => {
          this.loadData();
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

  handleIsEnabled() {
    const isEnabled =
      this.state.expenseId === 0 && this.state.expenseName.length === 0;
    return isEnabled;
  }

  handleSubmit(e) {
    e.preventDefault();
    showFormErrors("input,select");

    const expense = {
      expenseName: this.state.expenseName
    };

    if (!this.handleIsEnabled())
      Api.post(`/Expense`, { ...expense }).then(res => {
        this.loadData();
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
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="icon-note" />
            <strong>New Customer</strong>
            <div className="card-header-actions" />
          </CardHeader>
          <CardBody>
            <hr />
            <Row>
              <Col lg="6">
                <Form noValidate>
                  <FormGroup>
                    <Label for="expenseName">Expense Name</Label>
                    <Input
                      required
                      placeholder="Enter Expense Name"
                      name="expenseName"
                      id="expenseName"
                      type="text"
                      value={this.state.expenseName}
                      onChange={this.handleChange}
                    />
                    <FormFeedback className="invalid" id="expenseNameError" />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      color="primary"
                      className="mr-1"
                      onClick={this.handleSubmit}
                      disabled={this.state.expenseId}
                    >
                      {/* {isSubmitting ? "Wait..." : "Submit"} */}
                      Submit
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      className="mr-1"
                      onClick={this.handleUpdate}
                      disabled={!this.state.expenseId}
                    >
                      {/* {isSubmitting ? "Wait..." : "Update"} */}
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
                    <h1>Total Expenses: {this.state.expenses.length}</h1>
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
                    editable: true
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

export default Expense;

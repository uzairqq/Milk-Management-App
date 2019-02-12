import React, { Component } from "react";
import {
  Container,
  FormGroup,
  Input,
  Col,
  Label,
  FormFeedback,
  Button,
  Form
} from "reactstrap";
import Grid from "../Components/Grid";
import { showFormErrors, showInputError } from "../utils/Validation";
import axios from "axios";
import Swal from "sweetalert2";

class Expense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenseId: 0,
      expenseName: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDataForUpdate = this.handleDataForUpdate.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    fetch("http://localhost:56996/api/Expense/all")
      .then(result => result.json())
      .then(expense => {
        expense.forEach(i => {
          i.handleDataForUpdate = this.handleDataForUpdate;
          i.handleDelete = this.handleDelete;
        });
        this.setState({ expense });
      });
  }
  handleDataForUpdate(val) {
    this.setState({
      expenseId: val.id,
      expenseName: val.expenseName
    });
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
  handleUpdate() {
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
        axios
          .put(`http://localhost:56996/api/Expense`, { ...expense })
          .then(res => {
            console.log(res);
            console.log(res.data);
            this.loadData();
            this.initialState();
            Swal.fire("Updated!", "Your Record has been Updated.", "success");
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
        axios
          .delete(`http://localhost:56996/api/Expense/`, { data: val })
          .then(res => {
            console.log(res);
            console.log(res.data);
            this.loadData();
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
          });
      }
    });
  };

  handleIsEnabled() {
    const isEnabled =
      this.state.expenseId === 0 && this.state.expenseName.length === 0;
    return isEnabled;
  }

  handleSubmit() {
    // e.preventDefault();
    showFormErrors("#root > div > form > div > div > input,select");

    const expense = {
      expenseName: this.state.expenseName
    };

    if (!this.handleIsEnabled())
      axios
        .post(`http://localhost:56996/api/Expense`, { ...expense })
        .then(res => {
          console.log(res);
          console.log(res.data);
          this.loadData();
          this.initialState();
        });
  }

  render() {
    return (
      <Container>
        <h1>Expense Form</h1>
        <Form action="post" noValidate={true}>
          <FormGroup row={true}>
            <Input
              type="hidden"
              name="expenseId"
              value={this.state.expenseId}
            />
            <Label for="expenseName" sm={2}>
              Expense Name
            </Label>
            <Col sm={10}>
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
            </Col>
          </FormGroup>
          <FormGroup row={true}>
            <Button
              type="button"
              disabled={this.state.expenseId ? true : false}
              // onClick={this.handleSubmit.bind(this)}
              className="mr-3"
            >
              Add
            </Button>
            <Button
              onClick={this.handleUpdate.bind(this)}
              className="mr-3"
              disabled={!this.state.expenseId}
            >
              Update
            </Button>
          </FormGroup>
        </Form>
        <Grid
          rowData={this.state.expense}
          columnDef={[
            {
              headerName: "Id",
              field: "id",
              checkboxSelection: true,
              editable: true
            },
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
      </Container>
    );
  }
}

export default Expense;

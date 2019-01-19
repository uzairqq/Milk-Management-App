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
import { showFormErrors, showInputError } from "../utils/Validation";
import axios from "axios";

class Expense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenseId: 0,
      expenseName: "",
      expense: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    console.log(e.target.value);
    showInputError(e.target);
  }
  handleRowsValuesInTextBox(e) {
    this.setState({
      id: e.id,
      expenseName: e.name
    });
  }
  componentDidMount() {
    axios.get(`http://localhost:56996/api/Expense/all`).then(res => {
      const expense = res.data;
      this.setState({ expense });
    });
  }

  handleIsEnabled() {
    const isEnabled =
      this.state.expenseId === 0 && this.state.expenseName.length === 0;
    return isEnabled;
  }
  handleSubmit = e => {
    e.preventDefault();
    showFormErrors("#root > div > form > div > div > input,select");

    const expense = {
      expenseId: this.state.expenseId,
      expenseName: this.state.expenseName
    };

    if (!this.handleIsEnabled())
      axios
        .post(`http://localhost:56996/api/Expense`, { ...expense })
        .then(res => {
          console.log(res);
          console.log(res.data);
        });
  };
  render() {
    return (
      <Container>
        <h1>Expense Form</h1>
        <Form action="post" onSubmit={this.handleSubmit} noValidate={true}>
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
            <Button type="submit" className="mr-3">
              Add
            </Button>
          </FormGroup>
        </Form>
      </Container>
    );
  }
}

export default Expense;

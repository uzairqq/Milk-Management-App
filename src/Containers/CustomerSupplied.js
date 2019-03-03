import React, { Component } from "react";
import axios from "axios";
import {
  Container,
  FormGroup,
  Col,
  Label,
  FormFeedback,
  Input,
  Card,
  CardBody,
  Form
} from "reactstrap";
import InputFeilds from "../Components/InputFeilds";
import ButtonComponent from "../Components/Button";
import Swal from "sweetalert2";

class CustomerSupplied extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerSuppliedid: 0,
      customerId: -1,
      customersDropDown: [],
      morningMilk: "",
      afternoonMilk: "",
      debitAmount: 0,
      customerType: -1,
      morningUnit: "Kg",
      afternoonUnit: "Kg"
    };
    this.loadDataDropDown = this.loadDataDropDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCustomerTypeChange = this.handleCustomerTypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.loadDataDropDown();
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
    // showInputError(e.target);
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
  loadDataDropDown() {
    axios
      .get(
        "http://localhost:56996/api/CustomerSupplied/customerSuppliedDropDown"
      )
      .then(res => {
        this.setState({ customersDropDown: res.data });
        console.log("Load Parent", res.data);
      });
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
  handleSubmit = e => {
    e.preventDefault();
    // showFormErrors("input,select,radio");
    const customerSupplied = {
      CustomerTypeId: this.state.customerType,
      CustomerId: this.state.customerId,
      MorningSupply: this.state.morningMilk + " " + this.state.morningUnit,
      AfternoonSupply:
        this.state.afternoonMilk + " " + this.state.afternoonUnit,
      Debit: this.state.debitAmount
    };
    if (this.handleIsEnabled())
      axios
        .post(`http://localhost:56996/api/CustomerSupplied`, {
          ...customerSupplied
        })
        .then(res => {
          // this.loadData(this.state.customerType);
          this.loadDataDropDown(this.state.customerType);
          // this.initialState();

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
        });
  };

  render() {
    return (
      <Container>
        <h1>CustomerSupplied</h1>
        <Card body outline color="warning">
          <CardBody sm={5}>
            <Form method="post" noValidate={true} />
            <FormGroup row>
              <Col sm={{ size: 6, order: 5, offset: 0 }}>
                <Label for={"customerType"}>{"Customer Type"}</Label>
                <Input
                  onChange={this.handleCustomerTypeChange}
                  type="select"
                  value={this.state.customerType}
                  name="customerType"
                  id="customerType"
                  // required={true}
                >
                  <option value="-1">Select Customer Type</option>
                  <option value="0">All</option>
                  <option value="1">Daily</option>
                  <option value="2">Weekly</option>
                </Input>
                <FormFeedback className="invalid" id="customerTypeError" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col sm={{ size: 6, order: 5, offset: 0 }}>
                <Label for={"customerId"}>{"Select Customer"}</Label>
                <Input
                  autoFocus
                  type="select"
                  value={this.state.customerId}
                  name="customerId"
                  id="customerId"
                  onChange={this.handleChange}
                  required={true}
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
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md={6}>
                <InputFeilds
                  type={"number"}
                  required={true}
                  name={"morningMilk"}
                  title={"Morning Milk"}
                  placeholder={"Enter Morning Milk"}
                  value={this.state.morningMilk}
                  handlechange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup tag="fieldset">
              <legend>Morning Unit</legend>
              <FormGroup check inline>
                <Label check>
                  <Input
                    defaultChecked
                    type="radio"
                    name="morningUnit"
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
                    onChange={this.handleChange}
                  />{" "}
                  Mund
                </Label>
              </FormGroup>
            </FormGroup>
            <FormGroup row>
              <Col sm={{ size: 6, order: 5, offset: 0 }}>
                <InputFeilds
                  type={"number"}
                  required={true}
                  name={"afternoonMilk"}
                  title={"Afternoon Milk"}
                  placeholder={"Enter Afternoon Milk"}
                  value={this.state.afternoonMilk}
                  handlechange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <FormGroup tag="fieldset">
              <legend>Afternon Unit</legend>
              <FormGroup check inline>
                <Label check>
                  <Input
                    defaultChecked
                    type="radio"
                    name="afternoonUnit"
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
                    name="afternoonUnit"
                    value="Mund"
                    onChange={this.handleChange}
                  />{" "}
                  Mund
                </Label>
              </FormGroup>
            </FormGroup>
            <FormGroup row>
              <Col sm={{ size: 6, order: 5, offset: 0 }}>
                <InputFeilds
                  type={"number"}
                  required={true}
                  name={"debitAmount"}
                  title={"Debit Amount"}
                  placeholder={"Enter Debit Amount"}
                  value={this.state.debitAmount}
                  handlechange={this.handleChange}
                />
              </Col>
            </FormGroup>
            <ButtonComponent
              action={this.handleSubmit}
              title={"Save"}
              class={"btn btn-success"}
              disable={this.state.customerSuppliedid ? true : false}
              size={"lg"}
            />{" "}
            <ButtonComponent
              //action={this.handleUpdate}
              title={"Update"}
              class={"btn btn-info"}
              disable={!this.state.customerSuppliedid}
              size={"lg"}
            />{" "}
            <ButtonComponent
              // action={this.handleClearForm}
              title={"Clear All"}
              class={"btn btn-danger"}
              size={"lg"}
            />{" "}
            <ButtonComponent
              // action={this.hideOrShowGrid}
              title={!this.state.gridVisible ? "Show Grid" : "Hide Grid"}
              class={"btn btn-danger"}
              size={"lg"}
            />{" "}
          </CardBody>
        </Card>
      </Container>
    );
  }
}
export default CustomerSupplied;

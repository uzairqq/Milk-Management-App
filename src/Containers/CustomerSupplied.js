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
      customerType: -1
    };
    this.loadDataDropDown = this.loadDataDropDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCustomerTypeChange = this.handleCustomerTypeChange.bind(this);
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
              <Col sm={{ size: 6, order: 5, offset: 0 }}>
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
              // action={this.handleSubmit}
              title={"Save"}
              class={"btn btn-success"}
              disable={this.state.customerSuppliedid ? true : false}
              size={"lg"}
            />{" "}
            <ButtonComponent
              // action={this.handleUpdate}
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

import React from "react";
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
import "../Customer/Customer.css";
import Grid from "../Components/Grid";
import Api from "../../utils/BaseUrl";
import Swal from "sweetalert2";
import {
  showFormErrors,
  showInputError,
  clearInputsColours
} from "../../utils/Validation";

class Customer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      customerTypeId: -1,
      customerName: "",
      customerAddress: "",
      customerContact: "",
      customers: [],
      gridVisible: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDataForUpdate = this.handleDataForUpdate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.hideOrShowGrid = this.hideOrShowGrid.bind(this);
    this.initialState = this.initialState.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }

  loadData() {
    Api.get("/Customer/all")
      .then(res => {
        const person = res.data;
        person.forEach(i => {
          i.handleDataForUpdate = this.handleDataForUpdate;
          i.handleDelete = this.handleDelete;
        });
        this.setState({ customers: person });
        console.log(person);
      })
      .catch(error => console.log(error));
  }
  handleDataForUpdate(val) {
    this.setState({
      id: val.id,
      customerTypeId: val.customerTypeId,
      customerName: val.name,
      customerAddress: val.address,
      customerContact: val.contact
    });
  }
  handleIsEnabled() {
    const haveValues =
      this.state.customerTypeId !== 0 &&
      this.state.customerName !== "" &&
      this.state.customerAddress !== "" &&
      this.state.customerContact !== "";
    return haveValues;
  }
  handleSubmit = e => {
    e.preventDefault();
    showFormErrors("input,select");

    const customer = {
      customerTypeId: this.state.customerTypeId,
      name: this.state.customerName,
      address: this.state.customerAddress,
      contact: this.state.customerContact
    };

    if (this.handleIsEnabled())
      Api.post(`/Customer`, { ...customer }).then(res => {
        this.loadData();
        this.initialState();
        console.log(res);
        console.log(res.data);

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
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    showInputError(e.target);
  }

  handleRowsValuesInTextBox(e) {
    this.setState({
      id: e.id,
      customerTypeId: e.customerTypeId,
      customerName: e.name,
      customerAddress: e.address,
      customerContact: e.contact
    });
  }
  initialState() {
    this.setState({
      id: 0,
      // customerTypeId: -1,// we dont want to clear customer type .. user dont have to select again .
      customerName: "",
      customerContact: "",
      customerAddress: ""
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
        const customer = {
          id: this.state.id,
          customerTypeId: this.state.customerTypeId,
          name: this.state.customerName,
          address: this.state.customerAddress,
          contact: this.state.customerContact
        };
        Api.put(`/Customer`, { ...customer }).then(res => {
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
        });
      }
      clearInputsColours("input,select");
    });
  }
  handleDelete = cust => {
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
        Api.delete(`/Customer`, {
          data: cust
        }).then(res => {
          console.log(res);
          console.log(res.data);
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
                <Form
                  // onSubmit={this.handleSubmit}
                  noValidate
                >
                  <FormGroup>
                    <Label for="customerTypeId">Customer Type</Label>
                    <Input
                      type="select"
                      name="customerTypeId"
                      id="customerTypeId"
                      autoComplete="given-name"
                      // valid={this.state.customerTypeId > 0}
                      // invalid={this.state.customerTypeId == -1}
                      autoFocus={true}
                      required
                      onChange={this.handleChange}
                      // onBlur={handleBlur}
                      value={this.state.customerTypeId}
                    >
                      <option value="-1">--Please Select--</option>
                      <option value="1">Daily</option>
                      <option value="2">Weekly</option>
                    </Input>
                    <FormFeedback
                      className="invalid"
                      id="customerTypeIdError"
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for="customerName">Customer Name</Label>
                    <Input
                      type="text"
                      name="customerName"
                      id="customerName"
                      placeholder="Customer Name"
                      autoComplete="given-name"
                      // valid={!errors.customerName}
                      // invalid={touched.customerName && !!errors.customerName}
                      // autoFocus={true}
                      required
                      onChange={this.handleChange}
                      // onBlur={handleBlur}
                      value={this.state.customerName}
                    />
                    <FormFeedback className="invalid" id="customerNameError" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="customerAddress">Customer Address</Label>
                    <Input
                      type="text"
                      name="customerAddress"
                      id="customerAddress"
                      placeholder="Customer Address"
                      autoComplete="family-name"
                      // valid={!errors.customerAddress}
                      // invalid={
                      //   touched.customerAddress && !!errors.customerAddress
                      // }
                      required
                      onChange={this.handleChange}
                      // onBlur={handleBlur}
                      value={this.state.customerAddress}
                    />
                    <FormFeedback
                      className="invalid"
                      id="customerAddressError"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="customerContact">Customer Contact</Label>
                    <Input
                      type="text"
                      name="customerContact"
                      id="customerContact"
                      placeholder="Customer Contact"
                      // autoComplete="username"
                      // valid={!errors.customerContact}
                      // invalid={
                      //   touched.customerContact && !!errors.customerContact
                      // }
                      required
                      onChange={this.handleChange}
                      // onBlur={handleBlur}
                      value={this.state.customerContact}
                    />
                    <FormFeedback
                      className="invalid"
                      id="customerContactError"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      color="primary"
                      className="mr-1"
                      onClick={this.handleSubmit}
                      disabled={this.state.id}
                    >
                      {/* {isSubmitting ? "Wait..." : "Submit"} */}
                      Submit
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      className="mr-1"
                      onClick={this.handleUpdate}
                      disabled={!this.state.id}
                    >
                      {/* {isSubmitting ? "Wait..." : "Update"} */}
                      Update
                    </Button>
                    {/* <Button
                      type="button"
                      color="success"
                      className="mr-1"
                      // onClick={() => this.touchAll(setTouched, errors)}
                      // disabled={isValid}
                    >
                      Validate
                    </Button> */}
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
                    <h1>Total Hotels: {this.state.customers.length}</h1>
                    <h1>
                      Total Daily Hotels:{" "}
                      {
                        this.state.customers.filter(i => i.customerTypeId === 1)
                          .length
                      }
                    </h1>
                    <h1>
                      Total Weekly Hotels:{" "}
                      {
                        this.state.customers.filter(i => i.customerTypeId === 2)
                          .length
                      }
                    </h1>
                    {/* <pre>values: {JSON.stringify(values, null, 2)}</pre>
                    <pre>errors: {JSON.stringify(errors, null, 2)}</pre>
                    <pre>touched: {JSON.stringify(touched, null, 2)}</pre> */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <hr />
            {this.state.gridVisible ? (
              <Grid
                rowData={this.state.customers}
                columnDef={[
                  {
                    headerName: "Customer Type",
                    field: "type",
                    checkboxSelection: true,
                    editable: true
                  },
                  {
                    headerName: "Customer Name",
                    field: "name",
                    checkboxSelection: true,
                    editable: true
                  },
                  {
                    headerName: "Customer Address",
                    field: "address",
                    checkboxSelection: true,
                    editable: true
                  },
                  {
                    headerName: "Customer Contact",
                    field: "contact",
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

export default Customer;

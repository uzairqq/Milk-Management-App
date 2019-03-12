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
import Grid from "../Components/Grid";
import Api from "../../utils/BaseUrl";
import Swal from "sweetalert2";
import {
  showFormErrors,
  showInputError,
  clearInputsColours
} from "../../utils/Validation";

class Supplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierId: 0,
      supplierName: "",
      supplierAddress: "",
      supplierContact: "",
      suppliers: [],
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
    Api.get("/Supplier/all")
      .then(res => {
        const person = res.data;
        person.forEach(i => {
          i.handleDataForUpdate = this.handleDataForUpdate;
          i.handleDelete = this.handleDelete;
        });
        this.setState({ suppliers: person });
        console.log(person);
      })
      .catch(error => console.log(error));
  }
  handleDataForUpdate(val) {
    debugger;
    this.setState({
      supplierId: val.id,
      supplierName: val.supplierName,
      supplierAddress: val.supplierAddress,
      supplierContact: val.supplierContact
    });
  }
  handleIsEnabled() {
    const haveValues =
      this.state.supplierName !== "" &&
      this.state.supplierAddress !== "" &&
      this.state.supplierContact !== "";
    return haveValues;
  }
  handleSubmit = e => {
    e.preventDefault();
    showFormErrors("input,select");

    const supplier = {
      supplierName: this.state.supplierName,
      supplierAddress: this.state.supplierAddress,
      supplierContact: this.state.supplierContact
    };

    if (this.handleIsEnabled())
      Api.post(`/Supplier`, { ...supplier }).then(res => {
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
      id: e.supplierId,
      customerName: e.customerName,
      customerAddress: e.customerAddress,
      customerContact: e.customerContact
    });
  }
  initialState() {
    this.setState({
      supplierId: 0,
      supplierName: "",
      supplierContact: "",
      supplierAddress: ""
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
        const supplier = {
          id: this.state.supplierId,
          supplierName: this.state.supplierName,
          supplierAddress: this.state.supplierAddress,
          supplierContact: this.state.supplierContact
        };
        Api.put(`/Supplier`, { ...supplier }).then(res => {
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
        Api.delete(`/Supplier`, {
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
            <strong>New Supplier</strong>
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
                    <Label for="supplierName">Supplier Name</Label>
                    <Input
                      type="text"
                      name="supplierName"
                      id="supplierName"
                      placeholder="Supplier Name"
                      autoComplete="given-name"
                      // valid={!errors.customerName}
                      // invalid={touched.customerName && !!errors.customerName}
                      // autoFocus={true}
                      required
                      onChange={this.handleChange}
                      // onBlur={handleBlur}
                      value={this.state.supplierName}
                    />
                    <FormFeedback className="invalid" id="supplierNameError" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="supplierAddress">Supplier Address</Label>
                    <Input
                      type="text"
                      name="supplierAddress"
                      id="supplierAddress"
                      placeholder="Supplier Address"
                      autoComplete="family-name"
                      // valid={!errors.customerAddress}
                      // invalid={
                      //   touched.customerAddress && !!errors.customerAddress
                      // }
                      required
                      onChange={this.handleChange}
                      // onBlur={handleBlur}
                      value={this.state.supplierAddress}
                    />
                    <FormFeedback
                      className="invalid"
                      id="supplierAddressError"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="supplierContact">Supplier Contact</Label>
                    <Input
                      type="text"
                      name="supplierContact"
                      id="supplierContact"
                      placeholder="Supplier Contact"
                      // autoComplete="username"
                      // valid={!errors.customerContact}
                      // invalid={
                      //   touched.customerContact && !!errors.customerContact
                      // }
                      required
                      onChange={this.handleChange}
                      // onBlur={handleBlur}
                      value={this.state.supplierContact}
                    />
                    <FormFeedback
                      className="invalid"
                      id="supplierContactError"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      color="primary"
                      className="mr-1"
                      onClick={this.handleSubmit}
                      disabled={this.state.supplierId ? true : false}
                    >
                      {/* {isSubmitting ? "Wait..." : "Submit"} */}
                      Submit
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      className="mr-1"
                      onClick={this.handleUpdate}
                      disabled={!this.state.supplierId}
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
                    <h1>Total Suppliers: {this.state.suppliers.length}</h1>
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
                rowData={this.state.suppliers}
                columnDef={[
                  {
                    headerName: "Supplier Name",
                    field: "supplierName",
                    checkboxSelection: true,
                    editable: true
                  },
                  {
                    headerName: "Supplier Address",
                    field: "supplierAddress",
                    checkboxSelection: true,
                    editable: true
                  },
                  {
                    headerName: "Supplier Contact",
                    field: "supplierContact",
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

export default Supplier;

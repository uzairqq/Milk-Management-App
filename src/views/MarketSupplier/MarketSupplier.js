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

class MarketSupplier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marketSupplierId: 0,
      marketSupplierName: "",
      marketSupplierAddress: "",
      marketSupplierContact: "",
      marketSuppliers: [],
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
    Api.get("/MarketSupplier/all")
      .then(res => {
        const person = res.data;
        person.forEach(i => {
          i.handleDataForUpdate = this.handleDataForUpdate;
          i.handleDelete = this.handleDelete;
        });
        this.setState({ marketSuppliers: person });
        console.log(person);
      })
      .catch(error => console.log(error));
  }
  handleDataForUpdate(val) {
    this.setState({
      marketSupplierId: val.id,
      marketSupplierName: val.name,
      marketSupplierAddress: val.address,
      marketSupplierContact: val.contact
    });
  }
  handleIsEnabled() {
    const haveValues =
      this.state.marketSupplierName !== "" &&
      this.state.marketSupplierAddress !== "" &&
      this.state.marketSupplierContact !== "";
    return haveValues;
  }
  handleSubmit = e => {
    e.preventDefault();
    showFormErrors("input,select");

    const marketSupplier = {
      marketSupplierName: this.state.marketSupplierName,
      marketSupplierAddress: this.state.marketSupplierAddress,
      marketSupplierContact: this.state.marketSupplierContact
    };

    if (this.handleIsEnabled())
      Api.post(`/MarketSupplier`, { ...marketSupplier }).then(res => {
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
  };
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    showInputError(e.target);
  }

  handleRowsValuesInTextBox(e) {
    this.setState({
      marketSupplierId: e.id,
      marketSupplierName: e.name,
      marketSupplierAddress: e.address,
      marketSupplierContact: e.contact
    });
  }
  initialState() {
    this.setState({
      marketSupplierId: 0,
      marketSupplierName: "",
      marketSupplierContact: "",
      marketSupplierAddress: ""
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
        const marketSupplier = {
          id: this.state.marketSupplierId,
          marketSupplierName: this.state.marketSupplierName,
          marketSupplierAddress: this.state.marketSupplierAddress,
          marketSupplierContact: this.state.marketSupplierContact
        };
        Api.put(`/MarketSupplier`, { ...marketSupplier }).then(res => {
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
  handleDelete = marketSupplier => {
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
        Api.delete(`/MarketSupplier`, {
          data: marketSupplier
        }).then(res => {
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
            <strong>New Market Supplier</strong>
            <div className="card-header-actions" />
          </CardHeader>
          <CardBody>
            <hr />
            <Row>
              <Col lg="6">
                <Form
                  noValidate
                >
                  <FormGroup>
                    <Label for="marketSupplierName">Market Supplier Name</Label>
                    <Input
                      type="text"
                      name="marketSupplierName"
                      id="marketSupplierName"
                      placeholder="Market Supplier Name"
                      autoComplete="given-name"
                      required
                      onChange={this.handleChange}
                      value={this.state.marketSupplierName}
                    />
                    <FormFeedback className="invalid" id="marketSupplierNameError" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="marketSupplierAddress">Market Supplier Address</Label>
                    <Input
                      type="text"
                      name="marketSupplierAddress"
                      id="marketSupplierAddress"
                      placeholder="Market Supplier Address"
                      autoComplete="family-name"
                      required
                      onChange={this.handleChange}
                      value={this.state.marketSupplierAddress}
                    />
                    <FormFeedback
                      className="invalid"
                      id="marketSupplierAddressError"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="marketSupplierContact">Market Supplier Contact</Label>
                    <Input
                      type="text"
                      name="marketSupplierContact"
                      id="marketSupplierContact"
                      placeholder="Market Supplier Contact"
                      required
                      onChange={this.handleChange}
                      value={this.state.marketSupplierContact}
                    />
                    <FormFeedback
                      className="invalid"
                      id="marketSupplierContactError"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      color="primary"
                      className="mr-1"
                      onClick={this.handleSubmit}
                      disabled={this.state.marketSupplierId}
                    >
                      Submit
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      className="mr-1"
                      onClick={this.handleUpdate}
                      disabled={!this.state.marketSupplierId}
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
                    <h1>Total Suppliers: {this.state.marketSuppliers.length}</h1>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <hr />
            {this.state.gridVisible ? (
              <Grid
                rowData={this.state.marketSuppliers}
                columnDef={[
                  {
                    headerName: "Supplier Name",
                    field: "marketSupplierName",
                    checkboxSelection: true,
                    editable: true
                  },
                  {
                    headerName: "Supplier Address",
                    field: "marketSupplierAddress",
                    checkboxSelection: true,
                    editable: true
                  },
                  {
                    headerName: "Supplier Contact",
                    field: "marketSupplier",
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

export default MarketSupplier;

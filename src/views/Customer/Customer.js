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
import * as Yup from "yup";
import "../Customer/Customer.css";
import Grid from "../Components/Grid";
import Api from "../../utils/BaseUrl";

class Customer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: []
    };
    this.handleDataForUpdate = this.handleDataForUpdate.bind(this);
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
      })
      .catch(error => console.log(error));
  }
  handleDataForUpdate(val) {
    this.setState({
      id: val.id,
      customerTypeId: val.customerTypeId,
      customerType: val.type,
      customerName: val.name,
      customerAddress: val.address,
      customerContact: val.contact
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
                <Form
                  // onSubmit={this.handleSubmit}
                  noValidate
                >
                  <FormGroup>
                    <Label for="customerType">Customer Type</Label>
                    <Input
                      type="select"
                      name="customerType"
                      id="customerType"
                      autoComplete="given-name"
                      // valid={!errors.customerType}
                      // invalid={touched.customerType && !!errors.customerType}
                      autoFocus={true}
                      required
                      onChange={this.handleChange}
                      // onBlur={handleBlur}
                      value={this.state.customerType}
                    >
                      <option value="">--Please Select--</option>
                      <option value="1">Daily</option>
                      <option value="2">Weekly</option>
                    </Input>
                    <FormFeedback>{this.state.customerType}</FormFeedback>
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
                    <FormFeedback>{this.state.customerName}</FormFeedback>
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
                    <FormFeedback>{this.state.customerAddress}</FormFeedback>
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
                    <FormFeedback>{this.state.customerContact}</FormFeedback>
                  </FormGroup>
                  <FormGroup>
                    <Button
                      type="submit"
                      color="primary"
                      className="mr-1"
                      // disabled={isSubmitting || !isValid}
                    >
                      {/* {isSubmitting ? "Wait..." : "Submit"} */}
                      Submmit
                    </Button>
                    <Button
                      type="submit"
                      color="secondary"
                      className="mr-1"
                      // disabled={!values.id}
                    >
                      {/* {isSubmitting ? "Wait..." : "Update"} */}
                      Update
                    </Button>
                    <Button
                      type="button"
                      color="success"
                      className="mr-1"
                      // onClick={() => this.touchAll(setTouched, errors)}
                      // disabled={isValid}
                    >
                      Validate
                    </Button>
                    <Button
                      type="reset"
                      color="danger"
                      className="mr-1"
                      // onClick={handleReset}
                    >
                      Reset
                    </Button>
                  </FormGroup>
                </Form>
              </Col>
              <Col lg="6">
                <Card /*className={isValid ? "bg-info" : "bg-secondary"}*/>
                  <CardBody>
                    {/* <pre>values: {JSON.stringify(values, null, 2)}</pre> */}
                    {/* <pre>errors: {JSON.stringify(errors, null, 2)}</pre> */}
                    {/* <pre>touched: {JSON.stringify(touched, null, 2)}</pre> */}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <hr />
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
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Customer;

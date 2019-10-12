import React, { Component } from "react";
import {
  Form,
  FormGroup,
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Label,
  Input
} from "reactstrap";

class Ledger extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
            <i className="icon-note" />
            <strong>Complete Ledger</strong>
          </CardHeader>
          <CardBody>
            <Form form="true">
              <Col lg="4">
                <FormGroup>
                  <Label for="selectedDate">Select Date:</Label>
                  <Input
                    type="date"
                    name="selectedDate"
                    id="selectedDate"
                    placeholder="Select Date"
                    // onChange={this.handleSelectedDate}
                    // value={this.state.selectedDate}
                    autoComplete="given-name"
                    required
                  />
                </FormGroup>
              </Col>
              <hr />
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="totalCustomerIncome">
                      <strong>Total Customers Income:</strong> 40,000/=
                    </Label>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="totalCustomerIncome">
                      <strong>Total Income:</strong> 40,000/=
                    </Label>
                  </FormGroup>
                </Col>
              </Row>

              <Col lg="6">
                <FormGroup>
                  <Label for="totalDailyHotelIcome">
                    <strong>Total Daily Hotel Income:</strong> 35,000/=
                  </Label>
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <Label for="totalWeekHotelIncome">
                    <strong>Total Weekly Hotel Income:</strong> 5,000/=
                  </Label>
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <Label for="totalSupplierPayment">
                    <strong>Total Supplier Payment:</strong> 90,000/=
                  </Label>
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <Label for="totalExpense">
                    <strong>Total Expenses:</strong> 10,000/=
                  </Label>
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <Label for="totalMarketPurchasePayment">
                    <strong>Total Market Purhcase Payment:</strong> 34,000/=
                  </Label>
                </FormGroup>
              </Col>
              <Col lg="6">
                <FormGroup>
                  <Label for="totalMarketPurchasePayment">
                    <strong>Total Market Sell:</strong> 23,000/=
                  </Label>
                </FormGroup>
              </Col>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default Ledger;

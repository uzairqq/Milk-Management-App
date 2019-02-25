import React from "react";
import { Card, CardTitle, CardText, Label } from "reactstrap";

const CardComponent = props => {
  return (
    <Card body inverse color="primary">
      <CardTitle>Total Suppliers</CardTitle>
      <Label color="secondary">5</Label>
    </Card>
  );
};
export default CardComponent;

import React from "react";
import { Container, Form, FormGroup, Label, Input } from "reactstrap";

const ThreeInputComponent = props => {
  return (
    <Container>
      <Form method="post" noValidate={true}>
        <FormGroup row={true}>
          <Label sm={2} for={props.name}>
            {props.children}
          </Label>
          <Input type="text" name={props.name} id={props.name} required />
        </FormGroup>
      </Form>
    </Container>
  );
};

export default ThreeInputComponent;

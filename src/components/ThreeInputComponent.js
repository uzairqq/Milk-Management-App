import React from "react";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Col,
  Card,
  CardBody
} from "reactstrap";
import InputFeilds from "./InputFeilds";
import ButtonComponent from "./Button";

const ThreeInputComponent = props => {
  return (
    <Card>
      <CardBody sm={5}>
        <Form noValidate={true}>
          <FormGroup row>
            <Col sm={6}>
              <InputFeilds
                title={props.titlename}
                placeholder={props.placeholdername}
                inputtype={props.inputtype}
                name={props.name}
                value={props.valuename}
                handlechange={props.handlechangename}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={6}>
              <InputFeilds
                inputtype={props.inputtype}
                title={props.titlecontact}
                name={props.contact}
                placeholder={props.placeholdercontact}
                value={props.valuecontact}
                handlechange={props.handlechangecontact}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Col sm={6}>
              <InputFeilds
                inputtype={props.inputtype}
                title={props.titleaddress}
                name={props.address}
                value={props.valueaddress}
                placeholder={props.placeholderaddress}
                handlechange={props.handlechangeaddress}
              />
            </Col>
          </FormGroup>

          <ButtonComponent
            action={props.buttonsaveaction}
            title={props.buttonsavetitle}
            class={props.buttonsaveclass}
            disable={props.buttonsavedisabled}
          />
          <ButtonComponent
            action={props.buttonupdateaction}
            title={props.buttonupdatetitle}
            class={props.buttonupdateclass}
            disable={props.buttonupdatedisable}
          />
          <ButtonComponent
            action={props.buttonclearaction}
            title={props.buttoncleartitle}
            class={props.buttonclearclass}
          />
        </Form>
      </CardBody>
    </Card>
  );
};

export default ThreeInputComponent;

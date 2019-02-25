import React from "react";
import {
  Container,
  Form,
  FormGroup,
  Label,
  Col,
  Card,
  CardBody,
  Button
} from "reactstrap";
import InputFeilds from "./InputFeilds";
import ButtonComponent from "./Button";

const ThreeInputComponent = props => {
  return (
    <Card body outline color="warning">
      <CardBody sm={5}>
        <Form noValidate={true}>
          <FormGroup row>
            <Col sm={{ size: 6, order: 5, offset: 3 }}>
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
            <Col sm={{ size: 6, order: 5, offset: 3 }}>
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
            <Col sm={{ size: 6, order: 5, offset: 3 }}>
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
          <FormGroup row>
            <Col sm={{ size: 6, order: 5, offset: 3 }}>
              <ButtonComponent
                action={props.buttonsaveaction}
                title={props.buttonsavetitle}
                class={props.buttonsaveclass}
                disable={props.buttonsavedisabled}
                size={props.buttonsavesize}
              />{" "}
              <ButtonComponent
                action={props.buttonupdateaction}
                title={props.buttonupdatetitle}
                class={props.buttonupdateclass}
                disable={props.buttonupdatedisable}
                size={props.buttonupdatesize}
              />{" "}
              <ButtonComponent
                action={props.buttonclearaction}
                title={props.buttoncleartitle}
                class={props.buttonclearclass}
                size={props.buttonclearsize}
              />{" "}
              <ButtonComponent
                action={props.buttonshowgridaction}
                title={props.buttonshowgridtitle}
                class={props.buttonshowgridclass}
                size={props.buttonshowgridsize}
              />
            </Col>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};

export default ThreeInputComponent;

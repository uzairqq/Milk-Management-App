import React from "react";
import { FormGroup, Label, Input, FormFeedback } from "reactstrap";

const InputFeilds = props => {
  return (
    <FormGroup>
      <Label for={props.name}>{props.title}</Label>
      <Input
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        id={props.name}
        value={props.value}
        onChange={props.handlechange}
        required={props.required}
      />
      <FormFeedback className="invalid" id={props.name + "Error"} />
    </FormGroup>
  );
};

export default InputFeilds;

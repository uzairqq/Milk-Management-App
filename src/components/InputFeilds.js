import React from "react";
import { FormGroup, Label, Input } from "reactstrap";

const InputFeilds = props => {
  return (
    <FormGroup>
      <Label htmlFor={props.name}>{props.title}</Label>
      <Input
        className="form-input"
        name={props.name}
        type={props.type}
        placeholder={props.placeholder}
        id={props.name}
        value={props.value}
        onChange={props.handlechange}
      />
    </FormGroup>
  );
};

export default InputFeilds;

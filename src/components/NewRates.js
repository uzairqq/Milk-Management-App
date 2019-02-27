import React from "react";
import { Container } from "reactstrap";
import SelectComponent from "./SelectComponent";

const NewRates = props => {
  console.log("New Rates:", props);
  return (
    <div>
      <SelectComponent
        // title={props.title}
        // name={props.name}
        options={props.dropdownValue}
        // value={props.value}
        // placeholder={props.placeholder}
        // handleChange={props.handleChange}
      />{" "}
    </div>
  );
};

export default NewRates;

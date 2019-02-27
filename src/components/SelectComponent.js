import React from "react";
import { Select } from "reactstrap";

const SelectComponent = props => {
  return (
    <div className="form-group">
      <label for={props.name}> {props.title} </label>
      {/* <select
        id={props.name}
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
        className="form-control"
      >
        <option value="" disabled>
          {props.placeholder}
        </option>
        {props.options.map(option => {
          return (
            <option key={option} value={option} label={option}>
              {option}
            </option>
          );
        })}
      </select> */}
      <select
        // id={props.name}
        // name={props.name}
        // value={props.value}
        customersDropDown={props.options}
        // onChange={props.handleChange}
        // className="form-control"
      >
        {props.customersDropDown.map(function(data, key) {
          return (
            <option key={key} value={data.customerId}>
              {data.customerName}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SelectComponent;

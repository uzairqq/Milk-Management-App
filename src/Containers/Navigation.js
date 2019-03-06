import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
  return (
    <div>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/newCustomer">New Customer</NavLink>
      <NavLink to="/customerRates">Customer Rates</NavLink>
      <NavLink to="/customerSupplied">Customer Supplied</NavLink>
    </div>
  );
};

export default Navigation;

import React from "react";
import DefaultLayout from "./containers/DefaultLayout";

const Dashboard = React.lazy(() => import("./views/Dashboard"));
const Customer = React.lazy(() => import("./views/Customer/Customer"));
const CustomerRates = React.lazy(() =>
  import("./views/CustomerRates/CustomerRates")
);
const CustomerSupplied = React.lazy(() =>
  import("./views/CustomerSupplied/CustomerSupplied")
);

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: "/", name: "Home", component: DefaultLayout, exact: true },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/customer", name: "Customer", component: Customer },
  { path: "/customerRates", name: "Customer Rates", component: CustomerRates },
  {
    path: "/customerSupplied",
    name: "Customer Supplied",
    component: CustomerSupplied
  }
];

export default routes;

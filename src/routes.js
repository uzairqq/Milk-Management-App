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
const Supplier = React.lazy(() => import("./views/Supplier/Supplier"));
const SupplierRates = React.lazy(() =>
  import("./views/SupplierRates/SupplierRates")
);
const SupplierSupplied = React.lazy(() =>
  import("./views/SupplierSupplied/SupplierSupplied")
);
const Expense = React.lazy(() => import("./views/Expense/Expense"));
const DailyExpense = React.lazy(() =>
  import("./views/DailyExpense/DailyExpense")
);
const MarketSell = React.lazy(() => import("./views/MarketSell/MarketSell"));
const MarketPurchase = React.lazy(() =>
  import("./views/MarketPurchase/MarketPurchase")
);
const MarketSupplier = React.lazy(() =>
  import("./views/MarketSupplier/MarketSupplier")
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
  },
  { path: "/supplier", name: "Supplier", component: Supplier },
  { path: "/supplierRates", name: "Supplier Rates", component: SupplierRates },
  {
    path: "/supplierSupplied",
    name: "Supplier Supplied",
    component: SupplierSupplied
  },
  {
    path: "/expense",
    name: "Expense",
    component: Expense
  },
  {
    path: "/dailyExpense",
    name: "Daily Expense",
    component: DailyExpense
  },
  {
    path: "/marketSell",
    name: "Market Sell",
    component: MarketSell
  },
  {
    path: "/marketPurchase",
    name: "Market Purchase",
    component: MarketPurchase
  },
  {
    path: "/marketSupplier",
    name: "Market Supplier",
    component: MarketSupplier
  }
];

export default routes;

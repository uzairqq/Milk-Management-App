import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
// import Supplier from "./Containers/Supplier";
// import CustomerRates from "./Containers/CustomerRates";
// import Customer from "./Containers/Customer";
import CustomerSupplied from "./Containers/CustomerSupplied";

ReactDOM.render(<CustomerSupplied />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

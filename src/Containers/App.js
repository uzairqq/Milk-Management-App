import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "../Containers/Home";
import Customer from "../Containers/Customer";
import ErrorComponent from "../Components/Error";
import Navigation from "../Containers/Navigation";
import CustomerRates from "./CustomerRates";
import CustomerSupplied from "./CustomerSupplied";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Navigation />
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/newCustomer" component={Customer} />
            <Route path="/customerRates" component={CustomerRates} />
            <Route path="/customerSupplied" component={CustomerSupplied} />
            <Route component={ErrorComponent} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
export default App;

import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "../Containers/Home";
import Customer from "../Containers/Customer";
import ErrorComponent from "../Components/Error";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/newCustomer" component={Customer} />
          <Route component={ErrorComponent} />
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;

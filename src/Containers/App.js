import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "../Containers/Home";
import Customer from "../Containers/Customer";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route path="/" component={Home} exact />
          <Route path="/newCustomer" component={Customer} />
        </div>
      </BrowserRouter>
    );
  }
}
export default App;

import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";

const TestingComponent = () => {
  return (
    <div>
      <h1>New Testing Component</h1>
    </div>
  );
};

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route path="/new" component={TestingComponent} />
      </BrowserRouter>
    );
  }
}
export default App;

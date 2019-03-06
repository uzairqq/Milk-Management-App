import React from "react";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";
import Customer from "./Customer";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CustomerRates from "./CustomerRates";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import HomeComponent from "./Home";
import CustomerSupplied from "./CustomerSupplied";
import Supplier from "./Supplier";
import ErrorComponent from "../Components/Error";

const Navigation = () => {
  return (
    <BrowserRouter>
      <Route
        render={({ location, history }) => (
          <React.Fragment>
            <SideNav
              onSelect={selected => {
                const to = "" + selected;
                if (location.pathname !== to) {
                  history.push(to);
                }
              }}
            >
              <SideNav.Toggle />
              <SideNav.Nav defaultSelected="/">
                <NavItem eventKey="/">
                  <NavIcon>
                    <i className="fa fa-home" style={{ fontSize: "1.75em" }} />
                  </NavIcon>
                  <NavText>Home</NavText>
                </NavItem>
                <NavItem eventKey="customer">
                  <NavIcon>
                    <i
                      className="fa fa-fw fa-line-chart"
                      style={{ fontSize: "1.75em" }}
                    />
                  </NavIcon>
                  <NavText>Customer</NavText>
                  <NavItem eventKey="/newCustomer">
                    <NavText>New Customer</NavText>
                  </NavItem>
                  <NavItem eventKey="/customerRates">
                    <NavText>Customer Rates</NavText>
                  </NavItem>
                  <NavItem eventKey="/customerSupplied">
                    <NavText>Customer Supplied</NavText>
                  </NavItem>
                </NavItem>
                <NavItem eventKey="supplier">
                  <NavIcon>
                    <i className="fa fa-truck" style={{ fontSize: "1.75em" }} />
                  </NavIcon>
                  <NavText>Supplier</NavText>
                  <NavItem eventKey="/newSupplier">
                    <NavText>New Supplier</NavText>
                  </NavItem>
                </NavItem>
              </SideNav.Nav>
            </SideNav>
            <main>
              <Switch>
                <Route path="/" exact component={props => <HomeComponent />} />
                <Route path="/newCustomer" component={props => <Customer />} />
                <Route
                  path="/customerRates"
                  component={props => <CustomerRates />}
                />
                <Route
                  path="/customerSupplied"
                  component={props => <CustomerSupplied />}
                />
                <Route path="/newSupplier" component={props => <Supplier />} />
                <Route component={ErrorComponent} />
              </Switch>
            </main>
          </React.Fragment>
        )}
      />
    </BrowserRouter>

    /* <NavLink to="/">Home</NavLink>
      <NavLink to="/newCustomer">New Customer</NavLink>
      <NavLink to="/customerRates">Customer Rates</NavLink>
      <NavLink to="/customerSupplied">Customer Supplied</NavLink> */
  );
};

export default Navigation;

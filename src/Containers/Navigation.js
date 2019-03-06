import React from "react";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";
import Customer from "./Customer";
import { BrowserRouter, Route } from "react-router-dom";
import CustomerRates from "./CustomerRates";

// Be sure to include styles at some point, probably during your bootstraping
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import HomeComponent from "./Home";

const Navigation = () => {
  return (
    <BrowserRouter>
      <Route
        render={({ location, history }) => (
          <React.Fragment>
            <SideNav
              onToggle={false}
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
                <NavItem eventKey="charts">
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
                </NavItem>
              </SideNav.Nav>
            </SideNav>
            <main>
              <Route path="/" exact component={props => <HomeComponent />} />
              <Route path="/newCustomer" component={props => <Customer />} />
              <Route
                path="/customerRates"
                component={props => <CustomerRates />}
              />
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

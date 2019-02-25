import React, { Component } from "react";
import axios from "axios";
import { Container } from "reactstrap";
import Grid from "../Components/Grid";
import Swal from "sweetalert2";
import { showFormErrors, showInputError } from "../utils/Validation";
import ThreeInputComponent from "../Components/ThreeInputComponent";

class Supplier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: {
        name: "",
        contact: "",
        address: ""
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDataForUpdate = this.handleDataForUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.loadData();
  }
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    showInputError(e.target);
  }
  handleDataForUpdate(val) {
    this.setState({
      newUser: {
        name: val.supplierName,
        contact: val.supplierContact,
        address: val.supplierAddress
      }
    });
  }
  handleIsEnabled() {
    if (
      this.state.newUser.name === "" &&
      this.state.newUser.address === "" &&
      this.state.newUser.contact === ""
    )
      return false;
    else {
      return true;
    }
  }

  loadData() {
    fetch("http://localhost:56996/api/Supplier/all")
      .then(result => result.json())
      .then(suppliers => {
        suppliers.forEach(i => {
          i.handleDataForUpdate = this.handleDataForUpdate;
          i.handleDelete = this.handleDelete;
        });
        this.setState({ suppliers });
        console.log(suppliers);
      });
  }
  initialState() {
    this.setState({
      name: "",
      contact: "",
      address: ""
    });
  }
  handleSubmit = e => {
    e.preventDefault();
    // showFormErrors("#root > div > form > div > div > input,select");

    showFormErrors("#root > div > div.card > div > form > div:nth-child(1)");

    // console.log("Component state:", JSON.stringify(this.state));
    const customer = {
      SupplierName: this.state.newUser.name,
      SupplierContact: this.state.newUser.contact,
      SupplierAddress: this.state.newUser.address
    };

    if (this.handleIsEnabled())
      axios
        .post(`http://localhost:56996/api/Supplier`, { ...customer })
        .then(res => {
          this.loadData();
          this.initialState();
          console.log(res);
          console.log(res.data);

          if (res.data.success) {
            Swal.fire({
              position: "top-end",
              type: "success",
              title: res.data.successMessage,
              showConfirmButton: false,
              timer: 1500
            });
          } else {
            Swal.fire({
              position: "top-end",
              type: "error",
              title: res.data.failureMessage,
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
  };
  handleUpdate(e) {
    e.preventDefault();
    console.log("update clicked");
  }
  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      newUser: {
        name: "",
        contact: "",
        address: ""
      }
    });
  }

  handleClearForm(e) {
    e.preventDefault();
    console.log("clear form clicked");
  }
  handleInput(e) {
    let value = e.target.value;
    let name = e.target.name;

    this.setState(
      prevState => {
        return {
          newUser: {
            ...prevState.newUser,
            [name]: value
          }
        };
      },
      () => console.log(this.state.newUser)
    );
    this.setState({ [e.target.name]: e.target.value });
    showInputError(e.target);
  }
  render() {
    return (
      <Container>
        <h1>Add New Supplier</h1>
        <ThreeInputComponent
          titlename={"Supplier Name"}
          placeholdername={"Enter Supplier Name"}
          inputtype={"text"}
          name={"name"}
          valuename={this.state.newUser.name}
          handlechangename={this.handleInput}
          //
          titlecontact={"Supplier Contact"}
          contact={"contact"}
          valuecontact={this.state.newUser.contact}
          placeholdercontact={"Enter your Supplier Contact"}
          handlechangecontact={this.handleInput}
          //
          titleaddress={"Supplier Address"}
          address={"address"}
          valueaddress={this.state.newUser.address}
          placeholderaddress={"Enter your Address"}
          handlechangeaddress={this.handleInput}
          //
          buttonsavetitle={"Save"}
          buttonsaveaction={this.handleSubmit}
          buttonsaveclass={"btn btn-success"}
          //
          buttonupdatetitle={"Update"}
          buttonupdateaction={this.handleUpdate}
          buttonupdateclass={"btn btn-primary"}
          //
          buttoncleartitle={"Clear"}
          buttonclearaction={this.handleClearForm}
          buttonclearclass={"btn btn-danger"}
        />
        <Grid
          rowData={this.state.suppliers}
          columnDef={[
            {
              headerName: "Id",
              field: "id",
              checkboxSelection: true,
              editable: true
            },
            {
              headerName: "Supplier Name",
              field: "supplierName",
              checkboxSelection: true,
              editable: true
            },
            {
              headerName: "Supplier Address",
              field: "supplierAddress",
              checkboxSelection: true,
              editable: true
            },
            {
              headerName: "Supplier Contact",
              field: "supplierContact",
              checkboxSelection: true,
              editable: true
            },
            {
              headerName: "Actions",
              field: "value",
              cellRenderer: "childMessageRenderer",
              colId: "params",
              width: 180,
              editable: false
            }
          ]}
        />
      </Container>
    );
  }
}

export default Supplier;

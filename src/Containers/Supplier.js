import React, { Component } from "react";
import axios from "axios";
import {
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  FormFeedback,
  Col
} from "reactstrap";
import Grid from "../Components/Grid";
import Swal from "sweetalert2";
import { showFormErrors, showInputError } from "../utils/Validation";
import ThreeInputComponent from "../Components/ThreeInputComponent";

class Supplier extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Container>
        <ThreeInputComponent name={this.props.CustomerName} />
      </Container>
    );
  }
}

export default Supplier;

import React, { Component } from "react";

export default class ChildMessageRenderer extends Component {
  constructor(props) {
    super(props);

    this.GetRowDataMethod = this.GetRowDataMethod.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  GetRowDataMethod() {
    const selectedData = this.props.data;
    console.log("Render", selectedData);
    this.props.data.handleDataForUpdate(selectedData);
  }

  handleDelete() {
    const selectedData = this.props.data;
    this.props.data.handleDelete(selectedData);
  }

  render() {
    return (
      <span>
        <button
          style={{ height: 20, lineHeight: 0.5 }}
          onClick={this.GetRowDataMethod.bind(this)}
          className="btn btn-info"
        >
          Edit
        </button>{" "}
        ||{" "}
        <button
          style={{ height: 20, lineHeight: 0.5 }}
          onClick={this.handleDelete}
          className="btn btn-danger"
        >
          Delete
        </button>
      </span>
    );
  }
}

import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "../Containers/App.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-blue.css";

class Grid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // rowDat: this.props.gridData,
      columnDefs: [
        {
          headerName: "Make",
          field: "make",
          checkboxSelection: true
        },
        {
          headerName: "Model",
          field: "model",
          checkboxSelection: true
        },
        {
          headerName: "Price",
          field: "price",
          checkboxSelection: true
        }
      ]
      // rowData: [
      //   { make: "Toyota", model: "Celica", price: 35000 },
      //   { make: "Ford", model: "Mondeo", price: 32000 },
      //   { make: "Porsche", model: "Boxter", price: 72000 }
      // ]
    };
  }
  componentDidMount() {
    fetch("https://api.myjson.com/bins/ly7d1")
      .then(result => result.json())
      .then(rowData => this.setState({ rowData }));
  }
  onButtonClick = e => {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData
      .map(node => node.make + " " + node.model + " " + node.price)
      .join(", ");
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  };

  render() {
    return (
      <div
        style={{ height: "200px", width: "1150px" }}
        className="ag-theme-blue"
      >
        <button onClick={this.onButtonClick}>Get selected rows</button>
        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
          enableSorting={true}
          enableFilter={true}
          pagination={true}
          // paginationPageSize={this.statexxxpaginationPageSize}
          paginationAutoPageSize={true}
          rowSelection="multiple"
          onGridReady={params => (this.gridApi = params.api)}
        />
      </div>
    );
  }
}

export default Grid;

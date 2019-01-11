import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-enterprise";

class Grid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { headerName: "Make", field: "make", checkboxSelection: true },
        { headerName: "Model", field: "model" },
        { headerName: "Price", field: "price" },
        { headerName: "Actions", feild: "action" }
      ]
      //   rowData: [
      //     { make: "Toyota", model: "Celica", price: 35000 },
      //     { make: "Ford", model: "Mondeo", price: 32000 },
      //     { make: "Porsche", model: "Boxter", price: 72000 }
      //   ]
      ////ONLY FOR GROUPING
      //   columnDefs: [
      //     { headerName: "Make", field: "make", rowGroupIndex: 0 },
      //     { headerName: "Price", field: "price" }
      //   ],
      ////ONLY FOR GROUPING
      //   autoGroupColumnDef: {
      //     headerName: "Model",
      //     field: "model",
      //     cellRenderer: "agGroupCellRenderer",
      //     cellRendererParams: {
      //       checkbox: true
      //     }
      //   }
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
      .map(node => node.make + " " + node.model)
      .join(", ");
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  };

  render() {
    return (
      <div
        style={{ height: "150px", width: "600px" }}
        className="ag-theme-balham"
      >
        <button onClick={this.onButtonClick}>Get selected rows</button>
        <AgGridReact
          enableSorting={true}
          enableFilter={true}
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
          rowSelection="multiple"
          onGridReady={params => (this.gridApi = params.api)}
        />
      </div>
    );
  }
}

export default Grid;

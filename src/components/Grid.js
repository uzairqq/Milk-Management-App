import React, { Component } from "react";
import { AgGridReact } from "ag-grid-react";
import "../Containers/App.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-blue.css";
import ChildMessageRenderer from "../Components/childMessageRenderer";

class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      context: { componentParent: this },
      frameworkComponents: {
        childMessageRenderer: ChildMessageRenderer
      }
    };
  }
  methodFromParent(cell) {
    alert("Parent Component Method from " + cell + "!");
  }
  onButtonClick = e => {
    const selectedNodes = this.gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map(node => node.data);
    const selectedDataStringPresentation = selectedData
      .map(node => node.make + " " + node.model + " " + node.price)
      .join(", ");
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  };
  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    console.log(selectedData);
    // const res = this.gridApi.updateRowData({ remove: selectedData });
  }
  // GetName(val) {
  //   console.log(val);
  // }
  render() {
    return (
      <div
        style={{ height: "200px", width: "1150px" }}
        className="ag-theme-blue"
      >
        {/* <button onClick={this.onButtonClick}>Get selected rows</button> */}
        <button onClick={this.onRemoveSelected.bind(this)}>
          Remove Selected
        </button>
        <AgGridReact
          columnDefs={this.props.columnDef}
          rowData={this.props.rowData}
          enableSorting={true}
          enableFilter={true}
          pagination={true}
          context={this.state.context}
          frameworkComponents={this.state.frameworkComponents}
          paginationAutoPageSize={true}
          rowSelection="multiple"
          onGridReady={params => (this.gridApi = params.api)}
        />
      </div>
    );
  }
}

export default Grid;

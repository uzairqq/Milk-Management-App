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
  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    console.log(selectedData);
  }
  render() {
    return (
      <div
        style={{ height: "300px", width: "1110px" }}
        className="ag-theme-blue"
      >
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

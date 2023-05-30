import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { Icon } from "@material-ui/core";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";

export const TableButton = (props) => {
  // console.log(props);
  return (
    <div
      style={
        props.data.buttonText
          ? {
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }
          : {}
      }
    >
      {props.data.buttonText && (
        <button
          onClick={() => {
            if (props?.data?.buttonAction) {
              props?.data?.buttonAction();
            } else if (props?.context) {
              props.context.methodFromParent(props);
            }
          }}
        >
          {props.data.buttonText}
        </button>
      )}
      {props?.colDef?.field == "edit" && (
        <Icon
          style={{ cursor: "pointer" }}
          color="primary"
          onClick={() => {
            if (props?.data?.buttonAction) {
              props?.data?.buttonAction();
            } else if (props?.context) {
              props.context.methodFromParent(props);
            }
          }}
        >
          create
        </Icon>
      )}
      {props?.colDef?.field == "delete" && (
        <Icon
          style={{ cursor: "pointer" }}
          color="secondary"
          onClick={() => {
            if (props?.data?.buttonAction) {
              props?.data?.buttonAction();
            } else if (props?.context) {
              props.context.methodFromParent(props);
            }
          }}
        >
          delete
        </Icon>
      )}
    </div>
  );
};

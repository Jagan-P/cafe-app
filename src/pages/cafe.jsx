import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
import { TableButton } from "../components/TableButton";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";

export const Cafe = () => {
  const [rowData, setRowData] = useState([]);
  const navigate = useNavigate();
  const gridRef = useRef();
  const buttonAction = function (data) {
    setModalOpen(true);
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    state: false,
    data: {},
  });
  const descriptionElementRef = React.useRef(null);
  const pinnedTopRowData = [
    {
      fullWidth: true,
      buttonAction: buttonAction,
      buttonText: "Add Cafe",
    },
  ];
  const fullWidthCellRenderer = TableButton;
  const [columnDefs] = useState([
    { field: "name", maxWidth: 1000 },
    { field: "description", maxWidth: 1000 },
    { field: "location", filter: true, maxWidth: 1000 },
    { field: "employees", maxWidth: 1000 },
    // { field: "days_worked" },
    // { field: "cafe" },
    { field: "edit", cellRenderer: TableButton, maxWidth: 50, headerName: "" },
    {
      field: "delete",
      cellRenderer: TableButton,
      maxWidth: 50,
      headerName: "",
    },
  ]);
  const addEditCafe = async () => {
    try {
      if (!cafeForm._id) {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/cafe`, cafeForm);
      } else {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/cafe/${cafeForm._id}`, cafeForm);
      }
      cancel();
      apiCalls();
    } catch (err) {}
  };
  const methodFromParent = (dataFromChild) => {
    console.log(dataFromChild);
    if (dataFromChild.colDef.field == "edit") {
      setCafeForm(dataFromChild.data);
      setModalOpen(true);
    }
    if (dataFromChild.colDef.field == "delete") {
      setDeleteModal({
        state: true,
        data: dataFromChild.data,
      });
    }
  };

  const cancel = () => {
    setCafeForm({
      name: "",
      email_address: "",
      phone_number: "",
      gender: "male",
    });
    setModalOpen(false);
  };
  const [cafeForm, setCafeForm] = useState({
    name: "",
    email_address: "",
    phone_number: "",
    gender: "male",
  });

  const isFullWidthRow = useCallback((params) => {
    return params.rowNode.data.fullWidth;
  }, []);

  const apiCalls = async () => {
    try {
      let cafesData = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cafes`);
      setRowData([...cafesData.data.cafes]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    apiCalls();
  }, []);

  return (
    <>
      <div
        className="ag-theme-alpine"
        style={{ height: "100%", width: "100%" }}
      >
        <AgGridReact
          rowHeight={60}
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          pinnedTopRowData={pinnedTopRowData}
          isFullWidthRow={isFullWidthRow}
          fullWidthCellRenderer={fullWidthCellRenderer}
          context={{
            methodFromParent,
          }}
          onCellClicked={(event) => {
            if (event.colDef.field == "employees") {
              navigate(`/employees?cafe=${event.data._id}`);
            }
          }}
          onFirstDataRendered={(params) => {
            let gridWidth =
              params?.api?.gridBodyCtrl?.eBodyViewport?.clientWidth;
            let totalColumnsWidth = 0;
            for (let col of params?.columnApi?.columnModel?.viewportColumns) {
              totalColumnsWidth += col.actualWidth;
            }
            if (totalColumnsWidth < gridWidth) {
              gridRef.current.api.sizeColumnsToFit();
            }
          }}
        ></AgGridReact>
      </div>

      <Dialog
        open={modalOpen}
        onClose={cancel}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Add/Edit cafe</DialogTitle>
        <DialogContent dividers={true}>
          {/* <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          > */}
          <form noValidate autoComplete="off">
            <div>
              <TextField
                required
                label="Name"
                value={cafeForm.name}
                onChange={(event) => {
                  setCafeForm({
                    ...cafeForm,
                    name: event.target.value,
                  });
                }}
              />
            </div>
            <div>
              <TextField
                required
                label="Description"
                value={cafeForm.description}
                onChange={(event) => {
                  setCafeForm({
                    ...cafeForm,
                    description: event.target.value,
                  });
                }}
              />
            </div>
            <div>
              <TextField
                required
                label="Location"
                value={cafeForm.location}
                onChange={(event) => {
                  setCafeForm({
                    ...cafeForm,
                    location: event.target.value,
                  });
                }}
              />
            </div>
            {/* <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={cafeForm.gender}
                onChange={(event) => {
                  setCafeForm({
                    ...cafeForm,
                    gender: event.target.value,
                  });
                }}
              >
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
              </RadioGroup>
            </FormControl> */}
          </form>
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel} color="primary">
            Cancel
          </Button>
          <Button onClick={addEditCafe} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteModal.state}
        onClose={() => {
          setDeleteModal({ state: false, data: {} });
        }}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Confirm to Delete</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            Are you sure you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteModal({
                state: false,
                data: {},
              });
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await axios.delete(
                `${process.env.REACT_APP_BACKEND_URL}/cafe/${deleteModal.data._id}`
              );
              apiCalls();
              setDeleteModal({
                state: false,
                data: {},
              });
            }}
            color="primary"
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

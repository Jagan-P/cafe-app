import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { useLocation } from "react-router-dom";

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
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@material-ui/core";

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export const Employee = () => {
  let query = useQuery();
  const gridRef = useRef();
  const [rowData, setRowData] = useState([]);
  const [cafesList, setCafesList] = useState([]);
  //   const cafeIdDetailsMap = useRef({});
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
      buttonText: "Add Employee",
    },
  ];
  const fullWidthCellRenderer = TableButton;
  const [columnDefs] = useState([
    { field: "name" },
    { field: "gender" },
    { field: "email_address" },
    { field: "phone_number" },
    { field: "days_worked" },
    {
      headerName: "Cafe name",
      valueGetter: (params) => {
        // console.log(param);
        return params?.data?.cafe?.name;
      },
    },
    { field: "edit", cellRenderer: TableButton, maxWidth: 50, headerName: "" },
    {
      field: "delete",
      cellRenderer: TableButton,
      maxWidth: 50,
      headerName: "",
    },
  ]);
  const addEditEmployee = async () => {
    try {
      if (!employeeForm._id) {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/employee`, employeeForm);
      } else {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/employee/${employeeForm._id}`,
          employeeForm
        );
      }
      cancel();
      apiCalls();
    } catch (err) {}
  };
  const methodFromParent = (dataFromChild) => {
    console.log(dataFromChild);
    // if (dataFromChild.data.cafe) {
    //   dataFromChild.data.cafe = dataFromChild.data.cafe._id;
    // }
    if (dataFromChild.colDef.field == "edit") {
      setEmployeeForm({
        ...dataFromChild.data,
        cafe: dataFromChild?.data?.cafe?._id,
      });
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
    setEmployeeForm({
      name: "",
      email_address: "",
      phone_number: "",
      gender: "male",
    });
    setModalOpen(false);
  };
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email_address: "",
    phone_number: "",
    gender: "male",
    cafe: "",
  });

  const isFullWidthRow = useCallback((params) => {
    return params.rowNode.data.fullWidth;
  }, []);

  const apiCalls = async () => {
    try {
      let cafesListData = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/cafes`);
      setCafesList(cafesListData.data.cafes);

      let employeesData = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/employees${
          query.get("cafe") ? "?cafe=" + query.get("cafe") : ""
        }`
      );
      setRowData([...employeesData.data.employees]);
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
        <DialogTitle id="scroll-dialog-title">Add/Edit employee</DialogTitle>
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
                value={employeeForm.name}
                onChange={(event) => {
                  setEmployeeForm({
                    ...employeeForm,
                    name: event.target.value,
                  });
                }}
              />
            </div>
            <div>
              <TextField
                required
                label="Email address"
                value={employeeForm.email_address}
                onChange={(event) => {
                  setEmployeeForm({
                    ...employeeForm,
                    email_address: event.target.value,
                  });
                }}
              />
            </div>
            <div>
              <TextField
                required
                label="Phone Number"
                value={employeeForm.phone_number}
                onChange={(event) => {
                  setEmployeeForm({
                    ...employeeForm,
                    phone_number: event.target.value,
                  });
                }}
              />
            </div>
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={employeeForm.gender}
                onChange={(event) => {
                  setEmployeeForm({
                    ...employeeForm,
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
            </FormControl>
            <div>
              <FormControl>
                <InputLabel id="demo-simple-select-label">
                  Assign to cafe
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={employeeForm.cafe}
                  onChange={(event) => {
                    setEmployeeForm({
                      ...employeeForm,
                      cafe: event.target.value,
                    });
                  }}
                >
                  {cafesList &&
                    cafesList.map((cafe) => {
                      return <MenuItem value={cafe._id}>{cafe.name}</MenuItem>;
                    })}
                </Select>
              </FormControl>
            </div>
          </form>
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel} color="primary">
            Cancel
          </Button>
          <Button onClick={addEditEmployee} color="primary">
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
                `${process.env.REACT_APP_BACKEND_URL}/employee/${deleteModal.data._id}`
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

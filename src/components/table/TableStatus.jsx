import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Panel as ColorPickerPanel } from "rc-color-picker";
import { pathEndPoint } from "../../assets/menu";
import Loading from "../asset/Loading";
import {
  useTheme,
  makeStyles,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  withStyles,
  Fade,
  Modal,
  Backdrop,
  Snackbar,
} from "@material-ui/core";
import "../../assets/master.css";

import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

import MuiAlert from "@material-ui/lab/Alert";
import TablePaginationActions from "../asset/pagination/TablePaginationActions";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles2 = makeStyles((theme) => ({
  table: {
    marginTop: "20px",
    minWidth: 400,
    width: "100%",
    overflowX: "auto",
  },

  posPagination: {
    position: "absolute",
    right: "100px",
  },

  tableWidth: {
    margin: "auto",
    width: "98%",
  },

  thead: {
    "& th": {
      backgroundColor: theme.theadColor,
    },
    "& th:first-child": {
      borderRadius: "0.5em 0 0 0",
    },
    "& th:last-child": {
      borderRadius: "0 0.5em 0 0",
    },
  },
  paper: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "30%",
    left: "50%",
    width: 550,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
}));

const TableStatus = (props) => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModal, setEditModal] = useState(false);
  const [dataColor, setDataColor] = useState([]);
  const [thiscolor, setThisColor] = useState("");
  const [statusName, setStatusName] = useState("");
  const [color, setColor] = useState(false);
  const colorHex = React.useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusId, setStatusId] = useState("");
  const [toast, setToast] = useState(false);

  // useEffect(
  //   function () {
  //     setDataColor(newData.sort((a, b) => (a.id > b.id ? -1 : 1)));
  //   },
  //   [newData]
  // );

  // React.useEffect(function () {
  //   async function getData() {
  //     const request = await fetch("http://localhost:5000/api/v1/status");
  //     const response = await request.json();
  //     setDataColor(response.data.statuss);
  //   }
  //   getData();
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      getStatusList();
    }, 3000);
  }, [dataColor]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(false);
  };

  const getStatusList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/status`
      )
      .then((response) => {
        setDataColor(response.data.data.statuss);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateStatus = async (e) => {
    e.preventDefault();
    await axios.patch(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/status/${statusId}`,
      {
        status_name: statusName,
        color_status: thiscolor,
      }
    );
    setToast(true);
    setStatusName("");
    setThisColor("");
    setEditModal(false);
    setColor(false);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, dataColor.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function handleEdit(row) {
    setEditModal(true);
    setStatusId(row.id);
    setStatusName(row.status_name);
    setThisColor(row.color_status);
  }

  const modalClose = () => {
    setEditModal(false);
  };

  const changeHandler = (colors) => {
    setThisColor(colors.color);
    colorHex.current.value = thiscolor;
  };

  function handlePick() {
    setColor((prevSelected) => !prevSelected);
  }

  const setColorType = (event) => {
    const colorType = event.target.value;
    setThisColor(colorType);
  };

  const bodyModal = (
    <>
      <Fade in={editModal}>
        <div className={classes.paper}>
          <form onSubmit={updateStatus}>
            <div className="row">
              <div className="col-12">
                <h3>Title Header</h3>
              </div>
              <div className="col-12">
                <label htmlFor="">Status Name</label>
                <input
                  type="text"
                  id="statusName"
                  className="form-input"
                  defaultValue={statusName}
                  onChange={function (e) {
                    setStatusName(e.target.value);
                  }}
                />
              </div>
              <div className="col-1">
                <ColorPickerPanel
                  color={thiscolor}
                  className={`color-pick ${color ? "active" : ""}`}
                  enableAlpha={true}
                  onChange={changeHandler}
                  mode="RGB"
                />
                <button
                  type="button"
                  className="button-color"
                  style={{ background: thiscolor }}
                  onClick={handlePick}></button>
              </div>
              <div className="col-1"></div>
              <div className="col-6">
                <input
                  type="text"
                  className="form-input"
                  ref={colorHex}
                  value={thiscolor}
                  onChange={setColorType}
                />
              </div>
            </div>
            <br />
            <div className="footer-modal">
              <button className="btn-cancel" onClick={modalClose}>
                Cancel
              </button>
              <button className="btn-submit" type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </Fade>
    </>
  );

  return (
    <>
      <TableContainer className={classes.tableWidth}>
        <Paper>
          <Table className={classes.table} aria-label="custom pagination table">
            <TableHead classes={{ root: classes.thead }}>
              <TableRow>
                <StyledTableCell>Status Name</StyledTableCell>
                <StyledTableCell align="left">Color Name</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? dataColor.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : dataColor
                ).map((row, index) => (
                  <TableRow key={row.id}>
                    <TableCell
                      style={{ width: 160 }}
                      component="th"
                      scope="row">
                      {row.status_name}
                    </TableCell>
                    <TableCell style={{ width: 160 }} align="left">
                      <span
                        className={"color-name"}
                        style={{ background: row.color_status }}></span>
                      {row.color_status}
                    </TableCell>
                    <TableCell style={{ width: 100 }} align="center">
                      <button
                        className="btn-edit"
                        onClick={(e) => handleEdit(row)}>
                        <span
                          class="iconify icon-btn"
                          data-icon="ci:edit"></span>
                        <span className="name-btn">Edit</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 20 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            )}

            <TableFooter className={classes.posPagination}>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={dataColor.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      </TableContainer>
      <Modal
        open={editModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModal}
      </Modal>
      <Snackbar
        autoHideDuration={5000}
        open={toast}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="success">
          submit successful
        </Alert>
      </Snackbar>
    </>
  );
};

export default TableStatus;

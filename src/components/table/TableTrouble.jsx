import React, { useState, useEffect } from "react";
import { pathEndPoint } from "../../assets/menu";
import PropTypes from "prop-types";
import axios from "axios";
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

const TableTrouble = () => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModal, setEditModal] = useState(false);
  const [dataTrouble, setDataTrouble] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [troubleId, setTroubleId] = useState("");
  const [troubleName, setTroubleName] = useState("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      getTroubleList();
    }, 3000);
  }, []);

  const getTroubleList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/trouble`
      )
      .then((response) => {
        setDataTrouble(response.data.data.troubles);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(false);
  };

  const handleDelete = async (row) => {
    await axios.delete(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/trouble/${row.id}`
    );
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleEdit = async (row) => {
    setEditModal(true);
    setTroubleId(row.id);
    setTroubleName(row.trouble_name);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, dataTrouble.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const modalClose = () => {
    setEditModal(false);
  };

  const updateRole = async (e) => {
    e.preventDefault();
    await axios.patch(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/trouble/${troubleId}`,
      {
        trouble_name: troubleName,
      }
    );
    setToast(true);
    setTroubleId("");
    setTroubleName("");
    setEditModal(false);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const bodyModal = (
    <>
      <Fade in={editModal}>
        <div className={classes.paper}>
          <form onSubmit={updateRole}>
            <div className="row">
              <div className="col-12">
                <h3>Trouble Edit</h3>
              </div>
              <div className="col-12">
                <label htmlFor="">Trouble Name</label>
                <input
                  type="text"
                  id="troubleName"
                  defaultValue={troubleName}
                  className="form-input"
                  onChange={function (e) {
                    setTroubleName(e.target.value);
                  }}
                />
              </div>
            </div>
            <br />
            <div className="footer-modal">
              <button className={"btn-cancel"} onClick={modalClose}>
                Cancel
              </button>
              <button className={"btn-submit"} type="submit">
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
                <StyledTableCell>Trouble Name</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? dataTrouble.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : dataTrouble
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell
                      style={{ width: 160 }}
                      component="th"
                      scope="row">
                      {row.trouble_name}
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
                      <button
                        className="btn-delete"
                        onClick={(e) => handleDelete(row)}>
                        <span
                          class="iconify icon-btn"
                          data-icon="ant-design:delete-filled"></span>
                        <span className="name-btn">Delete</span>
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
                  count={dataTrouble.length}
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

export default TableTrouble;

import React, { useState, useEffect } from "react";

import PropTypes from "prop-types";
import axios from "axios";
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
  Divider,
} from "@material-ui/core";
import "../../assets/master.css";

import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page">
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page">
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page">
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page">
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

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

const TableArea = (props) => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [areaDelete, setAreaDelete] = useState([]);
  const [dataArea, setDataArea] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [areaId, setAreaId] = useState("");
  const [areaName, setAreaName] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [toast, setToast] = useState(false);
  const { searchValue } = props;

  useEffect(() => {
    getAreaList();
    // setTimeout(() => {

    // }, 3000);

    if (searchValue) {
      setTimeout(() => {
        searchHandle(searchValue);
      }, 1000);
    }
  }, [searchValue]);

  function filterByValue(array, value) {
    return array.filter(
      (data) =>
        JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  const searchHandle = (searchValue) => {
    if (searchValue !== null) {
      let searchRequest = filterByValue(dataArea, searchValue);
      setDataArea(searchRequest);
    }
  };

  const getAreaList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/area`
      )
      .then((response) => {
        setDataArea(response.data.data.areas);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const updateArea = async (e) => {
    e.preventDefault();
    await axios.patch(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/area/${areaId}`,
      {
        area_name: areaName,
        alias_name: aliasName,
      }
    );
    setToast(true);
    setAreaId("");
    setAreaName("");
    setAliasName("");
    setEditModal(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, dataArea.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  function handleEdit(row) {
    setEditModal(true);
    setAreaId(row.id);
    setAreaName(row.area_name);
    setAliasName(row.alias_name);
  }

  const handleDelete = async (row) => {
    await axios
      .delete(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/area/${row.id}`
      )
      .then((res) => {
        setToast(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        alert(`area has been used on item`);
      });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleConfirmDelete = (row) => {
    setDeleteModal(true);
    setAreaDelete(row);
  };

  const modalClose = () => {
    setEditModal(false);
    setDeleteModal(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(false);
  };

  const bodyModal = (
    <>
      <Fade in={editModal}>
        <div className={classes.paper}>
          <form onSubmit={updateArea}>
            <div className="row">
              <div className="col-12">
                <h3>Area Name</h3>
              </div>
              <div className="col-12">
                <label htmlFor="">Area</label>
                <input
                  type="text"
                  id="areaName"
                  defaultValue={areaName}
                  className="form-input"
                  onChange={function (e) {
                    setAreaName(e.target.value);
                  }}
                />
              </div>
              <div className="col-12">
                <label htmlFor="">Alias Name</label>
                <input
                  type="text"
                  id="aliasName"
                  defaultValue={aliasName}
                  className="form-input"
                  onChange={function (e) {
                    setAliasName(e.target.value);
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

  const bodyModalDelete = (
    <>
      <Fade in={deleteModal}>
        <div className={classes.paper}>
          <h3>Are you sure want to delete this {areaDelete.area_name}</h3>
          <Divider />
          <br />

          <div className="footer-modal">
            <button className="btn-cancel" onClick={modalClose}>
              Cancel
            </button>
            <button
              className="btn-submit"
              onClick={() => handleDelete(areaDelete)}>
              Submit
            </button>
          </div>
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
                <StyledTableCell>Area Name</StyledTableCell>
                <StyledTableCell>Alias Name</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? dataArea.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : dataArea
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell
                      style={{ width: 160 }}
                      component="th"
                      scope="row">
                      {row.area_name}
                    </TableCell>
                    <TableCell
                      style={{ width: 160 }}
                      component="th"
                      scope="row">
                      {row.alias_name}
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
                        onClick={() => handleConfirmDelete(row)}>
                        <span
                          class="iconify icon-btn"
                          data-icon="ant-design:delete-filled"></span>
                        <span className="name-btn">Delete</span>
                      </button>
                      {/* <button
                        className="btn-delete"
                        onClick={(e) => handleDelete(row)}>
                        <span
                          class="iconify icon-btn"
                          data-icon="ant-design:delete-filled"></span>
                        <span className="name-btn">Delete</span>
                      </button> */}
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
                  count={dataArea.length}
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

      <Modal
        open={deleteModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModalDelete}
      </Modal>

      <Snackbar
        autoHideDuration={4000}
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

export default TableArea;

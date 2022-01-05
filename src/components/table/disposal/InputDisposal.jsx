import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  useTheme,
  makeStyles,
  withStyles,
  Grid,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Button,
} from "@material-ui/core";
import "../../../assets/master.css";
import { pathEndPoint } from "../../../assets/menu";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import axios from "axios";

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
    width: 850,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },

  btnNext: {
    textTransform: "capitalize",
    position: "relative",
    width: "130px",
    height: "40px",
    left: "80%",
    transform: "translate(50%, 200%)",
  },
}));

const InputDisposal = ({ dataDisposal }) => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectDisposal, setSelectDisposal] = useState(dataDisposal);
  const [nameDisposal, setNameDisposal] = useState("");
  const [descriptionDisposal, setDescriptionDisposal] = useState("");
  const [statusDisposal, setStatusDisposal] = useState([]);

  useEffect(() => {
    getStatusList();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/status`
      )
      .then((response) => {
        const dataStatus = response.data.data.statuss;
        let statusDispos = dataStatus
          .filter((row) => [16, 17, 18].includes(row.id))
          .sort((a, b) => (a.id > b.id ? 1 : -1));
        setStatusDisposal(statusDispos);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, selectDisposal.length - page * rowsPerPage);

  function removeHandler(todoId) {
    const filteredDisposal = selectDisposal.filter(function (todo) {
      return todo.id !== todoId;
    });
    setSelectDisposal(filteredDisposal);
  }

  const handleSubmit = async () => {
    const statusdis = document.querySelector('input[name="statusdis"]:checked');

    if (nameDisposal === "") {
      alert("name can't be empty");
      return;
    }

    if (statusdis === null) {
      alert("select 1 status");
      return;
    }

    console.log(nameDisposal);
    console.log(descriptionDisposal);
    console.log(statusdis.value);
  };

  return (
    <>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={5}>
          <label htmlFor="">Name Disposal</label>
          <input
            type="text"
            className="form-input"
            value={nameDisposal}
            onChange={(e) => setNameDisposal(e.target.value)}
          />
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={5}>
          <label htmlFor="">Description</label>
          <textarea
            className="form-input-area"
            cols="30"
            rows="10"
            value={descriptionDisposal}
            onChange={(e) => setDescriptionDisposal(e.target.value)}></textarea>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={8}>
          <div className="wrapper_dispos__status">
            <label className="label-inv" htmlFor="">
              Status
            </label>
            <Grid container spacing={3}>
              {statusDisposal.map((row) => (
                <>
                  <div className="radio-disposal">
                    <input
                      type="radio"
                      id={row.status_name}
                      value={row.id}
                      name="statusdis"
                    />
                    <label htmlFor={row.status_name} className="radio-label">
                      {row.status_name}
                    </label>
                  </div>
                </>
              ))}
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Grid item xs={4}></Grid>
      <TableContainer className={classes.tableWidth}>
        <Paper>
          <Table className={classes.table} aria-label="custom pagination table">
            <TableHead classes={{ root: classes.thead }}>
              <TableRow>
                <StyledTableCell>Asset No</StyledTableCell>
                <StyledTableCell>Name Item</StyledTableCell>
                <StyledTableCell>User/Dept</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Area</StyledTableCell>
                <StyledTableCell>QTY</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? selectDisposal.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : selectDisposal
              ).map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.asset_number}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.asset_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.type_asset}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.category_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.area_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.asset_quantity}
                  </TableCell>
                  <TableCell style={{ width: 100 }} align="center">
                    <button
                      className="btn-delete"
                      onClick={removeHandler.bind(this, row.id)}>
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

            <TableFooter className={classes.posPagination}>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={selectDisposal.length}
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
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          className={classes.btnNext}>
          Submit
        </Button>
      </Grid>
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default InputDisposal;

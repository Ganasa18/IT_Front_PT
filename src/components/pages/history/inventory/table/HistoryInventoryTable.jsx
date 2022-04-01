import React, { useState, useEffect } from "react";
import { pathEndPoint, logsEndPoint } from "../../../../../assets/menu";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../../../../asset/Loading";
import "../../../../asset/chips.css";
import { Link } from "react-router-dom";
import "../../../../../assets/master.css";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
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
} from "@material-ui/core";

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
}));

function calbill(date) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  var myDate = new Date(date);
  var d = myDate.getDate();
  var m = myDate.getMonth();
  m += 1;
  var y = myDate.getFullYear();

  var newdate = d + " " + monthNames[myDate.getMonth()] + " " + y;
  return newdate;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const HistoryInventoryTable = () => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [dataHistoryInvent, setDataHistoryInvent] = useState([]);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, dataHistoryInvent.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer className={classes.tableWidth}>
        <Paper>
          <Table className={classes.table} aria-label="custom pagination table">
            <TableHead classes={{ root: classes.thead }}>
              <TableRow>
                <StyledTableCell>Asset No</StyledTableCell>
                <StyledTableCell>Asset Name</StyledTableCell>
                <StyledTableCell>Unit/Part</StyledTableCell>
                <StyledTableCell>Fisik/Non</StyledTableCell>
                <StyledTableCell>User/Dept.</StyledTableCell>
                <StyledTableCell>QTY</StyledTableCell>
                <StyledTableCell>Used By</StyledTableCell>
                <StyledTableCell>Area</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Date</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? dataHistoryInvent.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : dataHistoryInvent
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      <Link to="/history/ticket/action-req/detail/information">
                        {row.asset_number}
                      </Link>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.asset_name}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      {row.asset_part_or_unit === ""
                        ? " - "
                        : row.asset_part_or_unit}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.asset_fisik_or_none}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.type_asset}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.qty}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.qty}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.used_by}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.area}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className="chip-container">
                        {row.status_asset === true ? (
                          <span className="chip-inventory-used">Used</span>
                        ) : (
                          <span className="chip-inventory-available">
                            Available
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.createdAt}
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 20 * emptyRows }}>
                    <TableCell colSpan={10} />
                  </TableRow>
                )}
              </TableBody>
            )}

            <TableFooter className={classes.posPagination}>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={dataHistoryInvent.length}
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
    </>
  );
};

export default HistoryInventoryTable;

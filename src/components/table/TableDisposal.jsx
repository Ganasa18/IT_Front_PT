import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { pathEndPoint } from "../../assets/menu";
import Loading from "../asset/Loading";
import { Link } from "react-router-dom";
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
import "../../assets/master.css";

import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

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

const TableDisposal = () => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataDisposal, setDataDisposal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      getDisposalGroup();
    }, 2000);
  }, []);

  const getDisposalGroup = async () => {
    let disposal = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/disposal/group/`;

    let status = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/status`;

    const requestOne = await axios.get(disposal);
    const requestTwo = await axios.get(status);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];

          let newDataDisposal = responseOne.data.data.disposal_group;
          let newDataStatus = responseTwo.data.data.statuss;

          const arr_disposal = [...newDataDisposal];
          const arr_status = [...newDataStatus];

          var statusmap = {};

          arr_status.forEach(function (status_id) {
            statusmap[status_id.id] = status_id;
          });

          arr_disposal.forEach(function (disposal) {
            disposal.status_id = statusmap[disposal.status_approval];
          });

          arr_status.forEach(function (status_condition) {
            statusmap[status_condition.id] = status_condition;
          });

          arr_disposal.forEach(function (disposal) {
            disposal.status_condition = statusmap[disposal.status_disposal];
          });

          let JoinRole = arr_disposal;

          setDataDisposal(JoinRole);
          setIsLoading(false);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, dataDisposal.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const storeData = (row) => {
    localStorage.setItem("dispos_no", row.disposal_code);
    localStorage.setItem("disposalData", JSON.stringify(row));
  };

  return (
    <>
      <TableContainer className={classes.tableWidth}>
        <Paper>
          <Table className={classes.table} aria-label="custom pagination table">
            <TableHead classes={{ root: classes.thead }}>
              <TableRow>
                <StyledTableCell>Disposal No</StyledTableCell>
                <StyledTableCell>Date Create</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? dataDisposal.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : dataDisposal
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      <Link
                        onClick={() => storeData(row)}
                        to="/disposal-assets/detail">
                        {row.disposal_code}
                      </Link>
                    </TableCell>
                    <TableCell>{calbill(row.createdAt)}</TableCell>
                    <TableCell align="center">
                      <span
                        class="chip"
                        style={{
                          background: `${row.status_id.color_status}4C`,
                          color: `${row.status_id.color_status}FF`,
                        }}>
                        {capitalizeFirstLetter(row.status_id.status_name)}
                      </span>
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
                  count={dataDisposal.length}
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

export default TableDisposal;

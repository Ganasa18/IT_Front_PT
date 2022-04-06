import React, { useState, useEffect } from "react";
import { pathEndPoint, prEndPoint } from "../../../assets/menu";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../../asset/Loading";
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
import "../../../assets/master.css";
import "../../asset/chips.css";
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

const TableIncomingPR = (props) => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [dataPR, setDataPR] = useState([]);
  const { searchValue, filterValue } = props;

  useEffect(() => {
    getPRList();

    if (searchValue) {
      setTimeout(() => {
        searchHandle(searchValue);
      }, 1000);
    }
    if (filterValue) {
      setTimeout(() => {
        filterHandle(filterValue);
      }, 1000);
    }
  }, [searchValue, filterValue]);

  // Arbitrary asynchronous function
  function doAsyncStuff() {
    return Promise.resolve();
  }

  // The helper function
  async function filter(arr, callback) {
    const fail = Symbol();
    return (
      await Promise.all(
        arr.map(async (item) => ((await callback(item)) ? item : fail))
      )
    ).filter((i) => i !== fail);
  }

  const filterHandle = (filterValue) => {
    let checkData = filterValue.every((element) => element === "reset");

    if (!checkData) {
      setIsLoading(true);
      if (
        filterValue[0] !== "" &&
        new Date(filterValue[1]).toISOString().split("T")[0] ===
          new Date().toISOString().split("T")[0]
      ) {
        (async function () {
          if (filterValue[0] === "null") {
            const results = await filter(dataPR, async (item) => {
              await doAsyncStuff();
              return item.purchase_order_code_1 === null;
            });

            setPage(0);
            setDataPR(results);
            setTimeout(() => {
              setIsLoading(false);
            }, 1500);
          } else {
            const results = await filter(dataPR, async (item) => {
              await doAsyncStuff();
              return item.purchase_order_code_1 !== null;
            });
            console.log(results);

            setPage(0);
            // setDataPR(results);
            setTimeout(() => {
              setIsLoading(false);
            }, 1500);
          }
        })();
        return;
      }
      var ed = new Date(filterValue[1]).toISOString().split("T")[0];
      var sd = new Date(filterValue[2]).toISOString().split("T")[0];

      (async function () {
        const results = await filter(dataPR, async (item) => {
          await doAsyncStuff();
          return (
            new Date(item.createdAt).toISOString().split("T")[0] >= ed &&
            new Date(item.createdAt).toISOString().split("T")[0] <= sd
          );
        });
        setDataPR(results);
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      })();
    }
  };

  function filterByValue(array, value) {
    return array.filter(
      (data) =>
        JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  const searchHandle = (searchValue) => {
    if (searchValue !== null) {
      let searchRequest = filterByValue(dataPR, searchValue);
      setDataPR(searchRequest);
    }
  };

  const getPRList = async () => {
    let pr = `${prEndPoint[0].url}${
      prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
    }/api/v1/purchase-req`;

    let status = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/status`;

    const requestOne = await axios.get(pr);
    const requestTwo = await axios.get(status);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          let newDataRequest = responseOne.data.data.request_purchase;

          newDataRequest = newDataRequest.filter(
            (item) => item.status_id === 7
          );

          let newStatus = responseTwo.data.data.statuss;
          const arr_status = [...newStatus];
          const arr_request = [...newDataRequest];

          var statusmap = {};

          arr_status.forEach(function (status_id) {
            statusmap[status_id.id] = status_id;
          });
          arr_request.forEach(function (request_id) {
            request_id.status_id = statusmap[request_id.status_id];
          });

          setDataPR(newDataRequest);
          setIsLoading(false);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  const storePurchase = (row) => {
    localStorage.setItem("ticketData", JSON.stringify(row));
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, dataPR.length - page * rowsPerPage);

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
                <StyledTableCell>PR No</StyledTableCell>
                {/* <StyledTableCell>PO No</StyledTableCell> */}
                <StyledTableCell>Create by</StyledTableCell>
                <StyledTableCell>Request For</StyledTableCell>
                <StyledTableCell>PR Date</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? dataPR.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : dataPR
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      <Link
                        to="/in-coming-pr/detail"
                        onClick={() => storePurchase(row)}>
                        {row.purchase_req_code}
                      </Link>
                    </TableCell>
                    {/* <TableCell component="th" scope="row">
                      {row.purchase_order_code_1 !== null ||
                      row.purchase_order_code_2 !== null ||
                      row.purchase_order_code_3 !== null ||
                      row.purchase_order_code_4 !== null ||
                      row.purchase_order_code_5 !== null ? (
                        <>
                          {row.purchase_order_code_1}
                          {row.purchase_order_code_2}
                          {row.purchase_order_code_3}
                          {row.purchase_order_code_4}
                          {row.purchase_order_code_5}
                        </>
                      ) : (
                        "-"
                      )}
                    </TableCell> */}
                    <TableCell component="th" scope="row">
                      {row.created_by}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.request_by}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {calbill(row.createdAt)}
                    </TableCell>
                    <TableCell width={200} component="th" scope="row">
                      {row.purchase_order_code_1 !== null ||
                      row.purchase_order_code_2 !== null ||
                      row.purchase_order_code_3 !== null ||
                      row.purchase_order_code_4 !== null ||
                      row.purchase_order_code_5 !== null ? (
                        <p className="text-center">
                          <span
                            class="chip-action"
                            style={{
                              background: `#1653A64C`,
                              color: `#1653A6FF`,
                            }}>
                            Progress
                          </span>
                        </p>
                      ) : (
                        <p className="text-center">
                          <span
                            class="chip-action"
                            style={{
                              background: `#EB57574C`,
                              color: `#EB5757FF`,
                            }}>
                            Not Fill
                          </span>
                        </p>
                      )}
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
                  count={dataPR.length}
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

export default TableIncomingPR;

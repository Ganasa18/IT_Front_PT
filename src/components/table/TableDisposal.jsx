import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  withStyles,
} from "@material-ui/core";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/master.css";
import { pathEndPoint } from "../../assets/menu";
import Loading from "../asset/Loading";
import TablePaginationActions from "../asset/pagination/TablePaginationActions";

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

const TableDisposal = (props) => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataDisposal, setDataDisposal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { searchValue, filterValue } = props;

  useEffect(() => {
    getDisposalGroup();

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
          const results = await filter(dataDisposal, async (item) => {
            await doAsyncStuff();
            return item.status_id.id === filterValue[0];
          });

          setDataDisposal(results);
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        })();

        return;
      }
      var ed = new Date(filterValue[1]).toISOString().split("T")[0];
      var sd = new Date(filterValue[2]).toISOString().split("T")[0];

      (async function () {
        const results = await filter(dataDisposal, async (item) => {
          await doAsyncStuff();
          return (
            new Date(item.createdAt).toISOString().split("T")[0] >= ed &&
            new Date(item.createdAt).toISOString().split("T")[0] <= sd
          );
        });
        setDataDisposal(results);
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

  const searchHandle = useCallback(
    (searchValue) => {
      if (searchValue !== null) {
        let searchRequest = filterByValue(dataDisposal, searchValue);
        setDataDisposal(searchRequest);
      }
    },
    [dataDisposal]
  );

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
                <StyledTableCell>Disposal Name</StyledTableCell>
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
                    <TableCell>{row.disposal_name}</TableCell>
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

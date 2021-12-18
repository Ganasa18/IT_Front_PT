import React, { useState, useEffect } from "react";
import { authEndPoint, pathEndPoint } from "../../assets/menu";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../asset/Loading";
import SelectSearch, { fuzzySearch } from "react-select-search";
import { Link } from "react-router-dom";
import "../../assets/select-search.css";
import "../asset/chips.css";
import _ from "lodash";

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
  Checkbox,
} from "@material-ui/core";
import "../../assets/master.css";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("token");

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
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
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
}));

const TableInventory = () => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModal, setEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultJoinUser, setResultJoinUser] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selected, setSelected] = useState({});
  const [dataInventory, setDataInventory] = useState([]);
  const [selectInventory, setSelectInventory] = useState([]);

  useEffect(() => {
    getInventory();
  }, []);

  const getInventory = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/inventory`
      )
      .then((response) => {
        setDataInventory(response.data.data.inventorys);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const toggleAllSelected = (e) => {
    const { checked } = e.target;
    setAllSelected(checked);

    dataInventory &&
      setSelected(
        dataInventory.reduce(
          (selected, { id }) => ({
            ...selected,
            [id]: checked,
          }),
          {}
        )
      );
  };

  const toggleSelected = (row) => (e) => {
    if (!e.target.checked) {
      setAllSelected(false);
    }

    // console.log(e);

    var obj = row;
    var newData = [...selectInventory, obj];

    setSelectInventory(arrUnique(newData));

    setSelected((selected) => ({
      ...selected,
      [row.id]: !selected[row.id],
    }));
  };

  function arrUnique(arr) {
    var cleaned = [];
    arr.forEach(function (itm) {
      var unique = true;
      cleaned.forEach(function (itm2) {
        if (_.isEqual(itm, itm2)) unique = false;
      });
      if (unique) cleaned.push(itm);
    });
    return cleaned;
  }

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

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const isAllSelected = selectedCount === dataInventory.length;

  const isIndeterminate =
    selectedCount && selectedCount !== dataInventory.length;

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, dataInventory.length - page * rowsPerPage);

  const checkValue = () => {
    const checkbox = document.querySelectorAll("#check-value .Mui-checked");
    const table = document.querySelectorAll("tbody #check-value");
    const arr = [...checkbox];
    // const arr2 = [...table];
    // const arr = [...table];
    var newArray = [];
    arr.forEach((element) => {
      const valueId = parseInt(element.children[0].children[0].value);
      newArray.push(valueId);
    });

    var filteredArray = selectInventory.filter((i) => newArray.includes(i.id));
    console.log(selectInventory);
    console.log(filteredArray);

    // const arrLength = arr;
    // arr2.forEach((element) => {
    //   console.log(checkbox);
    //   console.log(element);
    // });
    // console.log(arrLength.length);
    // for (i = 0; i < table.length; i++) {
    //   const checkbox = document.querySelectorAll("td input[type=checkbox]");
    //   console.log(checkbox);
    //   // console.log(table[i]);
    // }
  };

  return (
    <>
      <div className="col-12">
        <div className="card">
          <div className="display-disposal-invent">
            {selectedCount > 0 ? (
              <>
                <span style={{ marginRight: "5px" }}>( </span>
                <span className="count">{selectedCount}</span>
                <span className="selected">Selected Item )</span>
              </>
            ) : null}

            <button className="btn-disposal-inv" onClick={checkValue}>
              Disposal
            </button>
          </div>
        </div>
      </div>
      <TableContainer className={classes.tableWidth}>
        <Paper>
          <Table
            className={classes.table}
            aria-label="custom pagination table"
            id="Table1"
          >
            <TableHead classes={{ root: classes.thead }}>
              <TableRow>
                <StyledTableCell padding="checkbox" style={{ width: 50 }}>
                  <Checkbox
                    checked={allSelected || isAllSelected} // <-- all selected
                    onChange={toggleAllSelected} // <-- toggle state
                    indeterminate={isIndeterminate} // <-- some selected
                  />
                </StyledTableCell>
                <StyledTableCell>Asset No</StyledTableCell>
                <StyledTableCell>Asset Name</StyledTableCell>
                <StyledTableCell>User/Dept.</StyledTableCell>
                <StyledTableCell>Used By</StyledTableCell>
                <StyledTableCell>Date Create</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? dataInventory.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : dataInventory
                ).map((row) => (
                  <TableRow id="check-value" key={row.id}>
                    <TableCell padding="checkbox" style={{ width: 50 }}>
                      <Checkbox
                        value={row.id}
                        checked={selected[row.id] || allSelected} // <-- is selected
                        onChange={toggleSelected(row)} // <-- toggle state
                      />
                    </TableCell>
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
                      Rendy
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {calbill(row.createdAt)}
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

                    <TableCell style={{ width: 300 }} align="center">
                      <button className="btn-edit" onClick={(e) => {}}>
                        <span
                          class="iconify icon-btn"
                          data-icon="ci:edit"
                        ></span>
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
                  count={dataInventory.length}
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

export default TableInventory;

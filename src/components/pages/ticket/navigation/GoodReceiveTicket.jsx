import React, { useState, useEffect } from "react";
import {
  useTheme,
  makeStyles,
  Grid,
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
  Checkbox,
  Typography,
  Button,
  Toolbar,
} from "@material-ui/core";
import PropTypes from "prop-types";
import "../../../../assets/master.css";
import "../../../../assets/asset_user.css";
import "../../../asset/chips.css";
import _ from "lodash";
import Loading from "../../../asset/Loading";

import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import AddIcon from "@material-ui/icons/Add";

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
    [theme.breakpoints.up("xl")]: {
      right: "30px",
      marginTop: "20px",
    },
    [theme.breakpoints.down("lg")]: {
      right: "30px",
      marginTop: "20px",
    },
  },

  tableWidth: {
    margin: "auto",
    width: "100%",
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
  paperTable: {
    height: "580px",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },

  cardPadding: {
    marginTop: theme.spacing(5),
  },
}));

const GoodReceiveTicket = () => {
  const DataDummy = [
    {
      id: "1",
      po_number: "123444",
      asset_name: "Macbook",
      description: "part",
      qty: 1,
    },
    {
      id: "2",
      po_number: "123444",
      asset_name: "Macbook",
      description: "part",
      qty: 3,
    },
    {
      id: "3",
      po_number: "123444",
      asset_name: "Macbook",
      description: "part",
      qty: 5,
    },
    {
      id: "4",
      po_number: "123444",
      asset_name: "Macbook",
      description: "part",
      qty: 2,
    },
    {
      id: "5",
      po_number: "123444",
      asset_name: "Macbook",
      description: "part",
      qty: 3,
    },
    {
      id: "6",
      po_number: "123444",
      asset_name: "Macbook",
      description: "part",
      qty: 3,
    },
  ];

  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModal, setEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [selected, setSelected] = useState({});
  const [dataGR, setDataGR] = useState(DataDummy);
  const [selectGR, setSelectGR] = useState([]);
  const [itemCount, setItemCount] = useState(0);

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

    dataGR &&
      setSelected(
        dataGR.reduce(
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

    var obj = row;
    var newData = [...selectGR, obj];
    setSelectGR(arrUnique(newData));

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

  const handleDecrement = (cart_id) => {
    // setDataGR((dataGr) =>
    //   dataGr.map((item) =>
    //     cart_id === item.id
    //       ? { ...item, qty: item.qty - (item.qty > 1 ? 1 : 0) }
    //       : item
    //   )
    // );

    var cartAdd = document.getElementById(`count-${cart_id}`);
    var x = cartAdd.innerHTML;
    if (parseInt(x) === 1 || parseInt(x) === 0) {
      return (cartAdd.innerHTML = 1);
    }
    cartAdd.innerHTML = parseInt(x) - 1;
  };
  const handleIncrement = (cart_id, total_now) => {
    var cartAdd = document.getElementById(`count-${cart_id}`);
    var x = cartAdd.innerHTML;
    if (parseInt(x) === parseInt(total_now)) {
      return (cartAdd.innerHTML = total_now);
    }
    cartAdd.innerHTML = parseInt(x) + 1;

    // setDataGR((dataGr) =>
    //   dataGr.map((item) =>
    //     cart_id === item.id
    //       ? { ...item, qty: item.qty + (item.qty > total_now ? item.qty : 1) }
    //       : item
    //   )
    // );
  };

  const checkValue = () => {
    const checkbox = document.querySelectorAll("#check-value .Mui-checked");
    const table = document.querySelectorAll("tbody #check-value");
    const arr = [...checkbox];

    arr.forEach((element) => {
      const valueId = parseInt(element.children[0].children[0].value);
      const tableValue = document.getElementsByClassName(`rowId-${valueId}`);
      const arr2 = [...tableValue];
      console.log(arr2[0].childNodes[5].childNodes[1].innerHTML);
      console.log(arr2[0].childNodes[1].innerHTML);
      console.log(arr2[0].childNodes[2].innerHTML);
      console.log(arr2[0].childNodes[3].innerHTML);
      console.log(valueId);
    });

    // console.log(newArray);
    // var filteredArray = selectGR.filter((i) => newArray.includes(i.id));
    // console.log(selectGR);
    // console.log(filteredArray);
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const isAllSelected = selectedCount === dataGR.length;

  const isIndeterminate = selectedCount && selectedCount !== dataGR.length;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, dataGR.length - page * rowsPerPage);

  return (
    <>
      <Grid item xs={12} className={classes.cardPadding}>
        <TableContainer className={classes.tableWidth}>
          <Paper className={classes.paperTable}>
            <Toolbar>
              <div className="col-10">
                <Typography
                  variant="h5"
                  component="div"
                  style={{ marginTop: "5px" }}
                >
                  Good Received
                </Typography>
              </div>
            </Toolbar>
            <div className="display-disposal">
              {selectedCount > 0 ? (
                <>
                  <span style={{ marginRight: "5px" }}>( </span>
                  <span className="count">{selectedCount}</span>
                  <span className="selected">Selected Item )</span>
                </>
              ) : null}

              <button className="btn-disposal" onClick={checkValue}>
                Updated Table
              </button>
            </div>

            <Table
              className={classes.table}
              size="medium"
              aria-label="custom pagination table"
            >
              <TableHead classes={{ root: classes.thead }}>
                <TableRow>
                  <StyledTableCell
                    padding="checkbox"
                    style={{ width: 50 }}
                  ></StyledTableCell>
                  <StyledTableCell>PO Number</StyledTableCell>
                  <StyledTableCell>Name Item</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>QTY</StyledTableCell>
                  <StyledTableCell align="center">Received</StyledTableCell>
                </TableRow>
              </TableHead>

              {isLoading ? (
                <Loading />
              ) : (
                <TableBody>
                  {(rowsPerPage > 0
                    ? dataGR.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : dataGR
                  ).map((row) => (
                    <TableRow
                      key={row.id}
                      id="check-value"
                      className={`rowId-${row.id}`}
                    >
                      <TableCell padding="checkbox" style={{ width: 50 }}>
                        <Checkbox
                          value={row.id}
                          checked={selected[row.id] || allSelected} // <-- is selected
                          onChange={toggleSelected(row)} // <-- toggle state
                        />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.po_number}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.asset_name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.description}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.qty}
                      </TableCell>
                      <TableCell align="center">
                        <button
                          type="button"
                          className="btn-plus"
                          onClick={() => handleIncrement(row.id, row.qty)}
                        >
                          +
                        </button>
                        <span className="item-count" id={`count-${row.id}`}>
                          0
                        </span>
                        <button
                          type="button"
                          className="btn-min"
                          onClick={() => handleDecrement(row.id)}
                        >
                          -
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 10 * emptyRows }}>
                      <TableCell colSpan={8} />
                    </TableRow>
                  )}
                </TableBody>
              )}

              <TableFooter className={classes.posPagination}>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={3}
                    count={dataGR.length}
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
      </Grid>
    </>
  );
};

export default GoodReceiveTicket;

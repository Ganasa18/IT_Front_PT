import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
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
import { prEndPoint, pathEndPoint } from "../../../../assets/menu";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import AddIcon from "@material-ui/icons/Add";
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
    height: "480px",
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
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [editModal, setEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [selected, setSelected] = useState({});
  const [dataGR, setDataGR] = useState([]);
  const req_no = localStorage.getItem("req_no");
  const [selectGR, setSelectGR] = useState([]);
  const [dataGRTemp, setDataGRTemp] = useState([]);
  const [lastNumber, setLastNumber] = useState("");
  const [lastNumberPR, setLastNumberPR] = useState("");
  // const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    getDataPO();

    setInterval(() => {
      getInvLatestId();
    }, 2000);
  }, []);

  const getDataPO = async () => {
    let poData = `${prEndPoint[0].url}${
      prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
    }/api/v1/purchase-order/`;

    await axios
      .get(poData)
      .then((response) => {
        let PoData = response.data.data.purchase_order;

        PoData = PoData.filter(
          (row) => row.ticket_number === req_no && row.gr_status === true
        );

        setLastNumberPR(PoData[0].pr_number);

        if (PoData.length === 1) {
          var dataSet = [];

          // setDataGR(JSON.parse(PoData[0].po_list));

          for (var i = 0; i < PoData.length; i++) {
            var mapped = JSON.parse(PoData[i].po_list);
            for (var j = 0; j < mapped.length; j++) {
              // console.log(mapped[j]);

              const updateTodo = {
                ...mapped[j],
                id_gr: PoData[i].id,
              };
              dataSet.push(updateTodo);
            }
          }
          setDataGR(dataSet);
          setIsLoading(false);
          // console.log(dataSet);
        } else {
          var dataGet = [];

          if (PoData.length > 1) {
            // setDataGR(JSON.parse(PoData[0].po_list));

            for (var i = 0; i < PoData.length; i++) {
              var mapped = JSON.parse(PoData[i].po_list);
              for (var j = 0; j < mapped.length; j++) {
                // console.log(mapped[j]);

                const updateTodo = {
                  ...mapped[j],
                  id_gr: PoData[i].id,
                };
                dataGet.push(updateTodo);
              }
            }

            setDataGR(dataGet);
            setIsLoading(false);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const modalClose = () => {
  //   setEditModal(false);
  // };

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

  const checkValue = async () => {
    var result = Object.keys(selected).map((key) => [
      Number(key),
      selected[key],
    ]);

    result = result.filter((key) => key[1] !== false);
    result = result.map((key) => ({
      id: key[0],
    }));

    const newArrGR = Object.values(result).map((key) => key.id);
    // var newInvent = dataGR;

    const newInvent = dataGR.filter((row) => newArrGR.includes(row.id));

    setDataGRTemp(newInvent);

    // console.log(newInvent);
    // const countData = document.querySelector('.item-count')

    const checkbox = document.querySelectorAll("#check-value .Mui-checked");
    const table = document.querySelectorAll("tbody #check-value");
    const arr = [...checkbox];

    var x = 0;
    var dataNew = [];

    arr.forEach((element) => {
      const valueId = parseInt(element.children[0].children[0].value);
      const tableValue = document.getElementsByClassName(`rowId-${valueId}`);
      const arr2 = [...tableValue];

      if (arr2[0].childNodes[7].childNodes[1].innerHTML == 0) {
        console.log("cannot null");
        return;
      }

      const numberItem = arr2[0].childNodes[2].innerHTML + `-${lastNumber}`;

      let inventory = `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/inventory`;

      setTimeout(() => {
        var j = 0;
        const postData = {
          asset_name: newInvent[j].asset_name,
          asset_number: numberItem,
          asset_fisik_or_none: newInvent[j].asset_fisik_or_none,
          category_asset: parseInt(newInvent[j].id_category),
          subcategory_asset:
            newInvent[j].id_subcategory === null
              ? null
              : parseInt(newInvent[j].id_subcategory),
          initial_asset_name: newInvent[j].initial_asset_name,
          asset_part_or_unit: newInvent[j].asset_part_or_unit,
          area: parseInt(newInvent[j].area),
          type_asset: newInvent[j].type_asset,
          asset_po_number: newInvent[j].asset_po_number,
          asset_pr_number: lastNumberPR,
          asset_detail: newInvent[j].desc_po,
          asset_new_or_old: "new",
          asset_quantity: parseInt(
            arr2[0].childNodes[7].childNodes[1].innerHTML
          ),
          status_asset: true,
          departement: newInvent[j].departement,
          used_by: !newInvent[j].used_by ? null : newInvent[j].used_by,
        };

        axios.post(inventory, postData);

        j = j + 1;
      }, 1000);

      const newData = {
        id: newInvent[x].id,
        old_qty: newInvent[x].qty,
        new_qty: arr2[0].childNodes[7].childNodes[1].innerHTML,
      };
      dataNew.push(newData);

      x = x + 1;
    });

    // console.log(dataNew);
    // var el = 0;
    dataNew.forEach((element, index) => {
      var arrayEmpty = [...dataGR];

      let objIndex = arrayEmpty.findIndex(
        (obj) => obj.id === dataNew[index].id
      );

      arrayEmpty[objIndex].qty = parseInt(
        dataNew[index].old_qty - dataNew[index].new_qty
      );
      console.log("After update: ", arrayEmpty[objIndex]);
    });

    // console.log(newInvent);

    var updateTemp = newInvent.map((item) => ({
      ticket_number: item.id_gr,
      gr_list: dataGR,
    }));

    // console.log(updateTemp);

    let gr_updated = `${prEndPoint[0].url}${
      prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
    }/api/v1/purchase-order/updated-gr`;

    updateTemp.forEach((element, index) => {
      const data = {
        ticket_number: element.ticket_number,
        gr_list: element.gr_list,
      };

      axios
        .patch(gr_updated, data)
        .then((resp) => {
          document.getElementById("overlay").style.display = "block";
          console.log(resp);
        })
        .catch((err) => console.error(err));
    });

    setTimeout(() => {
      document.getElementById("overlay").style.display = "none";
      window.location.reload();
    }, 1800);

    // const data = {
    //   ticket_number: req_no,
    //   gr_list: dataGR,
    // };

    // console.log(newArray);
    // var filteredArray = selectGR.filter((i) => newArray.includes(i.id));
    // console.log(selectGR);
    // console.log(filteredArray);
  };

  const getInvLatestId = async () => {
    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory/latestId`;

    await axios
      .get(inventory)
      .then((response) => {
        var text = response.data.data?.inventory[0]?.asset_number;
        var numb = 0;
        if (text === undefined) {
          numb = parseInt(numb) + 1;
          var str = "" + numb;
          var pad = "000";
          var ans = pad.substring(0, pad.length - str.length) + str;
          setLastNumber(ans);
          return;
        }
        text = text.split("-")[1].trim();
        numb = text.match(/\d/g);
        numb = numb.join("");
        numb = parseInt(numb) + 1;
        str = "" + numb;
        pad = "000";
        ans = pad.substring(0, pad.length - str.length) + str;
        setLastNumber(ans);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function setNumber(numb, index) {
    numb = parseInt(numb) + index;
    var str = "" + numb;
    var pad = "000";
    var ans = pad.substring(0, pad.length - str.length) + str;

    return ans;
  }

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const isAllSelected = selectedCount === dataGR.length;

  const isIndeterminate = selectedCount && selectedCount !== dataGR.length;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, dataGR.length - page * rowsPerPage);

  if (isLoading) return <Loading />;

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
                  style={{ marginTop: "5px" }}>
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

              {selectedCount > 0 ? (
                <button className="btn-disposal-inv" onClick={checkValue}>
                  Updated Table
                </button>
              ) : (
                <button
                  className="btn-disposal-inv-disabled"
                  disabled="disabled"
                  onClick={checkValue}>
                  Updated Table
                </button>
              )}
            </div>

            <Table
              className={classes.table}
              size="medium"
              aria-label="custom pagination table">
              <TableHead classes={{ root: classes.thead }}>
                <TableRow>
                  <StyledTableCell
                    padding="checkbox"
                    style={{ width: 50 }}></StyledTableCell>
                  <StyledTableCell>PO Number</StyledTableCell>
                  <StyledTableCell>Item Number</StyledTableCell>
                  <StyledTableCell>Name Item</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>Left Over</StyledTableCell>
                  <StyledTableCell>Total QTY </StyledTableCell>
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
                  ).map((row, index) =>
                    row.qty !== 0 ? (
                      <>
                        <TableRow
                          key={row.id}
                          id="check-value"
                          className={`rowId-${row.id}`}>
                          <TableCell padding="checkbox" style={{ width: 50 }}>
                            <Checkbox
                              value={row.id}
                              checked={selected[row.id] || allSelected} // <-- is selected
                              onChange={toggleSelected(row)} // <-- toggle state
                            />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.asset_po_number}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.asset_number}
                            {/* {row.asset_number.substring(
                              0,
                              row.asset_number.indexOf("-")
                            )} */}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.asset_name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.desc_po}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.qty}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.real_qty}
                          </TableCell>
                          <TableCell align="center">
                            <button
                              type="button"
                              className="btn-plus"
                              onClick={() => handleIncrement(row.id, row.qty)}>
                              +
                            </button>
                            <span className="item-count" id={`count-${row.id}`}>
                              0
                            </span>
                            <button
                              type="button"
                              className="btn-min"
                              onClick={() => handleDecrement(row.id)}>
                              -
                            </button>
                          </TableCell>
                        </TableRow>
                      </>
                    ) : null
                  )}
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
      <div id="overlay">
        <Loader
          className="loading-data"
          type="Rings"
          color="#CECECE"
          height={550}
          width={80}
        />
      </div>
    </>
  );
};

export default GoodReceiveTicket;

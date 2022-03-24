import React, { useState, useEffect } from "react";
import { prEndPoint, logsEndPoint } from "../../../../../assets/menu";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../../../../asset/Loading";
import "../../../../asset/chips.css";

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
  Toolbar,
  TableRow,
  Typography,
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

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  wrapperQty: {
    position: "relative",
    left: "50%",
    transform: "translateX(-33%)",
  },
  qtyLabel: {
    position: "relative",
    left: "18%",
    top: "-5px",
  },
  wrapperCategory: {
    position: "absolute",
    bottom: "0%",
    width: "100%",
    transform: "translate(0, 230%)",
  },
  addBtn: {
    color: "#1653A6",
    border: "1px solid #1653A6",
    width: "130px",
    height: "35px",
    textTransform: "none",
    fontSize: 16,
    padding: "6px 12px",
    lineHeight: 1.5,
    position: "relative",
    left: "100%",
    top: "50%",
    transform: "translate(-190%,140%)",

    "&:hover": {
      backgroundColor: "#1653A6",
      color: "#FFF",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#0062cc",
      borderColor: "#005cbf",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  },
  table: {
    marginTop: "20px",
    minWidth: 400,
    width: "100%",
    overflowX: "auto",
  },

  posPagination: {
    position: "absolute",
    right: "50px",
  },

  tableWidth: {
    margin: "auto",
    width: "100%",
  },

  thead: {
    "& th": {
      padding: "15px",
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

const HistoryPurchaseOrder = (props) => {
  const classes = useStyles();
  const [dataPO, setDataPO] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [totalRp, setTotalRp] = useState(0);
  const { poDataLog } = props;

  const totalformatRupiah = (money) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(money);
  };

  useEffect(() => {
    getDataPO();
  }, [poDataLog]);

  const getDataPO = async () => {
    let poData = `${prEndPoint[0].url}${
      prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
    }/api/v1/purchase-order/`;

    await axios
      .get(poData)
      .then((response) => {
        let PoData = response.data.data.purchase_order;
        PoData = PoData.filter(
          (row) => row.pr_number === poDataLog[0].pr_number
        );

        let money = JSON.parse(poDataLog[0].gr_item);

        let arr = [];

        money.forEach((item) => arr.push(item.total_price_int));
        const sum = arr.reduce((partialSum, a) => partialSum + a, 0);
        setTotalRp(sum);

        setDataPO(PoData);
        setIsloading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {poDataLog.map((row) => (
        <>
          <TableContainer className={classes.tableWidth}>
            <Paper className={classes.paperTable}>
              <Toolbar>
                <div className="col-10">
                  <Typography
                    variant="h6"
                    component="div"
                    style={{ marginTop: "15px" }}>
                    Purchase Order
                  </Typography>
                </div>
                <div className="col-2">
                  <p>PO : Date {calbill(row.createdAt)}</p>
                </div>
              </Toolbar>

              <Table
                className={classes.table}
                aria-label="custom pagination table">
                <TableHead classes={{ root: classes.thead }}>
                  <TableRow>
                    <StyledTableCell>Item Name</StyledTableCell>
                    <StyledTableCell>User/Dept</StyledTableCell>
                    <StyledTableCell>Ctg</StyledTableCell>
                    <StyledTableCell>Sub Cat.</StyledTableCell>
                    <StyledTableCell>Desc</StyledTableCell>
                    <StyledTableCell>Unit Price</StyledTableCell>
                    <StyledTableCell>QTY</StyledTableCell>
                    <StyledTableCell align="center">Total</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {JSON.parse(poDataLog[0].gr_item).map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.asset_name}
                      </TableCell>

                      <TableCell component="th" scope="row">
                        {row.type_asset}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.category}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.subcategory}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <div className="text-hide"> {row.desc_po} </div>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.price_unit}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.real_qty}
                      </TableCell>
                      <TableCell style={{ width: 100 }} align="center">
                        {row.total_price_unit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <br />
                <TableRow>
                  <TableCell rowSpan={3} />
                  <TableCell colSpan={6} align="right">
                    <Typography
                      variant="subtitle1"
                      component="div"
                      style={{ fontSize: 13 }}>
                      Total All
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={2} align="right">
                    <Typography
                      variant="h6"
                      component="div"
                      style={{ color: "#1653A6", fontWeight: "bold" }}>
                      {totalformatRupiah(totalRp)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </Table>
            </Paper>
          </TableContainer>
          <br />
        </>
      ))}
    </>
  );
};

export default HistoryPurchaseOrder;

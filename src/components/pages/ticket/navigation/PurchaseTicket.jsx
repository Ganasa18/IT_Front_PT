import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
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
  useTheme,
  Toolbar,
  Typography,
} from "@material-ui/core";
import axios from "axios";
import "../../../../assets/master.css";
import "../../../../assets/asset_user.css";
import "../../../asset/chips.css";

import Loading from "../../../asset/Loading";
import { pathEndPoint, prEndPoint } from "../../../../assets/menu";
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
    display: "flex",
    alignItems: "left",
    padding: "0px",
  },

  tableWidth: {
    margin: "auto",
    width: "100%",
  },
  theadDispos: {
    "& th": {
      color: "black",
      backgroundColor: "white",
    },
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
  paperTble: {
    height: "580px",
  },
}));

const useStyles = makeStyles((theme) => ({
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

const PurchaseTicket = () => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [dataPR, setDataPR] = useState([]);
  const req_no = localStorage.getItem("req_no");
  const [listReq, setListReq] = useState([]);

  useEffect(() => {
    getDataPR();
  }, []);

  const getDataPR = async () => {
    let pr_req = `${prEndPoint[0].url}${
      prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
    }/api/v1/purchase-req/`;

    let status = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/status`;

    const requestOne = await axios.get(pr_req);
    const requestTwo = await axios.get(status);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          let newDataRequest = responseOne.data.data.request_purchase;
          let newStatus = responseTwo.data.data.statuss;
          var arr_request = newDataRequest.filter(
            (row) => row.action_req_code === req_no
          );
          arr_request = [...arr_request];

          if (arr_request.length === 0) {
            console.log("no data");
            setIsLoading(false);
            return;
          }

          const arr_status = [...newStatus];

          var statusmap = {};

          arr_status.forEach(function (status_id) {
            statusmap[status_id.id] = status_id;
          });

          arr_request.forEach(function (request_id) {
            request_id.status_id = statusmap[request_id.status_id];
          });

          let jsonList = JSON.parse(arr_request[0].request_list);
          setDataPR(arr_request);
          setListReq(jsonList);

          console.log(arr_request);

          setIsLoading(false);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (dataPR.length === 0) {
    return (
      <>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action ">
            <h3>Purchase Information</h3>
            <div className="flex-item-direction">
              <span
                class="iconify icon-direction"
                data-icon="clarity:pencil-solid"></span>
              <p>No Data</p>
            </div>
          </div>
        </Grid>
      </>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Grid item xs={12} className={classes.cardPadding}>
        <div className="card-asset-action">
          <h3>Purchase Information</h3>
          <div className="row">
            <div className="col-3">
              <p className="label-asset">PR No</p>
              <p>{dataPR[0].purchase_req_code}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Po No</p>
              <p>
                {!dataPR[0].purchase_order_code
                  ? "-"
                  : dataPR[0].purchase_order_code}
              </p>
            </div>

            <div className="col-3">
              <p className="label-asset">Status</p>
              <p className="">
                <span
                  class="chip-action"
                  style={{
                    background: `${dataPR[0].status_id.color_status}4C`,
                    color: `${dataPR[0].status_id.color_status}FF`,
                  }}>
                  {capitalizeFirstLetter(dataPR[0].status_id.status_name)}
                </span>
              </p>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">PR Date</p>
              <p>{calbill(dataPR[0].createdAt)}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">PO Date</p>
              <p>
                {!dataPR[0].purchase_order_date
                  ? "-"
                  : calbill(dataPR[0].purchase_order_date)}
              </p>
            </div>
            <div className="col-3">
              <p className="label-asset">Request No</p>
              <p>{dataPR[0].action_req_code}</p>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} className={classes.cardPadding}>
        <TablePurchaseList listData={listReq} />
      </Grid>
    </>
  );
};

const TablePurchaseList = ({ listData }) => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listPurchase] = useState(listData);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, listPurchase.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer className={classes.tableWidth}>
      <Paper>
        <Toolbar>
          <div className="col-10">
            <Typography
              variant="h6"
              component="div"
              style={{ marginTop: "15px" }}>
              Purchase Request
            </Typography>
          </div>
        </Toolbar>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead classes={{ root: classes.thead }}>
            <TableRow>
              <StyledTableCell>Name Item</StyledTableCell>
              <StyledTableCell>User/Dept</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Sub Category</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>QTY</StyledTableCell>
              <StyledTableCell align="center" np>
                Attachment
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(rowsPerPage > 0
              ? listPurchase.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : listPurchase
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ width: 550 }} component="th" scope="row">
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
                  {row.description}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.qty}
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  {row.img_name ? (
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="download-attch"
                      href={`${prEndPoint[0].url}${
                        prEndPoint[0].port !== ""
                          ? ":" + prEndPoint[0].port
                          : ""
                      }/public/image/purchase/${row.img_name
                        .split(".")
                        .slice(0, -1)
                        .join(".")}${".jpeg"}`}
                      download>
                      download
                    </a>
                  ) : null}
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
                count={listPurchase.length}
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
  );
};

export default PurchaseTicket;

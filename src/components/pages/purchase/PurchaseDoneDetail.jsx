import React, { useState, useEffect, StrictMode } from "react";
import {
  invEndPoint,
  authEndPoint,
  pathEndPoint,
  prEndPoint,
} from "../../../assets/menu";
import Loading from "../../asset/Loading";
import {
  makeStyles,
  Grid,
  Breadcrumbs,
  Typography,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  withStyles,
  useTheme,
  Toolbar,
  Backdrop,
  Fade,
  Modal,
  Divider,
  Snackbar,
  Paper,
} from "@material-ui/core";

import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import PropTypes from "prop-types";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import "../../../assets/master.css";
import "../../../assets/asset_user.css";
import "../../asset/chips.css";
import Cookies from "universal-cookie";
import TablePurchaseOrder from "../../table/purchase/TablePurchaseOrder";

const cookies = new Cookies();
const token = cookies.get("token");

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
  paper: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "35%",
    left: "50%",
    width: 650,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 10, 3),
  },
}));

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

  // posPagination: {
  //   display: "flex",
  //   alignItems: "left",
  //   padding: "0px",
  // },

  posPagination: {
    position: "absolute",
    [theme.breakpoints.up("xl")]: {
      right: "30px",
      marginTop: "-50px",
    },
    [theme.breakpoints.down("lg")]: {
      right: "30px",
      marginTop: "-50px",
    },
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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

const PurchaseDoneDetail = () => {
  const classes = useStyles();
  const dataStorage = localStorage.getItem("ticketData");
  const purchaseData = JSON.parse(dataStorage);
  const [userInfo, setUserInfo] = useState([]);
  const [dataPR, setDataPR] = useState([]);
  const [infoRequest, setInfoRequest] = useState([]);
  const [purchaseList, setPurchaseList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  console.log(purchaseData);

  useEffect(() => {
    getDataInfo();
  }, []);

  const getDataInfo = async () => {
    let act_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/`;

    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory`;

    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    let departement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/departement`;

    let subdepartement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/subdepartement`;

    let pr_req = `${prEndPoint[0].url}${
      prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
    }/api/v1/purchase-req/`;

    const requestOne = await axios.get(act_req);
    const requestTwo = await axios.get(inventory);
    const requestThree = await axios.get(user, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const requestFour = await axios.get(departement);
    const requestFive = await axios.get(subdepartement);

    const requestSix = await axios.get(pr_req);

    axios
      .all([
        requestOne,
        requestTwo,
        requestThree,
        requestFour,
        requestFive,
        requestSix,
      ])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const responseThree = responses[2];
          const responseFour = responses[3];
          const responseFive = responses[4];
          const responseSix = responses[5];

          let newDataRequest = responseOne.data.data.request_tiket;
          let newDataInventory = responseTwo.data.data.inventorys;
          let newDataUser = responseThree.data.data.users;
          let newDataDepartement = responseFour.data.data.departements;
          let newDataSubDepartement = responseFive.data.data.subdepartements;
          let newDataPR = responseSix.data.data.request_purchase;

          newDataPR = newDataPR.filter(
            (row) => row.action_req_code === purchaseData.ticket_number
          );

          newDataUser = newDataUser.map((item) => ({
            id: item.id,
            name: item.username,
            role: item.role,
            departement: item.departement,
            subdepartement: item.subdepartement,
            area: item.area,
            email: item.email,
            employe: item.employe_status,
          }));

          let arr_request = [...newDataRequest];
          const arr_inventory = [...newDataInventory];

          arr_request = arr_request.filter(
            (item) => item.action_req_code === purchaseData.ticket_number
          );

          newDataUser = newDataUser.filter(
            (item) => item.id === parseInt(arr_request[0].user_id)
          );

          var inventmap = {};

          arr_inventory.forEach(function (invent_id) {
            inventmap[invent_id.id] = invent_id;
          });

          arr_request.forEach(function (request_id) {
            request_id.invent_id = inventmap[request_id.asset_id];
          });

          let arr_user = [...newDataUser];
          let arr_departement = [...newDataDepartement];
          let arr_subdepartement = [...newDataSubDepartement];

          var usermap = {};

          arr_departement.forEach(function (id_departement_user) {
            usermap[id_departement_user.id] = id_departement_user;
          });

          arr_user.forEach(function (request_id) {
            request_id.id_departement_user = usermap[request_id.departement];
          });

          var subdepartement = {};

          arr_subdepartement.forEach(function (id_sub_departement_user) {
            subdepartement[id_sub_departement_user.id] =
              id_sub_departement_user;
          });

          arr_user.forEach(function (request_id) {
            request_id.id_sub_departement_user =
              subdepartement[request_id.subdepartement];
          });
          let jsonList = JSON.parse(purchaseData.request_id.request_list);

          setInfoRequest(arr_request);
          setUserInfo(arr_user);
          setPurchaseList(jsonList);
          setDataPR(newDataPR);
          setIsLoading(false);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className={classes.toolbar} />
      <br />
      <Breadcrumbs
        onClick={function () {
          const origin = window.location.origin;
          window.location.href = `${origin}/purchase-done`;
        }}
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        <span className={"span_crumb"}>Purchase Done</span>
        <Typography color="textPrimary">{purchaseData.pr_number}</Typography>
      </Breadcrumbs>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <div className="flex-card">
              <h3>Information</h3>
            </div>
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Request Number</p>
                <p>{purchaseData.ticket_number}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Department</p>
                <p>{userInfo[0].id_departement_user.departement_name}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Request Date</p>
                <p>{calbill(infoRequest[0].createdAt)}</p>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Request Name</p>
                <p>
                  {capitalizeFirstLetter(purchaseData.request_id.request_by)}
                </p>
              </div>
              <div className="col-3">
                <p className="label-asset">Sub Department</p>
                <p>
                  {`${
                    userInfo[0].id_sub_departement_user !== undefined
                      ? capitalizeFirstLetter(
                          userInfo[0].id_sub_departement_user
                            .subdepartement_name
                        )
                      : "none"
                  }`}
                </p>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <div className="flex-card">
              <h3>Admin</h3>
            </div>
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Create By</p>
                <p>
                  {capitalizeFirstLetter(purchaseData.request_id.created_by)}
                </p>
              </div>
              <div className="col-3">
                <p className="label-asset">PR No</p>
                <p>{purchaseData.pr_number}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">PR Date</p>
                <p>{calbill(purchaseData.request_id.createdAt)}</p>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <div className="flex-card">
              <h3>Assent</h3>
            </div>
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Assent By</p>
                <p>
                  {capitalizeFirstLetter(purchaseData.request_id.director_name)}
                </p>
              </div>
              <div className="col-3">
                <p className="label-asset">Date Assent</p>
                <p>{calbill(purchaseData.request_id.approveAt)}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Status</p>
                <p>Aprrove</p>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} className={classes.cardPadding}>
          <TablePurchaseList listData={purchaseList} />
        </Grid>
        <Grid item xs={12} className={classes.cardPadding}>
          <TablePurchaseOrder listData={dataPR} />
        </Grid>
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
                <TableCell style={{ width: 250 }} component="th" scope="row">
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

export default PurchaseDoneDetail;

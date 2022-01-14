import React, { useState, useEffect } from "react";
import { invEndPoint, prEndPoint, authEndPoint } from "../../../assets/menu";
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
  Paper,
  withStyles,
  useTheme,
  Toolbar,
  Backdrop,
  Fade,
  Modal,
  Divider,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import "../../../assets/master.css";
import "../../../assets/asset_user.css";
import "../../asset/chips.css";
import PropTypes from "prop-types";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("token");
const userID = cookies.get("id");

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
    width: 950,
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

function generateOTP() {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

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
const RequestApprove = () => {
  const classes = useStyles();
  const dataStorage = localStorage.getItem("ticketData");
  const parseObject = JSON.parse(dataStorage);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOTP, setIsLoadingOTP] = useState(true);
  const [dataRequest, setDataRequest] = useState([]);
  const [purchaseList, setPurchaseList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataUser, setDataUser] = useState([]);

  useEffect(() => {
    getInfoPR();
    getInfoUser();
  }, []);

  const handleModal = async () => {
    const otpNum = generateOTP();

    localStorage.setItem("otp", otpNum);

    let numberOTP = localStorage.getItem("otp");

    const urlHost = window.location.origin;
    const email = dataUser[0].email;
    const username = dataUser[0].username;
    const purchase = parseObject.action_req_code;
    const request = parseObject.purchase_req_code;

    setModalOpen(true);

    let otp = `${prEndPoint[0].url}${
      prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
    }/api/v1/purchase-req/otp`;

    await axios
      .post(otp, {
        number: numberOTP,
        url: urlHost,
        email: email,
        username: username,
        purchase: purchase,
        request: request,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const resendOTP = async () => {
    const otpNum = generateOTP();
    localStorage.setItem("otp", otpNum);
    let numberOTP = localStorage.getItem("otp");
    const urlHost = window.location.origin;
    const email = dataUser[0].email;
    const username = dataUser[0].username;
    const purchase = parseObject.action_req_code;
    const request = parseObject.purchase_req_code;

    let otp = `${prEndPoint[0].url}${
      prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
    }/api/v1/purchase-req/otp`;

    await axios
      .post(otp, {
        number: numberOTP,
        url: urlHost,
        email: email,
        username: username,
        purchase: purchase,
        request: request,
      })
      .then((response) => {
        console.log(response);
        alert("success resend");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const getInfoPR = async () => {
    let act_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/`;
    await axios
      .get(act_req)
      .then((response) => {
        let newDataRequest = response.data.data.request_tiket;

        newDataRequest = newDataRequest.map((item) => ({
          id: item.id,
          action_req_code: item.action_req_code,
          req_created: item.createdAt,
          user_id: item.user_id,
        }));

        newDataRequest = newDataRequest.filter(
          (item) => item.action_req_code === parseObject.action_req_code
        );
        setDataRequest(newDataRequest);

        let jsonList = JSON.parse(parseObject.request_list);
        setPurchaseList(jsonList);

        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getInfoUser = async () => {
    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    await axios
      .get(user, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        let newDataUser = response.data.data.users;
        newDataUser = newDataUser.map((row) => ({
          id: row.id,
          username: row.username,
          email: row.email,
        }));

        newDataUser = newDataUser.filter(
          (item) => item.id === parseInt(userID)
        );

        setDataUser(newDataUser);
        setIsLoadingOTP(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <div className="row">
            <div className="col-12">
              <h3>Approve Purchase</h3>
            </div>
          </div>
          <Divider />
          <br />
          <form>
            <div className="row">
              <div className="col-5">
                <p style={{ fontWeight: "bold" }}>Submit OTP</p>
                <p style={{ fontWeight: "300" }}>
                  Check your mail to know the OTP
                </p>
                {isLoadingOTP ? null : (
                  <p style={{ fontWeight: "300" }}>{dataUser[0].email}</p>
                )}

                <input
                  type="text"
                  id="OtpNumber"
                  className="form-input"
                  placeholder="OTP..."
                />
                <small>
                  Not send yet ?
                  <span className="resend" onClick={resendOTP}>
                    {" "}
                    Resend
                  </span>
                </small>
              </div>
              <div className="col-1"></div>
              <div className="col-6">
                <label style={{ fontWeight: "bold" }}>Leave Comment</label>
                <textarea
                  className="form-input-area"
                  placeholder="Comment here... "
                  cols="30"
                  rows="10"></textarea>
              </div>
            </div>
            <br />
            <div className="footer-modal">
              <button className="btn-cancel" onClick={handleModalClose}>
                Cancel
              </button>
              <button className="btn-submit" type="submit">
                Approve
              </button>
            </div>
          </form>
          <br />
        </div>
      </Fade>
    </>
  );

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
          window.location.href = `${origin}/procurement-approval`;
        }}
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        <span className={"span_crumb"}>Action Request</span>
        <Typography color="textPrimary">
          {parseObject.action_req_code}
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <div className="flex-card">
              <h3>Information</h3>

              <div className="button-approve">
                <button
                  type="button"
                  onClick={handleModal}
                  className="approve-btn">
                  Approve
                </button>
                <button type="button" className="deny-btn">
                  Deny
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <p className="label-asset">PR Number</p>
                <p>{parseObject.purchase_req_code}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">PR Date</p>
                <p>{calbill(parseObject.createdAt)}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Request Name</p>
                <p>{capitalizeFirstLetter(parseObject.request_by)}</p>
              </div>
              <div className="col-3">
                <p className="label-asset text-center">Status</p>
                <p className="text-center">
                  <span
                    className="chip-action"
                    style={{
                      background: `${parseObject.status_id.color_status}4C`,
                      color: `${parseObject.status_id.color_status}FF`,
                    }}>
                    {capitalizeFirstLetter(parseObject.status_id.status_name)}
                  </span>
                </p>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Create By</p>
                <p>{capitalizeFirstLetter(parseObject.created_by)}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Request No</p>
                <p>{capitalizeFirstLetter(parseObject.action_req_code)}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Request Date</p>
                <p className="wrap-paraf">
                  {calbill(dataRequest[0].req_created)}
                </p>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} className={classes.cardPadding}>
          <TablePurchaseList listData={purchaseList} />
        </Grid>
      </Grid>
      <Modal
        open={modalOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModal}
      </Modal>
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

export default RequestApprove;

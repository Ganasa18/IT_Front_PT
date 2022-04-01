import React, { useState, useEffect } from "react";
import { pathEndPoint, prEndPoint, authEndPoint } from "../../../assets/menu";
import Loader from "react-loader-spinner";
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
  Snackbar,
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
import MuiAlert from "@material-ui/lab/Alert";
import ModalGalery from "../../asset/ModalGalery";
const cookies = new Cookies();
const token = cookies.get("token");
const userID = cookies.get("id");

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

const DisposalApproveDetail = () => {
  const classes = useStyles();
  const dataStorage = localStorage.getItem("ticketDispos");
  const parseObject = JSON.parse(dataStorage);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenDeny, setModalOpenDeny] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const [toast, setToast] = useState(false);
  const [isLoadingOTP, setIsLoadingOTP] = useState(true);
  // const [inputOTP, setInputOTP] = useState("");
  const [buttonAllow, setButtonAllow] = useState(false);
  const [timer, setTimer] = useState(null);
  const [modalGaleryOpen, setModalGaleryOpen] = useState(false);
  const [areaInput, setAreaInput] = useState(null);
  // console.log(JSON.parse(parseObject.item_list));

  // console.log(parseObject);
  // console.log(dataUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById("overlay").style.display = "block";
    let numberOTP = localStorage.getItem("otp");

    let updatedsp = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/disposal/updated-status-dispos`;

    const dataUpdated = {
      disposal_code: parseObject.disposal_code,
      pic_name: dataUser[0].username,
      pic_comment: areaInput,
      status_approval: 7,
      number_otp: numberOTP,
    };

    await axios
      .patch(updatedsp, dataUpdated)
      .then((response) => {
        alert("success");
      })
      .catch((error) => {
        console.error(error);
        alert("something wrong");
      });

    setTimeout(() => {
      window.location.href = `${origin}/disposal-asset-approval`;
    }, 2000);
  };

  useEffect(() => {
    getInfoUser();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(false);
  };

  const handleOtp = (e) => {
    const Otp = document.querySelector("#OtpNumber");
    const otpNow = localStorage.getItem("otp");

    setButtonAllow(false);
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setTimer(
      setTimeout(() => {
        if (e !== otpNow) {
          if (Otp.classList[1] !== undefined) {
            Otp.classList.remove("success");
          }
          Otp.classList.add("fail");
          return;
        }
        if (Otp.classList[1] !== undefined) {
          Otp.classList.remove("fail");
        }

        setButtonAllow(true);
        Otp.classList.add("success");
        console.log(e);
      }, 3000)
    );
  };

  const resendOTP = async () => {
    const otpNum = generateOTP();
    localStorage.setItem("otp", otpNum);
    let numberOTP = localStorage.getItem("otp");
    const urlHost = window.location.origin;
    const email = dataUser[0].email;
    const username = dataUser[0].username;
    const request = parseObject.disposal_code;

    let otp = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/disposal/disposal-otp`;

    await axios
      .post(otp, {
        number: numberOTP,
        url: urlHost,
        email: email,
        username: username,
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

  const handleModal = async () => {
    const otpNum = generateOTP();

    localStorage.setItem("otp", otpNum);
    let numberOTP = localStorage.getItem("otp");
    console.log(numberOTP);

    const urlHost = window.location.origin;
    const email = dataUser[0].email;
    const username = dataUser[0].username;
    const request = parseObject.disposal_code;
    setModalOpen(true);

    let otp = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/disposal/disposal-otp`;

    await axios
      .post(otp, {
        number: numberOTP,
        url: urlHost,
        email: email,
        username: username,
        request: request,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalDeny = () => {
    setModalOpenDeny((prevModal) => !prevModal);
  };

  let updatedsp = `${pathEndPoint[0].url}${
    pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
  }/api/v1/disposal/updated-status-dispos`;

  const handleDeny = async () => {
    const host = window.location.origin;

    const dataUpdated = {
      disposal_code: parseObject.disposal_code,
      pic_name: dataUser[0].username,
      status_approval: 20,
    };

    await axios
      .patch(updatedsp, dataUpdated)
      .then((response) => {
        console.log("success");
      })
      .catch((error) => {
        console.error(error);
        alert("something wrong");
      });

    const listDisp = JSON.parse(parseObject.item_list);

    listDisp.forEach((el) => {
      // Updated Status
      axios
        .patch(
          `${pathEndPoint[0].url}${
            pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
          }/api/v1/inventory/updated-status/${el.id}/disposal/`,
          {
            disposal: false,
          }
        )
        .then((response) => {
          console.log("success");
        })
        .catch((error) => {
          console.error(error);
        });
    });
    setToast(true);
    setTimeout(() => {
      window.location = `${host}/disposal-asset-approval/`;
    }, 3000);
  };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <div className="row">
            <div className="col-12">
              <h3>Approve Disposal</h3>
            </div>
          </div>
          <Divider />
          <br />
          <form onSubmit={handleSubmit}>
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
                  className="form-input-otp"
                  placeholder="OTP..."
                  maxLength="6"
                  autoComplete="off"
                  onChange={(e) => handleOtp(e.target.value)}
                />
                <small>
                  Not send yet ?
                  <span className="resend" onClick={resendOTP}>
                    Resend
                  </span>
                </small>
              </div>
              <div className="col-1"></div>
              <div className="col-6">
                <label style={{ fontWeight: "bold" }}>Leave Comment</label>
                <textarea
                  value={areaInput}
                  onChange={(e) => setAreaInput(e.target.value)}
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
              <button
                className={`btn-submit ${buttonAllow ? "" : "disabled"}`}
                disabled={`${buttonAllow ? "" : "disabled"}`}
                type="submit">
                Approve
              </button>
            </div>
          </form>
          <br />
        </div>
      </Fade>
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

  const bodyDeny = (
    <>
      <Fade in={modalOpenDeny}>
        <div className={classes.paper}>
          <h3>Are you sure want to deny {parseObject.disposal_code}</h3>
          <Divider />
          <br />
          <div className="footer-modal">
            <button className="btn-cancel" onClick={handleModalDeny}>
              Cancel
            </button>
            <button className="btn-submit" onClick={handleDeny}>
              Submit
            </button>
          </div>
        </div>
      </Fade>
    </>
  );

  return (
    <>
      <div className={classes.toolbar} />
      <br />
      <Breadcrumbs
        onClick={function () {
          const origin = window.location.origin;
          window.location.href = `${origin}/disposal-asset-approval`;
        }}
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        <span className={"span_crumb"}>Disposal Asset</span>
        <Typography color="textPrimary">{parseObject.disposal_code}</Typography>
      </Breadcrumbs>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <div className="flex-card">
              <h3>Information</h3>

              {parseObject.status_id.id === 10 && (
                <>
                  <div className="button-approve">
                    <button
                      type="button"
                      onClick={handleModal}
                      className="approve-btn">
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={handleModalDeny}
                      className="deny-btn">
                      Deny
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Disposal No</p>
                <p>{parseObject.disposal_code}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Disposal Name</p>
                <p>{parseObject.disposal_name}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Condition</p>
                <p>{parseObject.status_id_disposal.status_name}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Status</p>
                <p>
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
                <p className="label-asset">Date Create</p>
                <p>{calbill(parseObject.createdAt)}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Reason</p>
                <p className="wrap-paraf">{parseObject.disposal_desc}</p>
              </div>
              {parseObject.pic_name !== null ? (
                <div className="col-3">
                  <p className="label-asset">Approval</p>
                  <p>{parseObject.pic_name}</p>
                </div>
              ) : null}

              {parseObject.img_list !== null ? (
                <div className="col-3">
                  <p className="label-asset">Image</p>
                  <p>
                    <button
                      className="attachment-view"
                      onClick={() => setModalGaleryOpen(true)}>
                      view
                    </button>
                    <ModalGalery
                      imgList={parseObject.img_list}
                      onClose={() => setModalGaleryOpen(false)}
                      show={modalGaleryOpen}
                    />
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} className={classes.cardPadding}>
          <TableDisposalList listData={JSON.parse(parseObject.item_list)} />
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
      <Modal
        open={modalOpenDeny}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyDeny}
      </Modal>
      <Snackbar
        autoHideDuration={5000}
        open={toast}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="success">
          submit successful
        </Alert>
      </Snackbar>
    </>
  );
};

const TableDisposalList = ({ listData }) => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [listDisposal] = useState(listData);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, listDisposal.length - page * rowsPerPage);

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
        <Table className={classes.table} aria-label="custom pagination table">
          <TableHead classes={{ root: classes.thead }}>
            <TableRow>
              <StyledTableCell>Asset No</StyledTableCell>
              <StyledTableCell>Item</StyledTableCell>
              <StyledTableCell>User/Dept.</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Sub Category</StyledTableCell>
              <StyledTableCell>Area</StyledTableCell>
              <StyledTableCell>QTY</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? listDisposal.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : listDisposal
            ).map((row) => (
              <TableRow key={row.id}>
                <TableCell style={{ width: 250 }} component="th" scope="row">
                  {row.asset_number}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.asset_name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.type_asset}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.category_name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.subcategory_name}
                </TableCell>
                <TableCell component="th" scope="row">
                  {`${row.area_name}-${row.alias_name}`}
                </TableCell>
                <TableCell component="th" scope="row">
                  {`${row.asset_quantity}`}
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
                count={listDisposal.length}
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

export default DisposalApproveDetail;

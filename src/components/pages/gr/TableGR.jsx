import React, { useState, useEffect } from "react";
import {
  pathEndPoint,
  prEndPoint,
  invEndPoint,
  authEndPoint,
  logsEndPoint,
} from "../../../assets/menu";
import Loading from "../../asset/Loading";
import PropTypes from "prop-types";
import axios from "axios";
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

const TableGR = () => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataGR, setDataGR] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getDataList();
  }, []);

  const getDataList = async () => {
    let pr_req = `${prEndPoint[0].url}${
      prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
    }/api/v1/purchase-req/`;

    let act_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/`;

    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    let departement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/departement`;

    let subdepartement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/subdepartement`;

    let area = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/area`;

    let role = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/role`;

    const logs = `${logsEndPoint[0].url}${
      logsEndPoint[0].port !== "" ? ":" + logsEndPoint[0].port : ""
    }/api/v1/logs-login/get-latest-ar-history`;

    const requestOne = await axios.get(pr_req);
    const requestTwo = await axios.get(act_req);
    const requestThree = await axios.get(user, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const requestFour = await axios.get(departement);
    const requestFive = await axios.get(subdepartement);
    const requestSix = await axios.get(area);
    const requestSeven = await axios.get(role, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const requestEight = await axios.get(logs);

    axios
      .all([
        requestOne,
        requestTwo,
        requestThree,
        requestFour,
        requestFive,
        requestSix,
        requestSeven,
        requestEight,
      ])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const responseThree = responses[2];
          const responseFour = responses[3];
          const responseFive = responses[4];
          const responseSix = responses[5];
          const responseSeven = responses[6];
          const responseEight = responses[7];
          let newDataRequest = responseOne.data.data.request_purchase;
          let newDataTicket = responseTwo.data.data.request_tiket;
          let newDataUser = responseThree.data.data.users;
          let newDataDepartement = responseFour.data.data.departements;
          let newDataSubDepartement = responseFive.data.data.subdepartements;
          let newDataArea = responseSix.data.data.areas;
          let newDataRole = responseSeven.data.data.roles;
          let newDataLog = responseEight.data.data.ar_log;

          const getUser = newDataUser.map((item) => ({
            id: item.id,
            name: item.username,
            role: item.role,
            departement: item.departement,
            subdepartement: item.subdepartement,
            area: item.area,
            email: item.email,
            employe: item.employe_status,
          }));

          var prmap = {};

          newDataRequest = newDataRequest.filter(
            (item) => item.action_req_code.replace(/[0-9]/g, "") === "MKDAR"
          );

          newDataTicket.forEach(function (request_id) {
            prmap[request_id.action_req_code] = request_id;
          });

          newDataRequest.forEach(function (purchase) {
            purchase.request_id = prmap[purchase.action_req_code];
          });

          getUser.forEach(function (id_user) {
            prmap[id_user.id] = id_user;
          });

          newDataRequest.forEach(function (purchase) {
            purchase.id_user = prmap[purchase.request_id.user_id];
          });

          newDataDepartement.forEach(function (id_departement_user) {
            prmap[id_departement_user.id] = id_departement_user;
          });

          newDataRequest.forEach(function (purchase) {
            purchase.id_departement_user = prmap[purchase.id_user.departement];
          });

          var subdepartement = {};

          newDataSubDepartement.forEach(function (id_sub_departement_user) {
            subdepartement[id_sub_departement_user.id] =
              id_sub_departement_user;
          });

          newDataRequest.forEach(function (request_id) {
            request_id.id_sub_departement_user =
              subdepartement[request_id.id_user.subdepartement];
          });

          newDataArea.forEach(function (id_area_user) {
            prmap[id_area_user.id] = id_area_user;
          });

          newDataRequest.forEach(function (request_id) {
            request_id.id_area_user = prmap[request_id.id_user.area];
          });

          newDataRole.forEach(function (id_role_user) {
            prmap[id_role_user.id] = id_role_user;
          });
          newDataRequest.forEach(function (request_id) {
            request_id.id_role_user = prmap[request_id.id_user.role];
          });

          var logsmap = {};

          newDataLog.forEach(function (logs_id) {
            logsmap[logs_id.request_number] = logs_id;
          });

          newDataRequest.forEach(function (request_id) {
            request_id.logs_id = logsmap[request_id.action_req_code];
          });

          let newDataFilter = newDataRequest.filter(
            (item) =>
              parseInt(item.request_id.status_id) === 13 ||
              parseInt(item.request_id.status_id) === 14
          );

          setDataGR(newDataFilter);
          setIsLoading(false);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, dataGR.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const storeData = (row) => {
    localStorage.setItem("req_no", row.action_req_code);
    localStorage.setItem("ticketData", JSON.stringify(row));
  };

  return (
    <>
      <TableContainer className={classes.tableWidth}>
        <Paper>
          <Table className={classes.table} aria-label="custom pagination table">
            <TableHead classes={{ root: classes.thead }}>
              <TableRow>
                <StyledTableCell>PR No</StyledTableCell>
                <StyledTableCell>Request No</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Department</StyledTableCell>
                <StyledTableCell>Date Create</StyledTableCell>
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
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      <Link
                        onClick={() => storeData(row)}
                        to="/gr/asset/detail">
                        {row.purchase_req_code}
                      </Link>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.action_req_code}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.request_by}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.id_departement_user.departement_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {calbill(row.createdAt)}
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
    </>
  );
};

export default TableGR;

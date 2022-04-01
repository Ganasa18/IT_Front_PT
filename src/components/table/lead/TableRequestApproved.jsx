import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { pathEndPoint, invEndPoint, authEndPoint } from "../../../assets/menu";
import Loading from "../../asset/Loading";
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
  Fade,
  Modal,
  Backdrop,
  Snackbar,
} from "@material-ui/core";
import "../../../assets/master.css";
import "../../asset/chips.css";

import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("token");
const userID = cookies.get("id");
const DepartementID = cookies.get("departement");

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

const storeData = (row) => {
  localStorage.setItem("ticketData", JSON.stringify(row));
};

const TableRequestApproved = (props) => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataRequest, setDataRequest] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { searchValue } = props;

  useEffect(() => {
    getStatusList();

    if (searchValue) {
      setTimeout(() => {
        searchHandle(searchValue);
      }, 1000);
    }
  }, [searchValue]);

  function filterByValue(array, value) {
    return array.filter(
      (data) =>
        JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  const searchHandle = (searchValue) => {
    if (searchValue !== null) {
      let searchRequest = filterByValue(dataRequest, searchValue);
      setDataRequest(searchRequest);
    }
  };

  const getStatusList = async () => {
    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    let act_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/`;

    let status = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/status`;

    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory`;

    let area = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/area`;

    let role = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/role`;

    let departement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/departement`;

    let subdepartement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/subdepartement`;

    const requestOne = await axios.get(user, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const requestTwo = await axios.get(act_req);
    const requestThree = await axios.get(status);
    const requestFour = await axios.get(inventory);
    const requestFive = await axios.get(area);
    const requestSix = await axios.get(role, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const requestSevent = await axios.get(departement);
    const requestEight = await axios.get(subdepartement);

    axios
      .all([
        requestOne,
        requestTwo,
        requestThree,
        requestFour,
        requestFive,
        requestSix,
        requestSevent,
        requestEight,
      ])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const responseThree = responses[2];
          const responseFour = responses[3];
          const requestFive = responses[4];
          const requestSix = responses[5];
          const requestSevent = responses[6];
          const requestEight = responses[7];

          let newDataUser = responseOne.data.data.users;
          let newDataRequest = responseTwo.data.data.request_tiket;
          let newStatus = responseThree.data.data.statuss;
          let newInvent = responseFour.data.data.inventorys;
          let newDataArea = requestFive.data.data.areas;
          let newDataRole = requestSix.data.data.roles;
          let newDataDepartement = requestSevent.data.data.departements;
          let newDataSubDepartement = requestEight.data.data.subdepartements;

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

          var arr_request = [...newDataRequest];
          const arr_status = [...newStatus];
          const arr_inventory = [...newInvent];
          const arr_area = [...newDataArea];
          const arr_role = [...newDataRole];
          const arr_departement = [...newDataDepartement];
          const arr_subdepartement = [...newDataSubDepartement];

          arr_request = arr_request.filter(
            (item) =>
              parseInt(item.departement_id) === parseInt(DepartementID) &&
              parseInt(item.user_id) !== parseInt(userID) &&
              parseInt(item.status_id) === 10
          );

          var statusmap = {};

          arr_status.forEach(function (status_id) {
            statusmap[status_id.id] = status_id;
          });

          arr_request.forEach(function (request_id) {
            request_id.status_id = statusmap[request_id.status_id];
          });

          let JoinStatus = arr_request;

          var inventmap = {};

          arr_inventory.forEach(function (invent_id) {
            inventmap[invent_id.id] = invent_id;
          });

          JoinStatus.forEach(function (request_id) {
            request_id.invent_id = inventmap[request_id.asset_id];
          });

          let JoinInvent = JoinStatus;
          // setDataRequest(JoinInvent);

          var usermap = {};
          getUser.forEach(function (id_user) {
            usermap[id_user.id] = id_user;
          });

          JoinInvent.forEach(function (request_id) {
            request_id.id_user = usermap[request_id.user_id];
          });

          arr_area.forEach(function (id_area_user) {
            usermap[id_area_user.id] = id_area_user;
          });

          JoinInvent.forEach(function (request_id) {
            request_id.id_area_user = usermap[request_id.id_user.area];
          });

          arr_role.forEach(function (id_role_user) {
            usermap[id_role_user.id] = id_role_user;
          });

          JoinInvent.forEach(function (request_id) {
            request_id.id_role_user = usermap[request_id.id_user.role];
          });

          arr_departement.forEach(function (id_departement_user) {
            usermap[id_departement_user.id] = id_departement_user;
          });

          JoinInvent.forEach(function (request_id) {
            request_id.id_departement_user =
              usermap[request_id.id_user.departement];
          });

          var subdepartement = {};

          arr_subdepartement.forEach(function (id_sub_departement_user) {
            subdepartement[id_sub_departement_user.id] =
              id_sub_departement_user;
          });

          JoinInvent.forEach(function (request_id) {
            request_id.id_sub_departement_user =
              subdepartement[request_id.id_user.subdepartement];
          });

          setDataRequest(JoinInvent);
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
    Math.min(rowsPerPage, dataRequest.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer className={classes.tableWidth}>
        <Paper>
          <Table className={classes.table} aria-label="custom pagination table">
            <TableHead classes={{ root: classes.thead }}>
              <TableRow>
                <StyledTableCell>Request No</StyledTableCell>
                <StyledTableCell>Asset No</StyledTableCell>
                <StyledTableCell>Asset Name</StyledTableCell>
                <StyledTableCell>Date Created</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? dataRequest.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : dataRequest
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      <Link
                        onClick={() => storeData(row)}
                        to="/approval/action-request/detail">
                        {row.action_req_code}
                      </Link>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.invent_id.asset_number}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.invent_id.asset_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {`${calbill(row.createdAt)}`}
                    </TableCell>

                    <TableCell component="th" scope="row" align="center">
                      <span
                        className="chip"
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
                  count={dataRequest.length}
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

export default TableRequestApproved;

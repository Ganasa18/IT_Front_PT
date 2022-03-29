import React, { useState, useEffect } from "react";
import { authEndPoint, pathEndPoint } from "../../assets/menu";
import PropTypes from "prop-types";
import axios from "axios";
import Loading from "../asset/Loading";
import SelectSearch, { fuzzySearch } from "react-select-search";
import { Link } from "react-router-dom";
import "../../assets/select-search.css";

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
    width: 850,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
}));

const TableUser = (props) => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModal, setEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataRole, setDataRole] = useState([]);
  const [dataDepartement, setDataDepartement] = useState([]);
  const [dataSubDepartement, setDataSubDepartement] = useState([]);
  const [dataArea, setDataArea] = useState([]);
  const [valueArea, setValueArea] = useState("");
  const [valueDepartement, setValueDepartement] = useState("");
  const [valueSubDepartement, setValueSubDepartement] = useState("");
  const [valueRole, setValueRole] = useState("");
  const [valueUsername, setValueUsername] = useState("");
  const [valueEmail, setValueEmail] = useState("");
  const [valueNoHP, setValueNoHP] = useState("");
  const [valueUserId, setValueUserId] = useState("");
  const [resultJoinUser, setResultJoinUser] = useState([]);
  const [selectedValueEmply, setSelectedValueEmply] = useState("permanent");

  const { searchValue } = props;

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

  const handleChangeEmply = (event) => {
    setSelectedValueEmply(event.target.value);
  };

  //   GET DATA
  console.log(searchValue);

  useEffect(() => {
    getDataUser();
    getAreaList();
    getRoleList();

    if (searchValue) {
      setTimeout(() => {
        searchHandle(searchValue);
      }, 1000);
    }
  }, [searchValue]);

  const searchHandle = (searchValue) => {
    setIsLoading(true);
    if (searchValue !== null) {
      if (searchValue.length === 1) {
        setTimeout(() => {
          getDataUser();
        }, 2000);
        return;
      }
      setTimeout(() => {
        let searchJoinUser = resultJoinUser.filter((item) =>
          item.username.toLowerCase().match(searchValue)
        );
        setResultJoinUser(searchJoinUser);
        setIsLoading(false);
      }, 2000);
    }
  };

  const getDataUser = async () => {
    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

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

    const requestTwo = await axios.get(area);
    const requestThree = await axios.get(role, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const requestFour = await axios.get(departement);

    const requestFive = await axios.get(subdepartement);

    axios
      .all([requestOne, requestTwo, requestThree, requestFour, requestFive])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const responesThree = responses[2];
          const responesFour = responses[3];
          const responesFive = responses[4];

          let newDataUser = responseOne.data.data.users;
          let newDataArea = responseTwo.data.data.areas;
          let newDataRole = responesThree.data.data.roles;
          let newDataDepartement = responesFour.data.data.departements;
          let newDataSubDepartement = responesFive.data.data.subdepartements;

          const arr_user = [...newDataUser];
          const arr_area = [...newDataArea];
          const arr_role = [...newDataRole];
          const arr_departement = [...newDataDepartement];
          const arr_subdepartement = [...newDataSubDepartement];

          const newArrDepart = arr_departement.map((row) => ({
            value: row.id,
            name: row.departement_name,
          }));

          const newArrSubDepart = arr_subdepartement.map((row) => ({
            value: row.id,
            name: row.subdepartement_name,
          }));

          var areamap = {};
          arr_area.forEach(function (area_id) {
            areamap[area_id.id] = area_id;
          });
          // now do the "join":
          arr_user.forEach(function (user) {
            user.area_id = areamap[user.area];
          });
          let JoinArea = arr_user;

          var rolemap = {};
          arr_role.forEach(function (role_id) {
            rolemap[role_id.id] = role_id;
          });

          JoinArea.forEach(function (user) {
            user.role_id = rolemap[user.role];
          });
          let JoinRole = JoinArea;

          var departementmap = {};
          newArrDepart.forEach(function (depart_id) {
            departementmap[depart_id.value] = depart_id;
          });

          JoinRole.forEach(function (user) {
            user.depart_id = departementmap[user.departement];
          });

          let JoinDepartement = JoinArea;
          var subdepartementmap = {};
          newArrSubDepart.forEach(function (subdepart_id) {
            subdepartementmap[subdepart_id.value] = subdepart_id;
          });
          JoinDepartement.forEach(function (user) {
            user.subdepart_id = subdepartementmap[user.subdepartement];
          });

          let JoinSubDepartement = JoinDepartement;

          setResultJoinUser(JoinSubDepartement);
          setIsLoading(false);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  const handleUserDelete = async (row) => {
    await axios.delete(
      `${authEndPoint[0].url}${
        authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
      }/api/v1/auth/${row.id}/${token}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleEditUser = async (row) => {
    setEditModal(true);
    setSelectedValueEmply(row.employe_status);
    setValueUsername(row.username);
    setValueArea(row.area);
    setValueEmail(row.email);
    setValueNoHP(row.no_handphone);
    setValueDepartement(row.departement);
    setValueSubDepartement(row.subdepartement);
    setValueRole(row.role);
    setValueUserId(row.uuid);
  };

  const getAreaList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/area`
      )
      .then((response) => {
        const DataArea = response.data.data.areas;

        const arr = [...DataArea];
        const newArr = arr.map((row) => ({
          value: row.id,
          name: row.area_name,
        }));
        setDataArea(newArr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getRoleList = async () => {
    await axios
      .get(
        `${authEndPoint[0].url}${
          authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
        }/api/v1/role`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        const DataRole = response.data.data.roles;

        const arr = [...DataRole];
        const newArr = arr.map((row) => ({
          value: row.id,
          name: row.role_name,
        }));
        setDataRole(newArr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleArea = async (e) => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/departement`
      )
      .then((response) => {
        const DepartementList = response.data.data.departements;
        const depart = [...DepartementList];
        const idDepart = depart.filter((item) => item.id_area === e);
        if (idDepart === undefined || idDepart.length === 0) {
          setDataDepartement([]);
        } else {
          const newArr = idDepart.map((dpt) => ({
            value: dpt.id,
            name: dpt.departement_name,
          }));
          setDataDepartement(newArr);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubDepartement = async (e) => {
    setValueDepartement(e);
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/subdepartement/${valueDepartement}`
      )
      .then((response) => {
        const SubDepartementList = response.data.data.subdepartement;
        console.log(SubDepartementList);
        const newArr = SubDepartementList.map((dpt) => ({
          value: dpt.id,
          name: dpt.subdepartement_name,
        }));
        setDataSubDepartement(newArr);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const saveHandler = async (event) => {
    event.preventDefault();

    await axios
      .patch(
        `${authEndPoint[0].url}${
          authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
        }/api/v1/auth/${valueUserId}`,
        {
          username: valueUsername,
          email: valueEmail,
          password: "123",
          no_handphone: valueNoHP,
          area: valueArea,
          departement: valueDepartement,
          subdepartement: valueSubDepartement,
          employe_status: selectedValueEmply,
          role: valueRole,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log(valueSubDepartement);
        alert(response.data.status);
        setSelectedValueEmply("permanent");
        setValueUsername("");
        setValueEmail("");
        setValueNoHP("");
        setValueArea("");
        setValueDepartement("");
        setValueSubDepartement("");
        setValueRole("");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  const handleResetPassword = async (row) => {
    await axios
      .patch(
        `${authEndPoint[0].url}${
          authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
        }/api/v1/auth/${row.uuid}`,
        {
          password: "123",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        console.log(valueSubDepartement);
        alert(response.data.status);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, resultJoinUser.length - page * rowsPerPage);

  const bodyModal = (
    <>
      <Fade in={editModal}>
        <div className={classes.paper}>
          <form onSubmit={saveHandler}>
            <div className="row">
              <div className="col-12">
                <h3>Edit User</h3>
              </div>
              <div className="col-6">
                <label htmlFor="">Employee Status</label>
                <div className="wrapper-radio">
                  <input
                    type="radio"
                    name="select"
                    id="option-1"
                    value="permanent"
                    checked={selectedValueEmply === "permanent"}
                    onChange={handleChangeEmply}
                  />
                  <input
                    type="radio"
                    name="select"
                    id="option-2"
                    value="temporary"
                    checked={selectedValueEmply === "temporary"}
                    onChange={handleChangeEmply}
                  />
                  <label for="option-1" className="option option-1">
                    <div className="dot"></div>
                    <span>Permanent</span>
                  </label>
                  <label for="option-2" className="option option-2">
                    <div className="dot"></div>
                    <span>Temporary</span>
                  </label>
                </div>
              </div>
              <div className="col-6">
                <label htmlFor="roleName">Area</label>
                <SelectSearch
                  options={dataArea}
                  value={valueArea}
                  filterOptions={fuzzySearch}
                  onChange={handleArea}
                  search
                  placeholder="Search Area"
                />
              </div>
              <div className="col-6">
                <label htmlFor="roleName">Name</label>
                <input
                  type="text"
                  id="roleName"
                  className="form-input"
                  defaultValue={valueUsername}
                  onChange={(e) => setValueUsername(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label htmlFor="roleName">Departement</label>
                <SelectSearch
                  options={dataDepartement}
                  value={valueDepartement}
                  filterOptions={fuzzySearch}
                  onChange={handleSubDepartement}
                  search
                  placeholder="Search Departement"
                />
              </div>
              <div className="col-6">
                <label htmlFor="roleName">Email</label>
                <input
                  type="text"
                  className="form-input"
                  defaultValue={valueEmail}
                  disabled
                />
              </div>
              <div className="col-6">
                <label htmlFor="roleName">Sub Departement</label>
                <SelectSearch
                  options={dataSubDepartement}
                  value={valueSubDepartement}
                  onChange={setValueSubDepartement}
                  filterOptions={fuzzySearch}
                  search
                  placeholder="Search Sub Departement"
                />
              </div>

              <div className="col-6">
                <label htmlFor="roleName">No Hp</label>
                <input
                  type="text"
                  defaultValue={valueNoHP}
                  className="form-input"
                  onChange={(e) => setValueNoHP(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label htmlFor="roleName">Role</label>
                <SelectSearch
                  options={dataRole}
                  value={valueRole}
                  onChange={setValueRole}
                  filterOptions={fuzzySearch}
                  search
                  placeholder="Search Role"
                />
              </div>
            </div>
            <br />
            <div className="footer-modal">
              <button className={"btn-cancel"} onClick={modalClose}>
                Cancel
              </button>
              <button className={"btn-submit"} type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </Fade>
    </>
  );

  return (
    <>
      <TableContainer className={classes.tableWidth}>
        <Paper>
          <Table className={classes.table} aria-label="custom pagination table">
            <TableHead classes={{ root: classes.thead }}>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>No HP</StyledTableCell>
                <StyledTableCell>Area</StyledTableCell>
                <StyledTableCell>Departement</StyledTableCell>
                <StyledTableCell>Sub Departement</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? resultJoinUser.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : resultJoinUser
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      <Link
                        to={{
                          pathname: "/user/asset",
                          query: {
                            row,
                          },
                        }}>
                        {row.username}
                      </Link>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.email}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.no_handphone === null
                        ? "No Number"
                        : row.no_handphone}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.area_id.area_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.depart_id === undefined
                        ? "undefined"
                        : row.depart_id.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.subdepart_id === undefined
                        ? "undefined"
                        : row.subdepart_id.name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.role_id.role_name}
                    </TableCell>

                    <TableCell style={{ width: 300 }} align="center">
                      <button
                        className="btn-edit"
                        onClick={(e) => handleEditUser(row)}>
                        <span
                          class="iconify icon-btn"
                          data-icon="ci:edit"></span>
                        <span className="name-btn">Edit</span>
                      </button>
                      <button
                        className="btn-reset"
                        onClick={(e) => handleResetPassword(row)}>
                        <span
                          class="iconify icon-btn"
                          data-icon="grommet-icons:power-reset"></span>
                        <span className="name-btn">Reset</span>
                      </button>
                      <button
                        disabled={`${
                          row.role_id.role_name === "admin" ? "disabled" : ""
                        }`}
                        className={`btn-delete ${
                          row.role_id.role_name === "admin" ? "disabled" : ""
                        } `}
                        onClick={(e) => handleUserDelete(row)}>
                        <span
                          class="iconify icon-btn"
                          data-icon="ant-design:delete-filled"></span>
                        <span className="name-btn">Delete</span>
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
                  count={resultJoinUser.length}
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
      <Modal
        open={editModal}
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

export default TableUser;

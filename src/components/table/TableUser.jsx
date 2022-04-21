import {
  Backdrop,
  Divider,
  Fade,
  makeStyles,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  withStyles,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SelectSearch, { fuzzySearch } from "react-select-search";
import Cookies from "universal-cookie";
import "../../assets/master.css";
import { authEndPoint, pathEndPoint } from "../../assets/menu";
import "../../assets/select-search.css";
import Loading from "../asset/Loading";
import TablePaginationActions from "../asset/pagination/TablePaginationActions";
import { useDispatch, useSelector } from "react-redux";
import { getDataUser } from "../redux/action/user";

const cookies = new Cookies();
const token = cookies.get("token");

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

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
  const { users } = useSelector((state) => state.userReducer);
  const { isLoading } = useSelector((state) => state.globalReducer);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModal, setEditModal] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
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
  const { searchValue, filterValue, sortValue } = props;
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalUser, setDeleteModalUser] = useState([]);
  const dispatch = useDispatch();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const modalClose = () => {
    setEditModal(false);
    setDeleteModal(false);
  };

  const handleChangeEmply = (event) => {
    setSelectedValueEmply(event.target.value);
  };

  //   GET DATA

  useEffect(() => {
    dispatch(getDataUser(token));
    getAreaList();
    getRoleList();

    if (searchValue) {
      setTimeout(() => {
        searchHandle(searchValue);
      }, 1000);
    }

    if (filterValue) {
      setTimeout(() => {
        filterHandle(filterValue);
      }, 1000);
    }

    if (sortValue) {
      setTimeout(() => {
        handleSort(sortValue);
      }, 1000);
    }
  }, [searchValue, filterValue, sortValue]);

  const searchHandle = (searchValue) => {
    dispatch({ type: "SET_LOADING", value: true });
    if (searchValue.length === 1) {
      setTimeout(() => {
        dispatch(getDataUser(token));
        dispatch({ type: "SET_LOADING", value: false });
      }, 1500);
      return;
    }

    if (searchValue !== null) {
      dispatch({ type: "SET_LOADING", value: true });
      (async function () {
        const results = await filter(users, async (item) => {
          await doAsyncStuff();
          return item.username.toLowerCase().match(searchValue);
        });
        setPage(0);
        dispatch({ type: "SET_USER", value: results });
        setTimeout(() => {
          dispatch({ type: "SET_LOADING", value: false });
        }, 1500);
      })();
      return;
    }
  };

  // Arbitrary asynchronous function
  function doAsyncStuff() {
    return Promise.resolve();
  }

  // The helper function
  async function filter(arr, callback) {
    const fail = Symbol();
    return (
      await Promise.all(
        arr.map(async (item) => ((await callback(item)) ? item : fail))
      )
    ).filter((i) => i !== fail);
  }

  const filterHandle = (filterValue) => {
    let checkData = filterValue.every((element) => element === "reset");

    if (checkData && searchValue.length === 0) {
      setTimeout(() => {
        dispatch(getDataUser(token));
        dispatch({ type: "SET_LOADING", value: false });
      }, 2000);

      return;
    }
    if (!checkData) {
      dispatch({ type: "SET_LOADING", value: true });

      if (
        filterValue[0] !== "" &&
        filterValue[1] !== "" &&
        filterValue[2] !== ""
      ) {
        (async function () {
          const results = await filter(users, async (item) => {
            await doAsyncStuff();
            return (
              item.role === filterValue[0] &&
              item.area === filterValue[1] &&
              item.departement === filterValue[2]
            );
          });
          setPage(0);
          dispatch({ type: "SET_USER", value: results });
          setTimeout(() => {
            dispatch({ type: "SET_LOADING", value: false });
          }, 1500);
        })();

        return;
      }

      if (filterValue[0] !== "" && filterValue[1] !== "") {
        dispatch({ type: "SET_LOADING", value: true });
        setTimeout(() => {
          let searchJoinUser = users.filter(
            (item) =>
              item.role === filterValue[0] && item.area === filterValue[1]
          );
          dispatch({ type: "SET_USER", value: searchJoinUser });
          dispatch({ type: "SET_LOADING", value: false });
        }, 2000);

        return;
      }

      if (filterValue[0] !== "") {
        dispatch({ type: "SET_LOADING", value: true });
        if (filterValue[2] !== "") {
          (async function () {
            const results = await filter(users, async (item) => {
              await doAsyncStuff();
              return (
                item.role === filterValue[0] &&
                item.departement === filterValue[2]
              );
            });
            setPage(0);
            dispatch({ type: "SET_USER", value: results });
            setTimeout(() => {
              dispatch({ type: "SET_LOADING", value: false });
            }, 1500);
          })();
          return;
        }
        setTimeout(() => {
          let searchJoinUser = users.filter(
            (item) => item.role === filterValue[0]
          );
          dispatch({ type: "SET_USER", value: searchJoinUser });
          dispatch({ type: "SET_LOADING", value: false });
        }, 2000);
      }

      if (filterValue[1] !== "") {
        setTimeout(() => {
          let searchJoinUser = resultJoinUser.filter(
            (item) => item.area === filterValue[1]
          );
          setResultJoinUser(searchJoinUser);
          dispatch({ type: "SET_LOADING", value: false });
        }, 2000);
        return;
      }

      if (filterValue[2] !== "") {
        setTimeout(() => {
          let searchJoinUser = resultJoinUser.filter(
            (item) => item.departement === filterValue[2]
          );
          setResultJoinUser(searchJoinUser);
          dispatch({ type: "SET_LOADING", value: false });
        }, 2000);
        return;
      }
    }
  };

  const handleSort = (sortValue) => {
    let sortData = [...users];

    switch (sortValue) {
      case "asc":
        sortData.sort((a, b) => (a.id > b.id ? 1 : -1));
        dispatch({ type: "SET_USER", value: sortData });
        return;
      case "desc":
        sortData.sort((a, b) => (a.id > b.id ? -1 : 1));
        dispatch({ type: "SET_USER", value: sortData });
        return;
      case "alpha":
        sortData.sort((a, b) =>
          a.email !== b.email ? (a.email < b.email ? 1 : -1) : 0
        );
        dispatch({ type: "SET_USER", value: sortData });
        return;
      case "revalpha":
        sortData.sort((a, b) =>
          a.email !== b.email ? (a.email < b.email ? -1 : 1) : 0
        );
        dispatch({ type: "SET_USER", value: sortData });
        return;
      case "all":
        return window.location.reload();
      default:
        return null;
    }
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

  const handleConfirmDelete = (row) => {
    setDeleteModal(true);
    setDeleteModalUser(row);
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
    rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

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

  const bodyModalDelete = (
    <>
      <Fade in={deleteModal}>
        <div className={classes.paper}>
          <h3>Are you sure want to delete this "{deleteModalUser.username}"</h3>
          <Divider />
          <br />

          <div className="footer-modal">
            <button className="btn-cancel" onClick={modalClose}>
              Cancel
            </button>
            <button
              className="btn-submit"
              onClick={() => handleUserDelete(deleteModalUser)}>
              Submit
            </button>
          </div>
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
                  ? users.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : users
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
                          row.role_id.role_name === "Administrator"
                            ? "disabled"
                            : ""
                        }`}
                        className={`btn-delete ${
                          row.role_id.role_name === "Administrator"
                            ? "disabled"
                            : ""
                        } `}
                        onClick={() => handleConfirmDelete(row)}>
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
                  count={users.length}
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
      <Modal
        open={deleteModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModalDelete}
      </Modal>
    </>
  );
};

export default TableUser;

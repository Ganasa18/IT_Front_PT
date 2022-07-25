import {
  Backdrop,
  Fade,
  makeStyles,
  Modal,
  Paper,
  Snackbar,
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
import MuiAlert from "@material-ui/lab/Alert";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import "../../assets/master.css";
import { authEndPoint } from "../../assets/menu";
import Loading from "../asset/Loading";
import { useDispatch, useSelector } from "react-redux";
import TablePaginationActions from "../asset/pagination/TablePaginationActions";
import { getDataRoleOnly } from "../redux/action";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
    width: 550,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
}));

const TableRole = () => {
  const classes = useStyles2();
  const { roles } = useSelector((state) => state.rolesReducer);
  const { isLoading } = useSelector((state) => state.globalReducer);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModal, setEditModal] = useState(false);
  // const [dataRole, setDataRole] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [roleId, setRoleId] = useState("");
  const [roleName, setRoleName] = useState("");
  const [toast, setToast] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(getDataRoleOnly(token));
    }, 3000);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(false);
  };

  // const getRoleList = async () => {
  //   await axios
  //     .get(
  //       `${authEndPoint[0].url}${
  //         authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
  //       }/api/v1/role`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     )
  //     .then((response) => {
  //       setDataRole(response.data.data.roles);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setIsLoading(false);
  //     });
  // };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, roles.length - page * rowsPerPage);

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

  // const handleDelete = async (row) => {
  //   await axios.delete(
  //     `${authEndPoint[0].url}${
  //       authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
  //     }/api/v1/role/${row.id}`,
  //     {
  //       headers: { Authorization: `Bearer ${token}` },
  //     }
  //   );
  //   setTimeout(() => {
  //     window.location.reload();
  //   }, 1500);
  // };

  const handleEdit = async (row) => {
    setEditModal(true);
    setRoleId(row.id);
    setRoleName(row.role_name);
  };

  const updateRole = async (e) => {
    e.preventDefault();
    await axios.patch(
      `${authEndPoint[0].url}${
        authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
      }/api/v1/role/${roleId}`,
      {
        role_name: roleName,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setToast(true);
    setRoleId("");
    setRoleName("");
    setEditModal(false);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const bodyModal = (
    <>
      <Fade in={editModal}>
        <div className={classes.paper}>
          <form onSubmit={updateRole}>
            <div className="row">
              <div className="col-12">
                <h3>Role Name</h3>
              </div>
              <div className="col-12">
                <label htmlFor="">Role</label>
                <input
                  type="text"
                  id="roleName"
                  defaultValue={roleName}
                  className="form-input"
                  onChange={function (e) {
                    setRoleName(e.target.value);
                  }}
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
                <StyledTableCell>Role Name</StyledTableCell>
                {/* <StyledTableCell align="center">Action</StyledTableCell> */}
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? roles.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : roles
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell
                      style={{ width: 160 }}
                      component="th"
                      scope="row">
                      {row.role_name}
                    </TableCell>
                    {/* <TableCell style={{ width: 100 }} align="center">
                      <button
                        className="btn-edit"
                        onClick={(e) => handleEdit(row)}>
                        <span
                          class="iconify icon-btn"
                          data-icon="ci:edit"></span>
                        <span className="name-btn">Edit</span>
                      </button>
                    </TableCell> */}
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
                  count={roles.length}
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

export default TableRole;

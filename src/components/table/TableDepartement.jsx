import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { pathEndPoint } from "../../assets/menu";
import Loading from "../asset/Loading";
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
  Collapse,
  Box,
  Typography,
  Button,
} from "@material-ui/core";
import "../../assets/master.css";

import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import StepperEdit from "../asset/departement/StepperEdit";

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

const TableDepartement = () => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModal, setEditModal] = useState(false);
  const [dataDepartement, setDataDepartement] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const [dataSubDepartement, setDataSubDepartement] = useState([]);
  const [lastDepartementId, setLastDepartementId] = useState(null);
  const [departementEdit, setDepartementEdit] = useState([]);

  const modalPop = (row) => {
    setDepartementEdit(row);
    setEditModal(true);
  };

  const modalOut = () => {
    setEditModal(false);
  };

  useEffect(() => {
    getDepartementList();
    getLatestId();
  }, []);

  const getDepartementList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/departement`
      )
      .then((response) => {
        setDataDepartement(response.data.data.departements);
        setIsLoading(false);

        setExpanded(
          [...Array(response.data.data.departements.length)].map((val) => false)
        );
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const getLatestId = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/departement/latestId`
      )
      .then((response) => {
        setLastDepartementId(response.data.data.departement.id);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, dataDepartement.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = async (index, row) => {
    setExpanded(
      expanded.map((boolean_value, i) => {
        if (index === i) {
          // once we retrieve the collapse index, we negate it
          return !boolean_value;
        } else {
          // all other collapse will be closed
          return false;
        }
      })
    );

    (async () => {
      let apiRes = null;
      try {
        apiRes = await axios.get(
          `${pathEndPoint[0].url}${
            pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
          }/api/v1/subdepartement/${row.id}`
        );
      } catch (err) {
        apiRes = err.response;
      } finally {
        console.log(apiRes.status); // Could be success or error

        if (apiRes.status === 200) {
          setDataSubDepartement(apiRes.data.data.subdepartement);
        }

        if (apiRes.status === 404) {
          setDataSubDepartement([
            {
              id: 1,
              subdepartement_name: "No Sub Departement",
            },
          ]);
        }
      }
    })();
  };

  const handleDelete = async (row) => {
    await axios.delete(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/departement/${row.id}`
    );
    setTimeout(() => {
      alert("success");
      window.location.reload();
    }, 1000);
  };

  const bodyModal = (
    <>
      <Fade in={editModal}>
        <div className={classes.paper}>
          <StepperEdit dataDepartement={departementEdit} />
          <Button
            onClick={modalOut}
            style={{ marginTop: "30px", width: "50px", fontSize: "13px" }}
            variant="contained"
            color="secondary">
            Close
          </Button>
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
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Area</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? dataDepartement.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : dataDepartement
                )
                  .sort((a, b) => (a.id > b.id ? -1 : 1))
                  .map((row, index) => (
                    <>
                      <TableRow key={row.id}>
                        <TableCell style={{ width: 30 }}>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={(e) => handleClick(index, row)}>
                            {expanded[index] ? (
                              <KeyboardArrowUpIcon />
                            ) : (
                              <KeyboardArrowDownIcon />
                            )}
                          </IconButton>
                        </TableCell>

                        <TableCell
                          style={{ width: 300 }}
                          component="th"
                          scope="row">
                          {row.departement_name}
                        </TableCell>
                        <TableCell
                          style={{ width: 300 }}
                          component="th"
                          scope="row">
                          {row.area_name}
                        </TableCell>

                        <TableCell style={{ width: 260 }} align="center">
                          <button
                            className="btn-edit"
                            onClick={(e) => modalPop(row)}>
                            <span
                              class="iconify icon-btn"
                              data-icon="ci:edit"></span>
                            <span className="name-btn">Edit</span>
                          </button>

                          <button
                            disabled={`${
                              lastDepartementId === row.id ? "disabled" : ""
                            }`}
                            className={`btn-delete ${
                              lastDepartementId === row.id ? "disabled" : ""
                            }`}
                            onClick={() => handleDelete(row)}>
                            <span
                              class="iconify icon-btn"
                              data-icon="ant-design:delete-filled"></span>
                            <span className="name-btn">Delete</span>
                          </button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}>
                          <Collapse
                            in={expanded[index]}
                            timeout="auto"
                            unmountOnExit>
                            <Box margin={1}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div">
                                Sub Departement List
                              </Typography>
                              <Table size="medium" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Name</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {dataSubDepartement.map((row) => (
                                    <TableRow key={row.id}>
                                      <TableCell>
                                        {row.subdepartement_name}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
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
                  count={dataDepartement.length}
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

export default TableDepartement;

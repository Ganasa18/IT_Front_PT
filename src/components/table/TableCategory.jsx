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
  Divider,
  Button,
} from "@material-ui/core";
import "../../assets/master.css";

import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import StepperEdit from "../asset/category/StepperEdit";

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
  cancelBtn: {
    color: "#EB5757",
    border: "1px solid #EB5757",
    width: "130px",
    height: "40px",
    fontSize: "13px",
    position: "relative",
    left: "0",
    transform: "translate(35%, -40%)",
  },
}));

const TableCategory = () => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [dataCategory, setDataCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState([]);
  const [dataSubCategory, setDataSubCategory] = useState([]);
  const [lastCategoryId, setLastCategoryId] = useState(null);
  const [categoryEdit, setCategoryEdit] = useState([]);

  const modalPop = (row) => {
    setCategoryEdit(row);
    setEditModal(true);
  };

  useEffect(() => {
    getCategoryList();
    getLatestId();
  }, []);

  const getCategoryList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/category`
      )
      .then((response) => {
        setDataCategory(response.data.data.category);
        setIsLoading(false);

        setExpanded(
          [...Array(response.data.data.category.length)].map((val) => false)
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
        }/api/v1/category`
      )
      .then((response) => {
        const dataCategory = response.data.data.category;
        setLastCategoryId(dataCategory.shift().id);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleConfirmDelete = async (row) => {
    const invent = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory/check/${row.id}`;

    await axios
      .post(invent)
      .then((res) => {
        const check = res.data.data.status_data;

        if (check === "used") {
          alert("used with some data");
          const origin = window.location.origin;
          window.location.href = `${origin}/inventory/used`;
          return;
        }

        setDeleteModal(true);
        setCategoryEdit(row);
      })
      .catch((err) => {
        alert("somethin wrong");
      });
  };

  const handleDelete = async (row) => {
    await axios.delete(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/category/${row.id}`
    );
    setTimeout(() => {
      alert("success");
      window.location.reload();
    }, 1000);
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
          }/api/v1/subcategory/${row.id}`
        );
      } catch (err) {
        apiRes = err.response;
      } finally {
        // console.log(apiRes.status); // Could be success or error

        if (apiRes.status === 200) {
          setDataSubCategory(apiRes.data.data.subcategory);
        }

        if (apiRes.status === 404) {
          setDataSubCategory([
            {
              id: 1,
              subcategory_name: "No Sub Category",
            },
          ]);
        }
      }
    })();
  };

  const modalOut = () => {
    setEditModal(false);
    setDeleteModal(false);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, dataCategory.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const bodyModal = (
    <>
      <Fade in={editModal}>
        <div className={classes.paper}>
          <StepperEdit dataCategory={categoryEdit} />
          <Button
            onClick={modalOut}
            className={classes.cancelBtn}
            variant="outlined">
            Cancel
          </Button>
        </div>
      </Fade>
    </>
  );

  const bodyModalDelete = (
    <>
      <Fade in={deleteModal}>
        <div className={classes.paper}>
          <h3>Are you sure want to delete this {categoryEdit.category_name}</h3>
          <Divider />
          <br />

          <div className="footer-modal">
            <button className="btn-cancel" onClick={modalOut}>
              Cancel
            </button>
            <button
              className="btn-submit"
              onClick={() => handleDelete(categoryEdit)}>
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
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? dataCategory.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : dataCategory
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
                              <ArrowDropUpIcon style={{ fontSize: 30 }} />
                            ) : (
                              <ArrowDropDownIcon style={{ fontSize: 30 }} />
                            )}
                          </IconButton>
                        </TableCell>

                        <TableCell
                          style={{ width: 300 }}
                          component="th"
                          scope="row">
                          {row.category_name}
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

                          {!row.is_default ? (
                            <>
                              <button
                                disabled={`${
                                  lastCategoryId === row.id ? "disabled" : ""
                                }`}
                                className={`btn-delete ${
                                  lastCategoryId === row.id ? "disabled" : ""
                                }`}
                                onClick={() => handleConfirmDelete(row)}>
                                <span
                                  class="iconify icon-btn"
                                  data-icon="ant-design:delete-filled"></span>
                                <span className="name-btn">Delete</span>
                              </button>
                            </>
                          ) : null}

                          {/* <button
                            disabled={`${
                              lastCategoryId === row.id ? "disabled" : ""
                            }`}
                            className={`btn-delete ${
                              lastCategoryId === row.id ? "disabled" : ""
                            }`}
                            onClick={() => handleDelete(row)}>
                            <span
                              class="iconify icon-btn"
                              data-icon="ant-design:delete-filled"></span>
                            <span className="name-btn">Delete</span>
                          </button> */}
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
                              <Table
                                size="medium"
                                aria-label="purchases"
                                style={{ background: "#f9f4f4" }}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Sub Category</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {dataSubCategory.map((row) => (
                                    <TableRow key={row.id}>
                                      <TableCell>
                                        {row.subcategory_name}
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
                  count={dataCategory.length}
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

export default TableCategory;

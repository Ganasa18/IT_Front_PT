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
import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../assets/select-search.css";

import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import StepperEdit from "../asset/category/StepperEdit";
import MuiAlert from "@material-ui/lab/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  filterDataCategory,
  getDataCategory,
  getLatestId,
} from "../redux/action";
import { filterByValue } from "../utils";
// function Alert(props) {
//   return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

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

  paperInfo: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "30%",
    left: "50%",
    width: 600,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },

  wrapperInfo: {
    padding: "25px",
    alignItems: "center",
  },
  boldText: {
    fontWeight: "bold",
  },

  paperTransfer: {
    position: "fixed",
    transform: "translate(-50%,-40%)",
    top: "35%",
    left: "50%",
    width: 850,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
}));

const TableCategory = (props) => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [confirmChangeItemModal, setConfirmChangeItemModal] = useState(false);
  const [expanded, setExpanded] = useState([]);
  const [dataSubCategory, setDataSubCategory] = useState([]);
  const [categoryEdit, setCategoryEdit] = useState([]);
  const [totalUsed, setTotalUsed] = useState(null);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [list, setList] = useState([]);
  const [optionCategoryId, setOptionCategoryId] = useState(null);
  const { category, optCategory, lastCategoryId } = useSelector(
    (state) => state.categoryReducer
  );
  const { isLoading } = useSelector((state) => state.globalReducer);
  const { searchValue } = props;
  const dispatch = useDispatch();

  const modalPop = (row) => {
    setCategoryEdit(row);
    setEditModal(true);
  };

  useEffect(() => {
    getCategoryList();
    if (searchValue) {
      setTimeout(() => {
        searchHandle(searchValue);
      }, 1000);
    }
  }, [list, searchValue]);

  const searchHandle = (searchValue) => {
    if (searchValue !== null) {
      let searchRequest = filterByValue(category, searchValue);
      dispatch(filterDataCategory(searchRequest));
    }
  };

  const getCategoryList = () => {
    dispatch(getDataCategory());
    dispatch(getLatestId());
    if (!isLoading) {
      const expandVal = [...Array(category.length)].map((val) => false);
      setExpanded(expandVal);
    }
  };

  const handleConfirmDelete = async (row) => {
    setCategoryEdit(row);
    const invent = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory/check/${row.id}`;

    await axios
      .post(invent)
      .then((res) => {
        const check = res.data.data.status_data;
        if (check === "used") {
          setTransferModal(true);
          setTotalUsed(res.data.data.total_used);
          return;
        }
        setDeleteModal(true);
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
    setTransferModal(false);
    setConfirmChangeItemModal(false);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, category.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const confirmChangeItem = async () => {
    setTransferModal(false);

    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory`;

    setTimeout(() => {
      (async function () {
        await axios
          .get(inventory)
          .then((response) => {
            setConfirmChangeItemModal(true);
            let dataInvent = response.data.data.inventorys;
            dataInvent = dataInvent.filter(
              (row) => row.category_asset === categoryEdit.id
            );

            setList(dataInvent);
          })
          .catch((err) => {
            alert("something wrong");
          });
      })();
    }, 1000);
  };

  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(list.map((li) => li.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleClickCheckbox = (e) => {
    const { id, checked } = e.target;

    setIsCheck([...isCheck, parseInt(id)]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== parseInt(id)));
    }
  };

  const handleSubmitChange = async () => {
    if (!optionCategoryId) {
      alert("must select 1 category");
      return;
    }

    if (isCheck.length === 0) {
      alert("must select 1 item");
      return;
    }

    isCheck.forEach((item) => {
      (async function () {
        await axios
          .patch(
            `${pathEndPoint[0].url}${
              pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
            }/api/v1/inventory/transfer-category/${item}`,
            {
              category_asset: parseInt(optionCategoryId),
            }
          )
          .then(() => {
            const removeItem = list.filter((row) => !isCheck.includes(row.id));
            setList(removeItem);
            const invent = `${pathEndPoint[0].url}${
              pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
            }/api/v1/inventory/check/${categoryEdit.id}`;
            (async function () {
              await axios
                .post(invent)
                .then((res) => {
                  setTotalUsed(res.data.data.total_used);
                })
                .catch((err) => {
                  alert("somethin wrong");
                });
            })();
          });
      })();
    });
  };

  const selectedCount = Object.values(isCheck).filter(Boolean).length;

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

  const bodyModalTransfer = (
    <>
      <Fade in={transferModal}>
        <div className={classes.paperInfo}>
          <div className={classes.wrapperInfo}>
            <h3>Delete Category</h3>
            <p className={classes.info}>
              Are you sure want to delete{" "}
              <span className={classes.boldText}>
                {categoryEdit.category_name}
              </span>{" "}
              category? You must move
              <span className={classes.boldText}> {totalUsed} </span> item to{" "}
              <br />
              another category before you delete this category
            </p>
          </div>
          <Divider />
          <br />
          <div className="footer-modal">
            <button className="btn-cancel" onClick={modalOut}>
              Cancel
            </button>
            <button className="btn-submit" onClick={confirmChangeItem}>
              Change Item
            </button>
          </div>
        </div>
      </Fade>
    </>
  );

  const Checkbox = ({ id, type, name, handleClick, isChecked }) => {
    return (
      <div className="checkBoxWrap">
        <input
          id={id}
          type="checkbox"
          class="checkbox-transfer c1"
          onChange={handleClick}
          checked={isChecked}
        />
        <label htmlFor={name}>{name}</label>
      </div>
    );
  };

  const confirmModalTransfer = (
    <>
      <Fade in={confirmChangeItemModal}>
        <div className={classes.paperTransfer}>
          <h3>List Item in category {categoryEdit.category_name}</h3>
          <Divider />
          <br />
          <div className="wrapper-transfer-container">
            <div>
              <Checkbox
                type="checkbox"
                name="All"
                id="selectAll"
                handleClick={handleSelectAll}
                isChecked={isCheckAll}
              />
            </div>
            <div></div>
            <div>
              <span style={{ color: "#2370D8" }}>
                {selectedCount} / {totalUsed}{" "}
              </span>
              item
            </div>
          </div>
          <div className="wrapper-transfer-height">
            <div className="wrapper-checkbox-transfer">
              {list.map((row) => (
                <Checkbox
                  type="checkbox"
                  name={row.asset_name}
                  id={row.id}
                  handleClick={handleClickCheckbox}
                  isChecked={isCheck.includes(row.id)}
                />
              ))}
            </div>
          </div>
          <div className="row">
            <div className="col-5">
              <label htmlFor="roleName">Category</label>
              <SelectSearch
                id="idCategory"
                options={optCategory}
                value={optCategory}
                filterOptions={fuzzySearch}
                onChange={(e) => setOptionCategoryId(e)}
                search
                placeholder="Category"
              />
            </div>
          </div>
          <br />
          <br />
          <div className="footer-modal">
            <div className="footer-modal-transfer">
              <button className="btn-cancel" onClick={modalOut}>
                Cancel
              </button>
              <button className="btn-submit" onClick={handleSubmitChange}>
                Change Category
              </button>
            </div>
            {totalUsed === 0 ? (
              <button
                className="btn-delete-transfer"
                onClick={() => handleDelete(categoryEdit)}>
                Delete
              </button>
            ) : (
              <button disabled className="btn-delete-transfer-disabled">
                Delete
              </button>
            )}
          </div>
          <br />
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
                <StyledTableCell>Code Item</StyledTableCell>
                {/* <StyledTableCell align="center">Action</StyledTableCell> */}
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? category.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : category
                )
                  // .sort((a, b) => (a.id > b.id ? -1 : 1))
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

                        <TableCell component="th" scope="row">
                          {row.category_name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.code_category}
                        </TableCell>

                        {/* <TableCell style={{ width: 260 }} align="center">
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
                        </TableCell> */}
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
                                    <TableCell>Code</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {dataSubCategory.map((row) => (
                                    <TableRow key={row.id}>
                                      <TableCell>
                                        {row.subcategory_name}
                                      </TableCell>
                                      <TableCell>
                                        {row.code_subcategory}
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
                  count={category.length}
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
      <Modal
        open={transferModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModalTransfer}
      </Modal>

      <Modal
        open={confirmChangeItemModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {confirmModalTransfer}
      </Modal>
    </>
  );
};

export default TableCategory;

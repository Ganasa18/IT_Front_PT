import React, { useState, useEffect } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Divider,
  Button,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  useTheme,
  withStyles,
  Snackbar,
} from "@material-ui/core";
import PropTypes from "prop-types";
import "../../../../assets/master.css";
import "../../../../assets/asset_user.css";
import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../../../assets/select-search.css";
import {
  authEndPoint,
  pathEndPoint,
  prEndPoint,
  invEndPoint,
} from "../../../../assets/menu";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import Cookies from "universal-cookie";
import MuiAlert from "@material-ui/lab/Alert";

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

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  wrapperQty: {
    position: "relative",
    left: "50%",
    transform: "translateX(-33%)",
  },
  qtyLabel: {
    position: "relative",
    left: "18%",
    top: "-5px",
  },
  wrapperCategory: {
    position: "absolute",
    bottom: "0%",
    width: "100%",
    transform: "translate(0, 230%)",
  },
  addBtn: {
    color: "#1653A6",
    border: "1px solid #1653A6",
    width: "130px",
    height: "35px",
    textTransform: "none",
    fontSize: 16,
    padding: "6px 12px",
    lineHeight: 1.5,
    position: "relative",
    left: "100%",
    top: "50%",
    transform: "translate(-190%,140%)",

    "&:hover": {
      backgroundColor: "#1653A6",
      color: "#FFF",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#0062cc",
      borderColor: "#005cbf",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  },
  table: {
    marginTop: "20px",
    minWidth: 400,
    width: "100%",
    overflowX: "auto",
  },

  posPagination: {
    position: "absolute",
    right: "50px",
  },

  tableWidth: {
    margin: "auto",
    width: "98%",
  },

  thead: {
    "& th": {
      padding: "15px",
      backgroundColor: theme.theadColor,
    },
    "& th:first-child": {
      borderRadius: "0.5em 0 0 0",
    },
    "& th:last-child": {
      borderRadius: "0 0.5em 0 0",
    },
  },

  btnSubmit: {
    textTransform: "capitalize",
    position: "relative",
    width: "130px",
    height: "40px",
    left: "80%",
    transform: "translate(50%, 200%)",
  },
}));

const CreatePurchaseOrder = () => {
  const classes = useStyles();
  const [quantity, setQuantity] = useState(0);
  const [dataCategory, setDataCategory] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [dataSubCategory, setDataSubCategory] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/category`
      )
      .then((response) => {
        const DataCategory = response.data.data.category;
        const newArrCategory = DataCategory.map((row) => ({
          value: row.id,
          name: row.category_name,
        }));

        setDataCategory(newArrCategory);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCategory = async (...args) => {
    setCategory(args[1].name);
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/subcategory`
      )
      .then((response) => {
        const SubCategoryList = response.data.data.subcategory;
        const subcat = [...SubCategoryList];
        const idSubCatgory = subcat.filter(
          (item) => item.id_category === args[0]
        );
        if (idSubCatgory === undefined || idSubCatgory.length === 0) {
          setDataSubCategory([]);
        } else {
          const newArr = idSubCatgory.map((sub) => ({
            value: sub.id,
            name: sub.subcategory_name,
          }));
          setDataSubCategory(newArr);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, todos.length - page * rowsPerPage);

  return (
    <>
      <Grid item xs={12} sm={12}>
        <Typography variant="h6" gutterBottom>
          Purchase Order
        </Typography>
      </Grid>
      <Divider />
      <br />
      <br />
      <div className="wrapper-po">
        <div className="row">
          <div className="col-5">
            <label htmlFor="">PO No</label>
            <input type="text" className="form-input" />
          </div>
          <div className="col-1"></div>
          <div className="col-5">
            <label htmlFor="">Phone</label>
            <input type="text" className="form-input" />
          </div>
        </div>
        <div className="row margin-top-0">
          <div className="col-5">
            <label htmlFor="">Vendor Name</label>
            <input type="text" className="form-input" />
          </div>
          <div className="col-1"></div>
          <div className="col-5">
            <label htmlFor="">Address</label>
            <textarea className="form-input-area" cols="30" rows="8"></textarea>
          </div>
        </div>
        <div className="row margin-top-0">
          <div className="col-5">
            <label htmlFor="">Fisik/Non Fisik.</label>
            <div className="row">
              <div class="col-5">
                <div className="radio">
                  <input
                    type="radio"
                    id="fisik"
                    value={"fisik"}
                    name="fisiknon"
                    checked
                  />
                  <label htmlFor="fisik" className="radio-label">
                    Fisik
                  </label>
                </div>
              </div>
              <div className="col-5">
                <div className="radio">
                  <input
                    type="radio"
                    id="nonfisik"
                    value={"nonfisik"}
                    name="fisiknon"
                  />
                  <label htmlFor="nonfisik" className="radio-label">
                    None Fisik
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-1"></div>
          <div className="col-5">
            <label htmlFor="">Code Item</label>
            <input type="text" className="form-input" />
          </div>
        </div>
        <div className="row margin-top-0">
          <div className="col-5">
            <label htmlFor="">Unit/Parts.</label>
            <div className="row">
              <div class="col-5">
                <div className="radio">
                  <input
                    type="radio"
                    id="unit"
                    value={"unit"}
                    name="unit_parts"
                    checked
                  />
                  <label htmlFor="unit" className="radio-label">
                    Unit
                  </label>
                </div>
              </div>
              <div className="col-5">
                <div className="radio">
                  <input
                    type="radio"
                    id="parts"
                    value={"parts"}
                    name="unit_parts"
                  />
                  <label htmlFor="parts" className="radio-label">
                    Parts
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-1"></div>
          <div className="col-5">
            <label htmlFor="">Unit Price</label>
            <input type="text" className="form-input" />
          </div>
        </div>
        <div className="row margin-top-0">
          <div className="col-5">
            <label htmlFor="">User/Dept.</label>
            <div className="row">
              <div class="col-5">
                <div className="radio">
                  <input
                    type="radio"
                    id="user"
                    value={"user"}
                    name="userdpt"
                    checked
                  />
                  <label htmlFor="user" className="radio-label">
                    User
                  </label>
                </div>
              </div>
              <div className="col-5">
                <div className="radio">
                  <input
                    type="radio"
                    id="departement"
                    value={"departement"}
                    name="userdpt"
                  />
                  <label
                    htmlFor="departement"
                    className="radio-label"
                    style={{ fontSize: "13px" }}>
                    Departement
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="col-1"></div> */}
          <div className="col-6 margin-top-0">
            <label htmlFor="" className={classes.qtyLabel}>
              QTY
            </label>
            <div className={classes.wrapperQty}>
              <button
                type="button"
                className="btn-plus"
                onClick={() => setQuantity(quantity + 1)}>
                +
              </button>
              <span className="item-count">{quantity}</span>
              <button
                type="button"
                className="btn-min"
                onClick={() => setQuantity(quantity === 0 ? 0 : quantity - 1)}>
                -
              </button>
            </div>
          </div>
        </div>
        <div className="row margin-top-1">
          <div className="col-5">
            <label htmlFor="">Asset Name</label>
            <input type="text" className="form-input" />
          </div>
          <div className="col-1"></div>
          <div className="col-5">
            <label htmlFor="">Description</label>
            <textarea
              className="form-input-area"
              cols="30"
              rows="10"></textarea>
          </div>
        </div>
        <div className={classes.wrapperCategory}>
          <div className="row">
            <div className="col-5">
              <label htmlFor="roleName">Category</label>
              <SelectSearch
                id="idCategory"
                options={dataCategory}
                value={dataCategory}
                filterOptions={fuzzySearch}
                onChange={handleCategory}
                search
                placeholder="Search Category"
              />
            </div>
            <div className="col-2"></div>
            <div className="col-5"></div>
          </div>
          <br />
          <br />

          <div className="row">
            <div className="col-5">
              <label htmlFor="">SubCategory</label>
              <SelectSearch
                options={dataSubCategory}
                value={dataSubCategory}
                filterOptions={fuzzySearch}
                search
                placeholder="Search Sub Category"
              />
            </div>
            <div className="col-2"></div>
            <div className="col-5"></div>
          </div>
        </div>
        <div className="row">
          <Button
            className={classes.addBtn}
            variant="outlined"
            startIcon={<AddIcon />}>
            Add Item
          </Button>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className="row">
          <div className="col-12">
            <TableContainer className={classes.tableWidth}>
              <Paper>
                <Table
                  size="small"
                  className={classes.table}
                  aria-label="custom pagination table">
                  <TableHead classes={{ root: classes.thead }}>
                    <TableRow>
                      <StyledTableCell>Asset No</StyledTableCell>
                      <StyledTableCell>Item Name</StyledTableCell>
                      <StyledTableCell>V.Name</StyledTableCell>
                      <StyledTableCell>No. Hp</StyledTableCell>
                      <StyledTableCell>Add.</StyledTableCell>
                      <StyledTableCell>Fisik/Non</StyledTableCell>
                      <StyledTableCell>Unit/Part</StyledTableCell>
                      <StyledTableCell>User/Dept</StyledTableCell>
                      <StyledTableCell>Ctg</StyledTableCell>
                      <StyledTableCell>Sub Cat.</StyledTableCell>
                      <StyledTableCell>Desc</StyledTableCell>
                      <StyledTableCell>Unit Price</StyledTableCell>
                      <StyledTableCell>QTY</StyledTableCell>
                      <StyledTableCell align="center">Total</StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {(rowsPerPage > 0
                      ? todos.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : todos
                    ).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
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
                        <TableCell
                          component="th"
                          scope="row"
                          align="center"></TableCell>
                        <TableCell style={{ width: 100 }} align="center">
                          <button className="btn-delete">
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
                        <TableCell colSpan={14} />
                      </TableRow>
                    )}
                  </TableBody>

                  <TableFooter className={classes.posPagination}>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[2]}
                        colSpan={3}
                        count={todos.length}
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
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-12 position-total-po">
            <p>
              Total All <span>Rp 0</span>
            </p>
          </div>
        </div>
      </div>
      <Button variant="contained" color="primary" className={classes.btnSubmit}>
        Submit
      </Button>
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default CreatePurchaseOrder;

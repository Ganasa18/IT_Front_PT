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
} from "@material-ui/core";
import PropTypes from "prop-types";
import "../../../../assets/master.css";
import "../../../../assets/asset_user.css";
import "../.././../asset/chips.css";
import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../../../assets/select-search.css";
import { pathEndPoint } from "../../../../assets/menu";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";

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
    top: "32%",
    width: "92%",
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
    transform: "translate(-110%,100%)",

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
    bottom: "120px",
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

    transform: "translate(50%, 300%)",
  },
}));

function generateId() {
  return Date.now();
}

const CreateTicketPurchase = ({ dataTicket }) => {
  const classes = useStyles();
  const dataReq = dataTicket;
  const [dataCategory, setDataCategory] = useState([]);
  const [dataSubCategory, setDataSubCategory] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [todos, setTodos] = React.useState([]);
  const [assetName, setAssetName] = useState("");
  const [description, setDescription] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);

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
  const handleSubCategory = async (...args) => {
    setSubCategory(args[1].name);
  };

  const handleTodo = () => {
    const typeasset = document.querySelector('input[name="userdpt"]:checked');

    if (assetName === "") {
      alert("name can't be empty");
      return;
    }

    if (typeasset === null) {
      alert("select 1 status");
      return;
    }

    if (description === "") {
      alert("description can't be empty");
      return;
    }

    if (quantity === 0) {
      alert("quantity must greater than 0");
      return;
    }

    const data = {
      id: generateId(),
      type_asset: typeasset.value,
      asset_name: assetName,
      description: description,
      qty: quantity,
      category: category,
      subcategory: subCategory,
    };

    setTodos([...todos, data]);
    setTimeout(() => {
      setAssetName("");
      setDescription("");
      setQuantity(0);
    }, 1000);
  };

  function removeHandler(todoId) {
    const filteredDisposal = todos.filter(function (todo) {
      return todo.id !== todoId;
    });
    setTodos(filteredDisposal);
  }

  const submitPR = () => {
    if (todos.length === 0) {
      alert("cannot empty list");
      return;
    }
    const jsonString = JSON.stringify(todos);
    // console.log(todos);
    console.log(dataReq[0].action_req_code);
    console.log(dataReq[0].user_id);
    console.log(dataReq[0].status_id);
    console.log(jsonString);
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
          Purchase Request
        </Typography>
      </Grid>
      <Divider />
      <br />
      <br />
      <div className={`row ${classes.positionPaper}`}>
        <div className="col-6">
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
                <label htmlFor="departement" className="radio-label">
                  Departement
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6">
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
      <br />
      <div className="row">
        <div className="col-5">
          <label htmlFor="">Asset Name</label>
          <input
            type="text"
            className="form-input"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
          />
        </div>
        <div className="col-2"></div>
        <div className="col-5">
          <label htmlFor="">Description</label>
          <textarea
            className="form-input-area"
            cols="30"
            rows="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}></textarea>
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
              onChange={handleSubCategory}
              search
              placeholder="Search Sub Category"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <Button
          onClick={handleTodo}
          className={classes.addBtn}
          variant="outlined"
          startIcon={<AddIcon />}>
          Add Item
        </Button>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div className="row">
        <TableContainer className={classes.tableWidth}>
          <Paper>
            <Table
              size="small"
              className={classes.table}
              aria-label="custom pagination table">
              <TableHead classes={{ root: classes.thead }}>
                <TableRow>
                  <StyledTableCell>Item Name</StyledTableCell>
                  <StyledTableCell>User/Dept</StyledTableCell>
                  <StyledTableCell>Category</StyledTableCell>
                  <StyledTableCell>Sub Category</StyledTableCell>
                  <StyledTableCell>Description</StyledTableCell>
                  <StyledTableCell>QTY</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
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
                    <TableCell style={{ width: 100 }} align="center">
                      <button
                        className="btn-delete"
                        onClick={removeHandler.bind(this, row.id)}>
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

        <Button
          variant="contained"
          color="primary"
          onClick={submitPR}
          className={classes.btnSubmit}>
          Submit
        </Button>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

export default CreateTicketPurchase;

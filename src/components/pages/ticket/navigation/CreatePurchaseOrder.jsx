import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
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

function generateId() {
  return Date.now();
}

const CreatePurchaseOrder = (props) => {
  const classes = useStyles();
  const [quantity, setQuantity] = useState(0);
  const [dataCategory, setDataCategory] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [dataSubCategory, setDataSubCategory] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [todos, setTodos] = useState([]);
  const initialRef = React.useRef(null);
  const getInitialRef = React.useRef(null);
  const priceRef = React.useRef(null);
  const [subTotal, setSubTotal] = useState(0);
  const req_no = localStorage.getItem("req_no");

  const { ticketUser, lastNum, listData } = props;

  console.log(req_no);

  localStorage.setItem("last_number", lastNum);

  useEffect(() => {
    getCategoryList();
    setTimeout(() => {
      checkTodos();
    }, 800);
  }, [todos]);

  const checkTodos = () => {
    var finalArray = todos.map(function (obj) {
      return obj.total_price_int;
    });
    const total_price_data = finalArray.reduce(function (total, current) {
      return total + current;
    }, 0);

    setSubTotal(total_price_data);
  };

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
    setCategory(args[1]);
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
    setSubCategory(args[1]);
  };

  const totalformatRupiah = (money) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(money);
  };

  // const getTotalAmount = () => {
  //   var sub_total = 0;
  //   for (var i = 0; i < todos.length; i++) {
  //     var total = todos[i].total_price_unit;
  //     var format_data = total.match(/\d/g);
  //     format_data = format_data.join("");
  //     sub_total = sub_total + format_data;
  //     setSubTotal(format_data);
  //     console.log(subTotal);
  //   }
  // };

  const handleTodo = () => {
    const typeasset = document.querySelector('input[name="userdpt"]:checked');
    const fisiktype = document.querySelector('input[name="fisiknon"]:checked');
    const parttype = document.querySelector('input[name="unit_parts"]:checked');
    const ponumber = document.getElementById("ponumber").value;
    const phone_number = document.getElementById("phone_number").value;
    const vendor_name = document.getElementById("vendor_name").value;
    const address_vendor = document.getElementById("address_vendor").value;
    const desc_po = document.getElementById("desc_po").value;
    var nowNumber = localStorage.getItem("last_number");
    let checkfisik = fisiktype.value === "fisik" ? "0" : "1";

    // const code =
    //   "MKD" +
    //   getInitialRef.current.value +
    //   ticketUser[0].id_area_user.alias_name +
    //   checkfisik +
    //   "-" +
    //   nowNumber;
    const code =
      "MKD" +
      getInitialRef.current.value +
      ticketUser[0].id_area_user.alias_name +
      checkfisik;

    if (fisiktype === null) {
      alert("must select 1");
      return;
    }
    if (parttype === null) {
      alert("must select 1");
      return;
    }

    if (typeasset === null) {
      alert("must select 1");
      return;
    }

    if (category.length === 0) {
      alert("category must select 1");
      return;
    }

    if (quantity === 0) {
      alert("quantity must greater than 0");
      return;
    }

    if (priceRef.current.value === "") {
      alert("must fill price unit");
      return;
    }

    var format_price = priceRef.current.value.match(/\d/g);
    format_price = format_price.join("");
    let total_price = quantity * format_price;
    let int_total = total_price;
    total_price = totalformatRupiah(total_price);

    if (vendor_name === "") {
      alert("must fill asset name");
      return;
    }

    if (initialRef.current.value === "") {
      alert("must fill asset name");
      return;
    }

    if (ponumber === "") {
      alert("must fill po number");
      return;
    }

    let type_req = req_no.replace(/[0-9]/g, "");
    var used_user = null;
    if (type_req === "MKDAR") {
      used_user = typeasset.value === "user" ? ticketUser[0].user_id : null;
    } else {
      used_user = typeasset.value === "user" ? ticketUser[0].id : null;
    }

    const data = {
      id: generateId(),
      asset_number: code,
      asset_name: initialRef.current.value,
      initial_asset_name: getInitialRef.current.value,
      qty: quantity,
      real_qty: quantity,
      price_unit: priceRef.current.value,
      total_price_unit: total_price,
      total_price_int: int_total,
      asset_part_or_unit: parttype.value,
      asset_fisik_or_none: fisiktype.value,
      type_asset: typeasset.value,
      area: ticketUser[0].id_area_user.id,
      departement: ticketUser[0].id_departement_user.id,
      id_category: category.value,
      category: category.name,
      id_subcategory: subCategory.length === 0 ? null : subCategory.value,
      subcategory: subCategory.name,
      asset_po_number: "MKDPO-" + ponumber,
      vendor_phone: phone_number,
      vendor_name: vendor_name,
      address_vendor: address_vendor,
      desc_po: desc_po,
      used_by: used_user,
    };

    console.log(data);
    setTodos([...todos, data]);

    setTimeout(() => {
      var numb = nowNumber;
      numb = parseInt(numb) + 1;
      var str = "" + numb;
      var pad = "000";
      var ans = pad.substring(0, pad.length - str.length) + str;
      localStorage.setItem("last_number", ans);
      priceRef.current.value = "";
      document.getElementById("vendor_name").value = "";
      initialRef.current.value = "";
      getInitialRef.current.value = "";
      document.getElementById("phone_number").value = "";
      document.getElementById("address_vendor").value = "";
      document.getElementById("desc_po").value = "";
      setQuantity(0);
    }, 1500);
  };

  const handleSubmit = async () => {
    if (todos.length === 0) {
      alert("must insert min 1 item");
      return;
    }

    const data = {
      ticket_number: listData[0].action_req_code,
      pr_number: listData[0].purchase_req_code,
      po_list: JSON.stringify(todos),
      subtotal_price: parseInt(subTotal),
    };

    document.getElementById("overlay").style.display = "block";

    let po = `${prEndPoint[0].url}${
      prEndPoint[0].port !== "" ? ":" + prEndPoint[0].port : ""
    }/api/v1/purchase-order/`;

    // console.log(data);

    await axios
      .post(po, data)
      .then((response) => {
        console.log(response);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
        alert("somethin wrong");
      });
  };

  function removeHandler(todoId) {
    const filteredDisposal = todos.filter(function (todo) {
      return todo.id !== todoId;
    });
    setTodos(filteredDisposal);
  }

  const handleInitial = () => {
    var typingTimer; //timer identifier
    var doneTypingInterval = 8000;
    clearTimeout(typingTimer);
    var value = initialRef.current.value;

    var variable1 = value.substring(0, 1);
    var variable2 = variable1.toUpperCase();
    var variable3 = value.substring(2);
    var variable4 = [...variable3];

    if (value) {
      typingTimer = setTimeout(
        doneTyping(variable2, variable4),
        doneTypingInterval
      );
    }
  };

  function doneTyping(variable2, variable4) {
    var ran = variable4[Math.floor(Math.random() * variable4.length)];
    var randVal = variable2 + ran;
    getInitialRef.current.value = randVal.toUpperCase();
  }

  /* Fungsi formatRupiah */
  function formatRupiah(angka, prefix) {
    var number_string = angka.replace(/[^,\d]/g, "").toString(),
      split = number_string.split(","),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
      var separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return prefix === undefined ? rupiah : rupiah ? "Rp." + rupiah : "";
  }

  const handlePrice = () => {
    var angka = formatRupiah(priceRef.current.value, "Rp.");
    priceRef.current.value = angka;
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
            <input type="text" id="ponumber" className="form-input" />
          </div>
          <div className="col-1"></div>
          <div className="col-5">
            <label htmlFor="">Phone</label>
            <input type="text" id="phone_number" className="form-input" />
          </div>
        </div>
        <div className="row margin-top-0">
          <div className="col-5">
            <label htmlFor="">Vendor Name</label>
            <input type="text" id="vendor_name" className="form-input" />
          </div>
          <div className="col-1"></div>
          <div className="col-5">
            <label htmlFor="">Address</label>
            <textarea
              id="address_vendor"
              className="form-input-area"
              cols="30"
              rows="8"></textarea>
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
            <label htmlFor="">
              {" "}
              Item Initials
              <span style={{ color: "#ec9108" }}> ( initial can be edit )</span>
            </label>
            <input
              type="text"
              onInput={function (e) {
                getInitialRef.current.value = e.target.value.toUpperCase();
              }}
              ref={getInitialRef}
              className="form-input"
            />
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
            <input
              type="text"
              ref={priceRef}
              onKeyUp={handlePrice}
              className="form-input"
            />
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
            <input
              type="text"
              ref={initialRef}
              onKeyUp={handleInitial}
              className="form-input"
            />
          </div>
          <div className="col-1"></div>
          <div className="col-5">
            <label htmlFor="">Description</label>
            <textarea
              id="desc_po"
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
                onChange={handleSubCategory}
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
                          <div className="text-hide"> {row.asset_name}</div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="text-hide"> {row.vendor_name}</div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="text-hide"> {row.vendor_phone} </div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="text-hide">{row.address_vendor} </div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.asset_fisik_or_none}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.asset_part_or_unit}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.type_asset}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="text-hide"> {row.category} </div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="text-hide">{row.subcategory} </div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="text-hide">{row.desc_po}</div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.price_unit}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {row.qty}
                        </TableCell>

                        <TableCell style={{ width: 100 }} align="center">
                          {row.total_price_unit}
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
              Total All
              <span>
                {subTotal === 0 ? "Rp. 0" : totalformatRupiah(subTotal)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        className={classes.btnSubmit}>
        Submit
      </Button>
      <br />
      <br />
      <br />
      <br />
      <div id="overlay">
        <Loader
          className="loading-data"
          type="Rings"
          color="#CECECE"
          height={550}
          width={80}
        />
      </div>
    </>
  );
};

export default CreatePurchaseOrder;

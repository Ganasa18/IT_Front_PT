import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  useTheme,
  makeStyles,
  withStyles,
  Grid,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Button,
  Snackbar,
  Typography,
} from "@material-ui/core";
import "../../../assets/master.css";
import "../../../assets/multi_upload.css";
import { pathEndPoint } from "../../../assets/menu";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import CancelIcon from "@material-ui/icons/Cancel";
import axios from "axios";
import MuiAlert from "@material-ui/lab/Alert";
import useUploadImg from "../../../assets/useUploadImg";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

  btnNext: {
    textTransform: "capitalize",
    position: "relative",
    width: "130px",
    height: "40px",
    left: "80%",
    transform: "translate(50%, 200%)",
  },
}));

// function formatDisposal(date) {
//   var year = date.getFullYear().toString();
//   var month = (date.getMonth() + 101).toString().substring(1);
//   var day = (date.getDate() + 100).toString().substring(1);
//   return "DSP" + year + month + day;
// }

const InputDisposal = ({ dataDisposal }) => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectDisposal, setSelectDisposal] = useState(dataDisposal);
  const [nameDisposal, setNameDisposal] = useState("");
  const [descriptionDisposal, setDescriptionDisposal] = useState("");
  const [statusDisposal, setStatusDisposal] = useState([]);
  const [toast, setToast] = useState(false);
  const [lastNumber, setLastNumber] = useState("");

  const [dataImg, onChange, onDone, onRemoveOne] = useUploadImg();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(false);
  };

  useEffect(() => {
    getStatusList();
    getDisLatestId();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/status`
      )
      .then((response) => {
        const dataStatus = response.data.data.statuss;
        let statusDispos = dataStatus
          .filter((row) => [16, 17, 18].includes(row.id))
          .sort((a, b) => (a.id > b.id ? 1 : -1));
        setStatusDisposal(statusDispos);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getDisLatestId = async () => {
    let disposal = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/disposal/latestId`;

    await axios
      .get(disposal)
      .then((response) => {
        var text = response.data.data?.disposal[0]?.disposal_code;
        var numb = 0;
        if (text === undefined) {
          numb = parseInt(numb) + 1;
          var str = "" + numb;
          var pad = "000";
          var ans = pad.substring(0, pad.length - str.length) + str;
          setLastNumber(ans);
          return;
        }
        numb = text.match(/\d/g);
        numb = numb.join("");
        numb = parseInt(numb) + 1;
        str = "" + numb;
        pad = "000";
        ans = pad.substring(0, pad.length - str.length) + str;
        setLastNumber(ans);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, selectDisposal.length - page * rowsPerPage);

  function removeHandler(todoId) {
    const filteredDisposal = selectDisposal.filter(function (todo) {
      return todo.id !== todoId;
    });
    setSelectDisposal(filteredDisposal);
  }

  const handleSubmit = async () => {
    const statusdis = document.querySelector('input[name="statusdis"]:checked');

    if (nameDisposal === "") {
      alert("name can't be empty");
      return;
    }

    if (statusdis === null) {
      alert("select 1 status");
      return;
    }

    // console.log(nameDisposal);
    // console.log(descriptionDisposal);
    // console.log(statusdis.value);
    const codeDis = "MKDDSP" + lastNumber;
    const status_aprove = 10;
    // console.log(codeDis);

    if (selectDisposal.length === 0) {
      alert("cannot submit empty asset");
      return;
    }

    // console.log(selectDisposal);
    const jsonString = JSON.stringify(selectDisposal);

    // console.log(dataImg.files);

    // console.log(imgArr);
    // console.log(imageFormData);

    // const imageFormData = new FormData();
    // imageFormData.append("imageDisposal", dataImg.files);
    let imgStringJson = null;

    if (dataImg.files.length > 0) {
      const imgString = dataImg.files;
      // console.log(imgString);

      var imgArr = [];
      const imageFormData = new FormData();

      imgString.forEach((item) => {
        imgArr.push(
          `${codeDis}-${item.name.split(".").slice(0, -1).join(".")}`
        );
      });

      imgStringJson = JSON.stringify(imgArr);

      Array.from(dataImg.files).forEach((f) => {
        imageFormData.append("images", f);
      });

      imageFormData.append("no_dis", codeDis);

      await axios
        .post(
          `${pathEndPoint[0].url}${
            pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
          }/api/v1/disposal/images`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((response) => {
          console.log("success");
        })
        .catch((error) => {
          console.error(error);
        });
    }

    console.log(imgStringJson);

    await axios
      .post(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/disposal/`,
        {
          disposal_code: codeDis,
          disposal_name: nameDisposal,
          disposal_desc: descriptionDisposal,
          item_list: jsonString,
          status_disposal: statusdis.value,
          status_approval: status_aprove,
          img_list: imgStringJson === null ? null : imgStringJson,
        }
      )
      .then((response) => {
        console.log("success");
      })
      .catch((error) => {
        console.error(error);
      });

    selectDisposal.forEach((el) => {
      // Updated Status
      axios
        .patch(
          `${pathEndPoint[0].url}${
            pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
          }/api/v1/inventory/updated-status/${el.id}/disposal/`,
          {
            disposal: true,
          }
        )
        .then((response) => {
          console.log("success");
        })
        .catch((error) => {
          console.error(error);
        });
    });

    setToast(true);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const PreviewImg = ({ className, src, remove }) => (
    <div className="relative p-2">
      <span
        className="absolute top-0 right-0 rounded-full bg-red-500 text-gray-800"
        onClick={remove}>
        <CancelIcon />
      </span>
      <img src={src} alt={"img"} className="h-12 w-auto rounded-md" />
    </div>
  );

  return (
    <>
      <br />
      <Grid container spacing={3}>
        <Grid item xs={5}>
          <label htmlFor="">Name Disposal</label>
          <input
            type="text"
            className="form-input"
            value={nameDisposal}
            onChange={(e) => setNameDisposal(e.target.value)}
          />
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={5}>
          <label htmlFor="">Description</label>
          <textarea
            className="form-input-area"
            cols="30"
            rows="10"
            value={descriptionDisposal}
            onChange={(e) => setDescriptionDisposal(e.target.value)}></textarea>
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={8}>
          <div className="wrapper_dispos__status">
            <label className="label-inv" htmlFor="">
              Status
            </label>
            <Grid container spacing={3}>
              {statusDisposal.map((row) => (
                <>
                  <div className="radio-disposal">
                    <input
                      type="radio"
                      id={row.status_name}
                      value={row.id}
                      name="statusdis"
                    />
                    <label htmlFor={row.status_name} className="radio-label">
                      {row.status_name}
                    </label>
                  </div>
                </>
              ))}
            </Grid>
          </div>
        </Grid>
        <Grid item xs={5}>
          <label htmlFor="upload">
            <span className="rounded-btn">
              <input
                type="file"
                accept="image/jpg,image/png,image/jpeg"
                id="uploadDisposal"
                className="form-input"
                multiple={true}
                onChange={onChange}
              />
            </span>
          </label>
        </Grid>
        <Grid item xs={7}>
          <div className="flex flex-row flex-wrap justify-center items-center ">
            {dataImg.previews.map((url, index) => (
              <PreviewImg
                key={index}
                src={url}
                remove={() => onRemoveOne(index)}
              />
            ))}
          </div>
        </Grid>
      </Grid>
      <Grid item xs={4}></Grid>
      <TableContainer className={classes.tableWidth}>
        <Paper>
          <Table className={classes.table} aria-label="custom pagination table">
            <TableHead classes={{ root: classes.thead }}>
              <TableRow>
                <StyledTableCell>Asset No</StyledTableCell>
                <StyledTableCell>Name Item</StyledTableCell>
                <StyledTableCell>User/Dept</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Area</StyledTableCell>
                <StyledTableCell>QTY</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? selectDisposal.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : selectDisposal
              ).map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.asset_number}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.asset_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.type_asset}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.category_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.area_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.asset_quantity}
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
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={selectDisposal.length}
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
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          className={classes.btnNext}>
          Submit
        </Button>
      </Grid>
      <br />
      <br />
      <br />
      <br />
      <br />
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

export default InputDisposal;

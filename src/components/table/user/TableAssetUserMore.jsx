import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  makeStyles,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
  useTheme,
  TablePagination,
  TableFooter,
} from "@material-ui/core";
import "../../../assets/master.css";
import "../../../assets/dashboard.css";
import Loading from "../../asset/Loading";
import { Link } from "react-router-dom";
import { pathEndPoint, authEndPoint } from "../../../assets/menu";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const userID = cookies.get("id");
const userDepartement = cookies.get("departement");

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
  console.log(props);

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
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },

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
    width: "100%",
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
  headerMaster: {
    paddingLeft: "30px",
    paddingRight: "30px",
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const TableAssetUserMore = () => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);
  const [dataAssetUser, setDataAssetUser] = useState([]);
  const [dataAssetDepartement, setDataAssetDepartement] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      getAssetUser();
    }, 2000);
    // getAsset();
  }, []);

  const getAssetUser = async () => {
    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory`;

    const requestOne = await axios.get(inventory);

    axios
      .all([requestOne])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];

          const filterAsset = responseOne.data.data.inventorys;

          let userfilterAsset = filterAsset.filter(
            (item) => item.used_by === parseInt(userID)
          );

          let departementfilterAsset = filterAsset.filter(
            (item) =>
              item.departement === parseInt(userDepartement) &&
              item.type_asset !== "user"
          );

          setDataAssetUser(userfilterAsset);
          setDataAssetDepartement(departementfilterAsset);

          setIsLoading(false);
        })
      )
      .catch((error) => {
        console.log(error);
      });
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, setDataAssetUser.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows2 =
    rowsPerPage -
    Math.min(rowsPerPage2, dataAssetDepartement.length - page2 * rowsPerPage2);

  const handleChangePage2 = (event, newPage2) => {
    setPage2(newPage2);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setPage2(0);
  };

  return (
    <>
      <div className={classes.toolbar} />
      <br />
      <Grid container className={classes.headerMaster} spacing={3}>
        <Grid item xs={12} sm={12}>
          <TableContainer className={classes.tableWidth}>
            <Paper style={{ padding: "50px" }}>
              <Typography variant="h6" style={{ marginLeft: "10px" }}>
                My Asset
              </Typography>
              <Table
                className={classes.table}
                aria-label="custom pagination table">
                <TableHead classes={{ root: classes.thead }}>
                  <TableRow>
                    <StyledTableCell>Asset Name</StyledTableCell>
                    <StyledTableCell>Unit/Part</StyledTableCell>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>Sub Category</StyledTableCell>
                    <StyledTableCell>QTY</StyledTableCell>
                  </TableRow>
                </TableHead>

                {isLoading ? (
                  <Loading />
                ) : (
                  <TableBody>
                    {(rowsPerPage > 0
                      ? dataAssetUser.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : dataAssetUser
                    ).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.asset_name}
                        </TableCell>
                        <TableCell>{row.asset_part_or_unit}</TableCell>
                        <TableCell>{row.category_name}</TableCell>
                        <TableCell>{row.subcategory_name}</TableCell>
                        <TableCell>{row.asset_quantity}</TableCell>
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
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: -1 },
                      ]}
                      colSpan={3}
                      count={dataAssetUser.length}
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
        </Grid>
        <br />
        <Grid item xs={12} sm={12}>
          <TableContainer className={classes.tableWidth}>
            <Paper style={{ padding: "50px" }}>
              <Typography variant="h6" style={{ marginLeft: "10px" }}>
                Asset Departement
              </Typography>
              <Table
                className={classes.table}
                aria-label="custom pagination table">
                <TableHead classes={{ root: classes.thead }}>
                  <TableRow>
                    <StyledTableCell>Asset Name</StyledTableCell>
                    <StyledTableCell>Unit/Part</StyledTableCell>
                    <StyledTableCell>Category</StyledTableCell>
                    <StyledTableCell>Sub Category</StyledTableCell>
                    <StyledTableCell>QTY</StyledTableCell>
                  </TableRow>
                </TableHead>

                {isLoading ? (
                  <Loading />
                ) : (
                  <TableBody>
                    {(rowsPerPage2 > 0
                      ? dataAssetDepartement.slice(
                          page2 * rowsPerPage2,
                          page2 * rowsPerPage2 + rowsPerPage2
                        )
                      : dataAssetDepartement
                    ).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.asset_name}
                        </TableCell>
                        <TableCell>{row.asset_part_or_unit}</TableCell>
                        <TableCell>{row.category_name}</TableCell>
                        <TableCell>{row.subcategory_name}</TableCell>
                        <TableCell>{row.asset_quantity}</TableCell>
                      </TableRow>
                    ))}
                    {emptyRows2 > 0 && (
                      <TableRow style={{ height: 20 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                )}

                <TableFooter className={classes.posPagination}>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[
                        5,
                        10,
                        25,
                        { label: "All", value: -1 },
                      ]}
                      colSpan={3}
                      count={dataAssetDepartement.length}
                      rowsPerPage={rowsPerPage2}
                      page={page2}
                      SelectProps={{
                        inputProps: { "aria-label": "rows per page" },
                        native: true,
                      }}
                      onPageChange={handleChangePage2}
                      onRowsPerPageChange={handleChangeRowsPerPage2}
                      ActionsComponent={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </Paper>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
};

export default TableAssetUserMore;

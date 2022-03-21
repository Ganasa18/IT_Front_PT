import React, { useState, useEffect } from "react";
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
} from "@material-ui/core";
import "../../../assets/master.css";
import "../../../assets/dashboard.css";
import Loading from "../../asset/Loading";
import { Link } from "react-router-dom";
import { pathEndPoint, authEndPoint } from "../../../assets/menu";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
const token = cookies.get("token");
const userID = cookies.get("id");
const userDepartement = cookies.get("departement");

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles((theme) => ({
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

const TableAssetUser = () => {
  const classes = useStyles();
  const [page] = useState(0);
  const [rowsPerPage] = useState(3);
  const [page2] = useState(0);
  const [rowsPerPage2] = useState(3);
  const [dataAssetUser, setDataAssetUser] = useState([]);
  const [dataAssetDepartement, setDataAssetDepartement] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, dataAssetUser.length - page * rowsPerPage);

  const emptyRows2 =
    rowsPerPage -
    Math.min(rowsPerPage2, dataAssetDepartement.length - page2 * rowsPerPage2);

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

    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    // const requestOne = await axios.get(user, {
    //   headers: { Authorization: `Bearer ${token}` },
    // });

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

  return (
    <>
      <div className="row">
        <div className="col-6">
          <TableContainer component={Paper}>
            <Paper style={{ padding: "10px" }}>
              <Typography variant="h6" style={{ marginLeft: "10px" }}>
                My Asset
              </Typography>
              <Table
                className={classes.table}
                size="medium"
                aria-label="custom pagination table">
                <TableHead classes={{ root: classes.thead }}>
                  <TableRow>
                    <StyledTableCell>Asset Name</StyledTableCell>
                    <StyledTableCell align="right">Unit/Part</StyledTableCell>
                    <StyledTableCell align="right">Category</StyledTableCell>
                    <StyledTableCell align="right">
                      Sub Category
                    </StyledTableCell>
                    <StyledTableCell align="right">QTY</StyledTableCell>
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
                        <TableCell align="right">
                          {row.asset_part_or_unit}
                        </TableCell>
                        <TableCell align="right">{row.category_name}</TableCell>
                        <TableCell align="right">
                          {row.subcategory_name}
                        </TableCell>
                        <TableCell align="right">
                          {row.asset_quantity}
                        </TableCell>
                      </TableRow>
                    ))}

                    {emptyRows > 0 && (
                      <TableRow style={{ height: 20 * emptyRows }}>
                        <TableCell colSpan={5} />
                      </TableRow>
                    )}
                  </TableBody>
                )}
              </Table>
              <h5 className="asset-user-more">
                <Link to="/asset-user/more">see more</Link>
              </h5>
            </Paper>
          </TableContainer>
        </div>
        <div className="col-6">
          <TableContainer component={Paper}>
            <Paper style={{ padding: "10px" }}>
              <Typography variant="h6" style={{ marginLeft: "10px" }}>
                Asset Departement
              </Typography>
              <Table
                className={classes.table}
                size="medium"
                aria-label="custom pagination table">
                <TableHead classes={{ root: classes.thead }}>
                  <TableRow>
                    <StyledTableCell>Asset Name</StyledTableCell>
                    <StyledTableCell align="right">Unit/Part</StyledTableCell>
                    <StyledTableCell align="right">Category</StyledTableCell>
                    <StyledTableCell align="right">
                      Sub Category
                    </StyledTableCell>
                    <StyledTableCell align="right">QTY</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
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
                      <TableCell align="right">
                        {row.asset_part_or_unit}
                      </TableCell>
                      <TableCell align="right">{row.category_name}</TableCell>
                      <TableCell align="right">
                        {row.subcategory_name}
                      </TableCell>
                      <TableCell align="right">{row.asset_quantity}</TableCell>
                    </TableRow>
                  ))}

                  {emptyRows2 > 0 && (
                    <TableRow style={{ height: 20 * emptyRows2 }}>
                      <TableCell colSpan={5} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <h5 className="asset-departement-more">
                <Link to="/asset-user/more">see more</Link>
              </h5>
            </Paper>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default TableAssetUser;

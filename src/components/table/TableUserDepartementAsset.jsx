import React, { useState, useEffect } from "react";
import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../assets/select-search.css";
import PropTypes from "prop-types";
import axios from "axios";
import { pathEndPoint, authEndPoint } from "../../assets/menu";
import AddIcon from "@material-ui/icons/Add";

import Loading from "../asset/Loading";
import {
  Grid,
  Toolbar,
  Checkbox,
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
  Typography,
  Button,
  Fade,
  Modal,
  Backdrop,
  Divider,
} from "@material-ui/core";
import "../../assets/master.css";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Cookies from "universal-cookie";
import InputDisposal from "./disposal/InputDisposal";
const cookies = new Cookies();
const token = cookies.get("token");

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
    [theme.breakpoints.up("xl")]: {
      right: "30px",
      marginTop: "20px",
    },
    [theme.breakpoints.down("lg")]: {
      right: "30px",
      marginTop: "20px",
    },
  },

  tableWidth: {
    margin: "auto",
    width: "100%",
  },
  theadDispos: {
    "& th": {
      color: "black",
      backgroundColor: "white",
    },
  },

  paperTble: {
    height: "480px",
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
    padding: theme.spacing(2, 8, 3),
  },

  paperDisposal: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "45%",
    left: "50%",
    width: 1200,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(4, 10, 4),
    [theme.breakpoints.down("lg")]: {
      transform: "translate(-50%,-45%)",
      width: 1000,
    },
  },
  buttonAdd: {
    [theme.breakpoints.up("xl")]: {
      width: "150px",
      left: "35%",
      top: "8px",
    },

    [theme.breakpoints.down("lg")]: {
      width: "140px",
      height: "38px",
      left: "-18%",
      top: "8px",
      fontSize: 11,
    },
    [theme.breakpoints.down("sm")]: {
      bottom: "20px",
      width: "120px",
    },
    fontSize: 12,
    height: "50px",
  },
}));

const TableUserDepartementAsset = (props) => {
  const { dataUser } = props;
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  //   const [dataArea, setDataArea] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [selected, setSelected] = useState({});
  const [dataAsset, setDataAsset] = useState([]);
  const [dataAssetInv, setDataAssetInv] = useState([]);
  const [isLoadingAsset, setIsLoadingAsset] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [assetSelected, setAssetSelected] = useState([]);
  const [assetNumber, setAssetNumber] = useState("");
  const [assetName, setAssetName] = useState("");
  const [assetCategory, setAssetCategory] = useState("");
  const [selectedDisposal, setSelectedDisposal] = useState([]);
  const [modalDisposal, setModalDisposal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      getAssetDepartement();
    }, 2000);
  }, [dataAsset]);

  const getAssetDepartement = async () => {
    localStorage.setItem("userData", JSON.stringify(dataUser));
    const dataNow = localStorage.getItem("userData");
    const userNow = JSON.parse(dataNow);

    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory`;

    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    const requestOne = await axios.get(user, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const requestTwo = await axios.get(inventory);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];

          let newDataUser = responseOne.data.data.users;
          let filterAsset = responseTwo.data.data.inventorys;

          if (userNow.departement_id !== undefined) {
            filterAsset = filterAsset.filter(
              (item) =>
                item.departement === userNow.departement_id &&
                item.type_asset !== "user"
            );
          } else {
            filterAsset = filterAsset.filter(
              (item) =>
                item.departement === userNow.departement &&
                item.type_asset !== "user"
            );
          }

          const arr_user = [...newDataUser];
          const arr_invent = [...filterAsset];

          var usermap = {};

          arr_user.forEach(function (user_id) {
            usermap[user_id.id] = user_id;
          });

          arr_invent.forEach(function (invent) {
            invent.user_id = usermap[invent.used_by];
          });
          console.log(arr_invent);
          setDataAsset(arr_invent);
          setIsLoading(false);
        })
      )
      .catch((error) => {
        console.log(error);
      });
  };

  const modalPop = async () => {
    setModalOpen((prevModal) => !prevModal);
    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory`;

    await axios
      .get(inventory)
      .then((response) => {
        let dataAssetSelect = response.data.data.inventorys;

        dataAssetSelect = dataAssetSelect.filter(
          (item) =>
            item.type_asset !== "user" &&
            item.used_by === null &&
            item.status_asset === false &&
            item.disposal === false &&
            item.area === dataAsset[0]?.area
        );

        dataAssetSelect = dataAssetSelect.map((row) => ({
          name: row.asset_name,
          value: row.id,
          code: row.asset_number,
          category: row.category_name,
        }));

        setDataAssetInv(dataAssetSelect);
        setIsLoadingAsset(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAsset = async (...e) => {
    setAssetSelected(e);
    setAssetNumber(e[1].code);
    setAssetName(e[1].name);
    setAssetCategory(e[1].category);
  };

  const toggleAllSelected = (e) => {
    const { checked } = e.target;
    setAllSelected(checked);

    dataAsset &&
      setSelected(
        dataAsset.reduce(
          (selected, { id }) => ({
            ...selected,
            [id]: checked,
          }),
          {}
        )
      );
  };

  const toggleSelected = (id) => (e) => {
    if (!e.target.checked) {
      setAllSelected(false);
    }

    setSelected((selected) => ({
      ...selected,
      [id]: !selected[id],
    }));
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const isAllSelected = selectedCount === dataAsset.length;

  const isIndeterminate = selectedCount && selectedCount !== dataAsset.length;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, dataAsset.length - page * rowsPerPage);

  const handleSubmit = async () => {
    const data = {
      id: assetSelected[0],
      used_by: null,
      departement: dataAsset[0].departement,
      subdepartement: dataAsset[0].subdepartement,
      type_asset: "departement",
      status_asset: true,
    };

    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory/updatedInvent`;

    await axios
      .patch(inventory, data)
      .then((response) => {
        alert(response.data.status);
        setTimeout(() => {
          setAssetNumber("");
          setAssetName("");
          setAssetCategory("");
          setModalOpen((prevModal) => !prevModal);
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = async (row) => {
    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory/updatedInvent`;

    await axios
      .patch(inventory, {
        id: row.id,
        type_asset: row.type_asset,
        status_asset: false,
      })
      .then((response) => {
        setTimeout(() => {
          alert("success");
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkValue = () => {
    setModalDisposal((prevSelected) => !prevSelected);
    var result = Object.keys(selected).map((key) => [
      Number(key),
      selected[key],
    ]);

    result = result.filter((key) => key[1] !== false);
    result = result.map((key) => ({
      id: key[0],
    }));
    const newArrDisposal = Object.values(result).map((key) => key.id);
    var newInvent = dataAsset;
    newInvent = newInvent.filter((row) => newArrDisposal.includes(row.id));
    setSelectedDisposal(newInvent);
  };

  const modalHandleDisposal = () => {
    setModalDisposal((prevSelected) => !prevSelected);
  };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <form>
            <div className="row">
              <div className="col-12">
                <h3>Add Asset</h3>
              </div>
            </div>
            <Divider />
            <br />
            {isLoadingAsset ? (
              <isLoadingAsset />
            ) : (
              <>
                <div className="row">
                  <div className="col-6">
                    <label htmlFor="roleName">Asset Inventory</label>
                    <SelectSearch
                      options={dataAssetInv}
                      value={dataAssetInv}
                      filterOptions={fuzzySearch}
                      onChange={handleAsset}
                      search
                      placeholder="Search Assets"
                    />
                  </div>
                  <div className="col-6">
                    <label htmlFor="roleName">Asset Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={assetNumber}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row margin-top-1">
                  <div className="col-6"></div>
                  <div className="col-6">
                    <label htmlFor="roleName">Name Asset</label>
                    <input
                      type="text"
                      className="form-input"
                      value={assetName}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row margin-top-1">
                  <div className="col-6"></div>
                  <div className="col-6">
                    <label htmlFor="roleName">Category</label>
                    <input
                      type="text"
                      className="form-input"
                      value={assetCategory}
                      readOnly
                    />
                  </div>
                </div>
              </>
            )}

            <br />
            <br />
            <div className="footer-modal">
              <button className={"btn-cancel"} onClick={modalPop}>
                Cancel
              </button>
              <button
                type="button"
                className={"btn-submit"}
                onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </Fade>
    </>
  );

  const bodyDisposal = (
    <>
      <Fade in={modalDisposal}>
        <div className={classes.paperDisposal}>
          <div className="row">
            <div className="col-12">
              <h3>Disposal Asset</h3>
            </div>
          </div>
          <Divider />
          <br />
          <Grid container spacing={3}>
            <InputDisposal dataDisposal={selectedDisposal} />
          </Grid>
          <Button
            className={classes.cancelBtn}
            onClick={modalHandleDisposal}
            variant="outlined">
            Cancel
          </Button>
        </div>
      </Fade>
    </>
  );

  return (
    <>
      <TableContainer className={classes.tableWidth}>
        <Paper className={classes.paperTble}>
          <Toolbar>
            <div className="col-10">
              <Typography
                variant="h5"
                component="div"
                style={{ marginTop: "5px" }}>
                Asset Departement
              </Typography>
            </div>
            <div className="col-2">
              <Button
                onClick={modalPop}
                className={classes.buttonAdd}
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}>
                Create New
              </Button>
            </div>
          </Toolbar>
          <div className="display-disposal">
            {selectedCount > 0 ? (
              <>
                <span style={{ marginRight: "5px" }}>( </span>
                <span className="count">{selectedCount}</span>
                <span className="selected">Selected Item )</span>
              </>
            ) : null}

            {selectedCount > 0 ? (
              <button className="btn-disposal-inv" onClick={checkValue}>
                Disposal
              </button>
            ) : (
              <button
                className="btn-disposal-inv-disabled"
                disabled="disabled"
                onClick={""}>
                Disposal
              </button>
            )}
          </div>

          <Table
            className={classes.table}
            size="medium"
            aria-label="custom pagination table">
            <TableHead classes={{ root: classes.thead }}>
              <TableRow>
                <StyledTableCell padding="checkbox" style={{ width: 50 }}>
                  <Checkbox
                    checked={allSelected || isAllSelected} // <-- all selected
                    onChange={toggleAllSelected} // <-- toggle state
                    indeterminate={isIndeterminate} // <-- some selected
                  />
                </StyledTableCell>
                <StyledTableCell>Asset No</StyledTableCell>
                <StyledTableCell>Asset Name</StyledTableCell>
                <StyledTableCell>Unit/Parts</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Sub Category</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? dataAsset.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : dataAsset
                ).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell padding="checkbox" style={{ width: 50 }}>
                      <Checkbox
                        checked={selected[row.id] || allSelected} // <-- is selected
                        onChange={toggleSelected(row.id)} // <-- toggle state
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.asset_number}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.asset_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.asset_part_or_unit}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.category_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.subcategory_name}
                    </TableCell>
                    <TableCell align="center">
                      <button
                        className="btn-delete"
                        onClick={(e) => handleDelete(row)}>
                        <span
                          class="iconify icon-btn"
                          data-icon="ant-design:delete-fill"></span>
                        <span className="name-btn">Delete</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 10 * emptyRows }}>
                    <TableCell colSpan={8} />
                  </TableRow>
                )}
              </TableBody>
            )}

            <TableFooter className={classes.posPagination}>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[3]}
                  colSpan={3}
                  count={dataAsset.length}
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
        open={modalOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModal}
      </Modal>
      <Modal
        open={modalDisposal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyDisposal}
      </Modal>
    </>
  );
};

export default TableUserDepartementAsset;

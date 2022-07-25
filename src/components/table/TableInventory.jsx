import {
  Backdrop,
  Button,
  Checkbox,
  Divider,
  Fade,
  Grid,
  makeStyles,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  withStyles,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import "../../assets/master.css";
import { authEndPoint, pathEndPoint } from "../../assets/menu";
import "../asset/chips.css";
import Loading from "../asset/Loading";
import TablePaginationActions from "../asset/pagination/TablePaginationActions";
import EditInventory from "../pages/inventory/EditInventory";
import InputDisposal from "./disposal/InputDisposal";

const cookies = new Cookies();
const token = cookies.get("token");

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const useStyles2 = makeStyles((theme) => ({
  table: {
    marginTop: "20px",
    minWidth: 400,
    width: "100%",
    overflowX: "auto",
    fontSize: "20px",
  },

  posPagination: {
    position: "absolute",
    right: "100px",
  },

  tableWidth: {
    margin: "auto",
    width: "98%",
  },
  paperCard: {
    width: "110%",
    height: "100%",
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
    top: "45%",
    left: "50%",
    width: 850,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(4, 10, 4),
    [theme.breakpoints.down("lg")]: {
      transform: "translate(-50%,-45%)",
    },
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
      top: "-4%",
      left: "15%",
      width: 1000,
      transform: "scale(0.9)",
    },
  },
  cancelBtn: {
    color: "#EB5757",
    border: "1px solid #EB5757",
    width: "130px",
    height: "40px",
    fontSize: "13px",
    position: "relative",
    left: "0",
    transform: "translate(0%, -20%)",
    textTransform: "capitalize",
    [theme.breakpoints.down("lg")]: {
      width: "115px",
      height: "30px",
      fontSize: "11px",
    },
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

const TableInventory = (props) => {
  const classes = useStyles2();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editModal, setEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [allSelected, setAllSelected] = useState(false);
  const [selected, setSelected] = useState({});
  const [dataInventory, setDataInventory] = useState([]);
  const [editedRowData, setEditedRowData] = useState([]);
  const [lastNumber, setLastNumber] = useState("");
  const [selectedDisposal, setSelectedDisposal] = useState([]);
  const [modalDisposal, setModalDisposal] = useState(false);

  const { searchValue, filterValue, sortValue } = props;

  useEffect(() => {
    getInventory();

    if (searchValue) {
      setTimeout(() => {
        searchHandle(searchValue);
      }, 1000);
    }

    if (filterValue) {
      setTimeout(() => {
        filterHandle(filterValue);
      }, 1000);
    }

    if (sortValue) {
      setTimeout(() => {
        handleSort(sortValue);
      }, 1000);
    }
  }, [searchValue, filterValue, sortValue]);

  // Arbitrary asynchronous function
  function doAsyncStuff() {
    return Promise.resolve();
  }

  // The helper function
  async function filter(arr, callback) {
    const fail = Symbol();
    return (
      await Promise.all(
        arr.map(async (item) => ((await callback(item)) ? item : fail))
      )
    ).filter((i) => i !== fail);
  }

  const filterHandle = (filterValue) => {
    let checkData = filterValue.every((element) => element === "reset");

    if (!checkData) {
      setIsLoading(true);
      if (filterValue[0] !== "" && filterValue[1] !== "") {
        (async function () {
          const results = await filter(dataInventory, async (item) => {
            await doAsyncStuff();
            return (
              item.status_asset === Boolean(parseInt(filterValue[0])) &&
              item.type_asset === filterValue[1]
            );
          });

          // console.log(results.sort((a, b) => (a.id > b.id ? 1 : -1)));

          setPage(0);
          setDataInventory(results);
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        })();
        return;
      }

      if (filterValue[0] !== "") {
        (async function () {
          if (filterValue[0] !== "" && filterValue[2] !== "") {
            const results = await filter(dataInventory, async (item) => {
              await doAsyncStuff();
              return (
                item.status_asset === Boolean(parseInt(filterValue[0])) &&
                item.area === filterValue[2]
              );
            });
            console.log("status & area");
            setPage(0);
            setDataInventory(results);
            setTimeout(() => {
              setIsLoading(false);
            }, 1500);
            return;
          }

          if (filterValue[0] !== "" && filterValue[3] !== "") {
            const results = await filter(dataInventory, async (item) => {
              await doAsyncStuff();
              return (
                item.status_asset === Boolean(parseInt(filterValue[0])) &&
                item.asset_fisik_or_none === filterValue[3]
              );
            });
            console.log("status & fisik non");
            setPage(0);
            setDataInventory(results);
            setTimeout(() => {
              setIsLoading(false);
            }, 1500);
            return;
          }

          const results = await filter(dataInventory, async (item) => {
            await doAsyncStuff();
            return item.status_asset === Boolean(parseInt(filterValue[0]));
          });
          console.log("status");
          setPage(0);
          setDataInventory(results);
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        })();

        return;
      }
      if (filterValue[1] !== "") {
        (async function () {
          const results = await filter(dataInventory, async (item) => {
            await doAsyncStuff();
            return item.type_asset === filterValue[1];
          });
          console.log("usr/dpt");
          setPage(0);
          setDataInventory(results);
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        })();

        return;
      }

      if (filterValue[2] !== "") {
        (async function () {
          const results = await filter(dataInventory, async (item) => {
            await doAsyncStuff();
            return item.area === filterValue[2];
          });

          setPage(0);
          setDataInventory(results);
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        })();

        return;
      }

      if (filterValue[3] !== "") {
        (async function () {
          const results = await filter(dataInventory, async (item) => {
            await doAsyncStuff();
            return item.asset_fisik_or_none === filterValue[3];
          });

          setPage(0);
          setDataInventory(results);
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        })();

        return;
      }
      if (filterValue[4] !== "") {
        (async function () {
          const results = await filter(dataInventory, async (item) => {
            await doAsyncStuff();
            return item.asset_part_or_unit === filterValue[4];
          });

          setPage(0);
          setDataInventory(results);
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        })();

        return;
      }
    }
  };

  function filterByValue(array, value) {
    return array.filter(
      (data) =>
        JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  const searchHandle = (searchValue) => {
    if (searchValue !== null) {
      let searchRequest = filterByValue(dataInventory, searchValue);
      setDataInventory(searchRequest);
    }
  };

  const handleSort = (sortValue) => {
    let sortData = [...dataInventory];
    switch (sortValue) {
      case "asc":
        sortData.sort((a, b) => (a.id > b.id ? 1 : -1));
        setDataInventory(sortData);
        return;
      case "desc":
        sortData.sort((a, b) => (a.id > b.id ? -1 : 1));
        setDataInventory(sortData);
        return;
      case "alpha":
        sortData.sort((a, b) =>
          a.asset_name !== b.asset_name
            ? a.asset_name < b.asset_name
              ? 1
              : -1
            : 0
        );
        setDataInventory(sortData);
        return;
      case "revalpha":
        sortData.sort((a, b) =>
          a.asset_name !== b.asset_name
            ? a.asset_name < b.asset_name
              ? -1
              : 1
            : 0
        );
        setDataInventory(sortData);
        return;
      case "all":
        return window.location.reload();
      default:
        return null;
    }
  };

  const getInventory = async () => {
    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory`;

    const requestOne = await axios.get(user, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const requestTwo = await axios.get(inventory);
    axios.all([requestOne, requestTwo]).then(
      axios.spread((...responses) => {
        const responseOne = responses[0];
        const responseTwo = responses[1];

        let newDataUser = responseOne.data.data.users;
        let newDataInvent = responseTwo.data.data.inventorys;

        const arr_user = [...newDataUser];
        const arr_invent = [...newDataInvent];

        var usermap = {};

        arr_user.forEach(function (user_id) {
          usermap[user_id.id] = user_id;
        });

        arr_invent.forEach(function (invent) {
          invent.user_id = usermap[invent.used_by];
        });
        setDataInventory(arr_invent);
        setIsLoading(false);
      })
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const modalClose = () => {
    setEditModal(false);
  };

  const modalHandleDisposal = () => {
    setModalDisposal((prevSelected) => !prevSelected);
  };

  const toggleAllSelected = (e) => {
    const { checked } = e.target;
    setAllSelected(checked);

    dataInventory &&
      setSelected(
        dataInventory.reduce(
          (selected, { id }) => ({
            ...selected,
            [id]: checked,
          }),
          {}
        )
      );
  };

  const toggleSelected = (row) => (e) => {
    if (!e.target.checked) {
      setAllSelected(false);
    }

    // console.log(e);

    // var obj = row;
    // var newData = [...selectInventory, obj];

    // setSelectInventory(arrUnique(newData));

    setSelected((selected) => ({
      ...selected,
      [row.id]: !selected[row.id],
    }));
  };

  // function arrUnique(arr) {
  //   var cleaned = [];
  //   arr.forEach(function (itm) {
  //     var unique = true;
  //     cleaned.forEach(function (itm2) {
  //       if (_.isEqual(itm, itm2)) unique = false;
  //     });
  //     if (unique) cleaned.push(itm);
  //   });
  //   return cleaned;
  // }

  function calbill(date) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    var myDate = new Date(date);
    var d = myDate.getDate();
    var m = myDate.getMonth();
    m += 1;
    var y = myDate.getFullYear();

    var newdate = d + " " + monthNames[myDate.getMonth()] + " " + y;
    return newdate;
  }

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const isAllSelected = selectedCount === dataInventory.length;

  const isIndeterminate =
    selectedCount && selectedCount !== dataInventory.length;

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, dataInventory.length - page * rowsPerPage);

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
    var newInvent = dataInventory;
    newInvent = newInvent.filter((row) => newArrDisposal.includes(row.id));
    setSelectedDisposal(newInvent);
  };

  const bodyModal = (
    <>
      <Fade in={editModal}>
        <div className={classes.paper}>
          <div className="row">
            <div className="col-9">
              <h3>Edit Inventory</h3>
            </div>
            <div className="col-3">
              <p className="last-number-edit">{lastNumber}</p>
            </div>
          </div>

          <Divider />
          <br />
          <EditInventory rowData={editedRowData} />

          <Button
            className={classes.cancelBtn}
            onClick={modalClose}
            variant="outlined">
            Cancel
          </Button>
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

  const editHandle = (row) => {
    setEditedRowData(row);
    var text = row.asset_number;
    // text = text.split("-")[1].trim();
    setLastNumber(text);

    setEditModal(true);
  };

  return (
    <>
      <div className="col-12">
        <div className="card">
          <div className="display-disposal-invent">
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
                onClick={checkValue}>
                Disposal
              </button>
            )}
          </div>
        </div>
      </div>
      <TableContainer className={classes.tableWidth}>
        <Paper className={classes.paperCard}>
          <Table
            className={classes.table}
            aria-label="custom pagination table"
            id="Table1">
            <TableHead classes={{ root: classes.thead }}>
              <TableRow>
                <StyledTableCell padding="checkbox" style={{ width: 50 }}>
                  <Checkbox
                    checked={allSelected || isAllSelected} // <-- all selected
                    onChange={toggleAllSelected} // <-- toggle state
                    indeterminate={isIndeterminate} // <-- some selected
                  />
                </StyledTableCell>
                <StyledTableCell>Area</StyledTableCell>
                <StyledTableCell>User/Dept.</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Sub Category</StyledTableCell>
                <StyledTableCell>Asset No</StyledTableCell>
                <StyledTableCell>Asset Name</StyledTableCell>
                <StyledTableCell>Used By</StyledTableCell>
                <StyledTableCell>Fisik/Non</StyledTableCell>
                <StyledTableCell align="center">Unit/Part.</StyledTableCell>
                <StyledTableCell>TAG</StyledTableCell>
                <StyledTableCell>Date TAG</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            {isLoading ? (
              <Loading />
            ) : (
              <TableBody>
                {(rowsPerPage > 0
                  ? dataInventory.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : dataInventory
                ).map((row) => (
                  <TableRow id="check-value" key={row.id}>
                    <TableCell padding="checkbox" style={{ width: 50 }}>
                      <Checkbox
                        value={row.id}
                        checked={selected[row.id] || allSelected} // <-- is selected
                        onChange={toggleSelected(row)} // <-- toggle state
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.alias_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.type_asset}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.category_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.subcategory_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.asset_number}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.asset_name}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.user_id === undefined
                        ? row.departement_name
                        : row.user_id.username}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.asset_fisik_or_none}
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      {row.asset_part_or_unit === ""
                        ? " - "
                        : row.asset_part_or_unit}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.tag_item ? row.tag_item : "no set"}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.createdAt ? calbill(row.createdAt) : "null"}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      <div className="chip-container">
                        {row.status_asset === true ? (
                          <span className="chip-inventory-used">Used</span>
                        ) : (
                          <span className="chip-inventory-available">
                            Available
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell style={{ width: 80 }} align="center">
                      <button
                        className="btn-edit"
                        onClick={(e) => editHandle(row)}>
                        <span
                          className="iconify icon-btn"
                          data-icon="ci:edit"></span>
                        <span className="name-btn">Edit</span>
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
            )}

            <TableFooter className={classes.posPagination}>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={dataInventory.length}
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

export default TableInventory;

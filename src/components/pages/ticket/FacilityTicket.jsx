import React, { useState, useEffect } from "react";
import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../../assets/select-search.css";
import DateFnsUtils from "@date-io/date-fns";
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Backdrop,
  Fade,
  Modal,
  Snackbar,
  Divider,
} from "@material-ui/core";
import "../../../assets/master.css";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import ActionTicketTable from "../../table/ticket/ActionTicketTable";
import FacilityTicketTable from "../../table/ticket/FacilityTicketTable";
import { pathEndPoint } from "../../../assets/menu";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },

  headerMaster: {
    paddingLeft: "30px",
    paddingRight: "30px",
  },

  cardRoot: {
    fontSize: 12,
  },

  paper: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "50%",
    left: "50%",
    width: 950,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 6, 3),
  },
  paperFilter: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "30%",
    left: "50%",
    width: 540,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 10, 3),
  },
  paperSort: {
    position: "fixed",
    transform: "translate(-50%,-46%)",
    top: "45%",
    left: "50%",
    width: 400,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 10, 3),
  },
}));

const FacilityTicket = () => {
  const classes = useStyles();
  const [searchValue, SetSearchValue] = useState("");
  const [valueStatus, setValueStatus] = useState("");
  const [dataStatus, setDataStatus] = useState([]);
  const [searchValueFilter, setSearchValueFilter] = useState(null);
  const [modalOpenFilter, setModalOpenFilter] = useState(false);
  const [modalOpenSort, setModalOpenSort] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [selectedDate2, handleDateChange2] = useState(new Date());
  const [sortActive, setSortActive] = useState("");
  const [sortValue, setSortValue] = useState("");

  useEffect(() => {
    getStatusList();
  }, []);

  const getStatusList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/status`
      )
      .then((response) => {
        console.log(response.data.data.statuss);
        const DataStatus = response.data.data.statuss;

        const arr = [...DataStatus];
        let newArr = arr.map((row) => ({
          value: row.id,
          name: row.status_name,
        }));
        newArr = newArr.filter((row) =>
          [4, 12, 13, 14, 15, 19].includes(row.value)
        );

        setDataStatus(newArr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modalPopFilter = () => {
    setModalOpenFilter(true);
  };

  const modalPopSort = () => {
    setModalOpenSort(true);
  };

  const modalClose = () => {
    setModalOpenFilter(false);
    setModalOpenSort(false);
  };

  const handleSearch = (e) => {
    var typingTimer; //timer identifier
    var doneTypingInterval = 10000;
    clearTimeout(typingTimer);
    var value = e.target.value;
    if (value) {
      typingTimer = setTimeout(doneTyping(value), doneTypingInterval);
    }
  };

  function doneTyping(value) {
    SetSearchValue(value);
  }

  const handleFilter = (e) => {
    e.preventDefault();
    var arr = [];
    arr.push(valueStatus);
    arr.push(selectedDate);
    arr.push(selectedDate2);
    setSearchValueFilter(arr);
    setTimeout(() => {
      setModalOpenFilter(false);
    }, 2000);
  };

  const handleResetFilter = () => {
    setSearchValueFilter(["reset"]);
    SetSearchValue("");
    setValueStatus("");
    setSortActive("");
    setSortValue("");
  };

  const handleActiveSort = (e) => {
    setSortActive(e.target.innerHTML);
  };

  const handleSort = (e) => {
    e.preventDefault();

    switch (sortActive) {
      case "All":
        setSortValue("all");
        setTimeout(() => {
          setModalOpenSort(false);
        }, 2000);

        return;
      case "Z - A":
        setSortValue("alpha");
        setTimeout(() => {
          setModalOpenSort(false);
        }, 2000);
        return;
      case "Highest Number":
        setSortValue("desc");
        setTimeout(() => {
          setModalOpenSort(false);
        }, 2000);
        return;
      case "A - Z":
        setSortValue("revalpha");
        setTimeout(() => {
          setModalOpenSort(false);
        }, 2000);
        return;
      case "Lowest Number":
        setSortValue("asc");
        setTimeout(() => {
          setModalOpenSort(false);
        }, 2000);
        return;
      default:
        return console.log("empty");
    }
  };

  const bodyModalFilter = (
    <>
      <Fade in={modalOpenFilter}>
        <div className={classes.paperFilter}>
          <div className="row">
            <div className="col-8">
              <h2>Filter</h2>
            </div>
            <div className="col-4">
              <a class="close-btn" role="button" onClick={modalClose}>
                &times;
              </a>
            </div>
          </div>
          <form onSubmit={handleFilter}>
            <div className="row">
              <div className="col-12">
                <label htmlFor="">Status</label>
                <SelectSearch
                  options={dataStatus}
                  value={dataStatus}
                  onChange={(e) => {
                    setValueStatus(e);
                  }}
                  filterOptions={fuzzySearch}
                  search
                  placeholder="Search Status"
                />
              </div>
            </div>
            <div className="row margin-top-2">
              <div className="col-5">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="Date"
                    format="dd/MM/yyyy"
                    value={selectedDate}
                    InputAdornmentProps={{ position: "start" }}
                    onChange={(date) => handleDateChange(date)}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <div className="col-2">
                <label
                  htmlFor=""
                  style={{
                    position: "absolute",
                    right: "48%",
                    bottom: "35%",
                    fontSize: "18px",
                    color: "#8b8787",
                  }}>
                  To
                </label>
              </div>
              <div className="col-5">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    autoOk
                    variant="inline"
                    inputVariant="outlined"
                    label="Date"
                    format="dd/MM/yyyy"
                    value={selectedDate2}
                    InputAdornmentProps={{ position: "start" }}
                    onChange={(date) => handleDateChange2(date)}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </div>

            <br />
            <br />
            <div className="footer-modal">
              <button
                type="button"
                className={"btn-reset-filter"}
                onClick={handleResetFilter}>
                Reset
              </button>
              <button className={"btn-filter"} type={"submit"}>
                Filter
              </button>
            </div>
          </form>
          <br />
        </div>
      </Fade>
    </>
  );

  const bodyModalSort = (
    <>
      <Fade in={modalOpenSort}>
        <div className={classes.paperSort}>
          <div className="row">
            <div className="col-8">
              <h2>Sort</h2>
            </div>
            <div className="col-4">
              <a class="close-btn" role="button" onClick={modalClose}>
                &times;
              </a>
            </div>
          </div>
          <form onSubmit={handleSort}>
            <div className="row margin-top-3 ">
              <div className="container-pill position-pill">
                <button
                  type="button"
                  onClick={handleActiveSort}
                  className={`pill-sort ${
                    sortActive === "All" ? "active" : ""
                  }`}>
                  All
                </button>
                <button
                  onClick={handleActiveSort}
                  type="button"
                  className={`pill-sort ${
                    sortActive === "A - Z" ? "active" : ""
                  }`}>
                  A - Z
                </button>
                <button
                  onClick={handleActiveSort}
                  type="button"
                  className={`pill-sort  ${
                    sortActive === "Highest Number" ? "active" : ""
                  }`}>
                  Highest Number
                </button>
                <button
                  onClick={handleActiveSort}
                  type="button"
                  className={`pill-sort ${
                    sortActive === "Z - A" ? "active" : ""
                  }`}>
                  Z - A
                </button>
                <button
                  onClick={handleActiveSort}
                  type="button"
                  className={`pill-sort ${
                    sortActive === "Lowest Number" ? "active" : ""
                  }`}>
                  Lowest Number
                </button>
              </div>
            </div>

            <br />
            <div className="row">
              <div className="col-12">
                <button
                  style={{ width: "100%" }}
                  className={"btn-filter"}
                  type={"submit"}>
                  Sort
                </button>
              </div>
            </div>
          </form>
          <br />
        </div>
      </Fade>
    </>
  );

  return (
    <>
      <div className={classes.toolbar} />
      <Grid container className={classes.headerMaster} spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom>
            Facility Request
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className="card">
            <div className="row">
              <div className="col-4">
                <div className="input-container">
                  <span
                    className="iconify icon"
                    data-icon="bx:bx-search"></span>
                  <input
                    onChange={handleSearch}
                    className="input-field"
                    type="text"
                    placeholder="Search..."
                  />
                </div>
              </div>
              <div className="col-2">
                <button className="filter-btn" onClick={modalPopFilter}>
                  <span
                    class="iconify icon-btn"
                    data-icon="cil:list-filter"></span>
                  <span className="name-btn">Filter</span>
                </button>
              </div>
              <div className="col-2">
                <button className="sort-btn" onClick={modalPopSort}>
                  <span
                    class="iconify icon-btn"
                    data-icon="bx:sort-alt-2"></span>
                  <span className="name-btn">Sort</span>
                </button>
              </div>
              <div className="col-4"></div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className="row">
            <FacilityTicketTable
              searchValue={searchValue}
              filterValue={searchValueFilter}
              sortValue={sortValue}
            />
          </div>
        </Grid>
      </Grid>
      <Modal
        open={modalOpenFilter}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModalFilter}
      </Modal>
      <Modal
        open={modalOpenSort}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModalSort}
      </Modal>
    </>
  );
};

export default FacilityTicket;

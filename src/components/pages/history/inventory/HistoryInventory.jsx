import React, { useState, useEffect } from "react";
import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../../../assets/select-search.css";
import {
  makeStyles,
  Grid,
  Typography,
  Backdrop,
  Fade,
  Modal,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import "../../../../assets/master.css";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import { pathEndPoint } from "../../../../assets/menu";
import HistoryInventoryTable from "./table/HistoryInventoryTable";

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
}));

const HistoryInventory = () => {
  const classes = useStyles();
  const [searchValue, SetSearchValue] = useState("");
  const [valueStatus, setValueStatus] = useState("");
  const [selectedDate, handleDateChange] = useState(new Date());
  const [selectedDate2, handleDateChange2] = useState(new Date());
  const [searchValueFilter, setSearchValueFilter] = useState(null);
  const [modalOpenFilter, setModalOpenFilter] = useState(false);

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

  const modalPopFilter = () => {
    setModalOpenFilter(true);
  };

  const modalClose = () => {
    setModalOpenFilter(false);
  };

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
    handleDateChange(new Date());
    handleDateChange2(new Date());
    SetSearchValue("");
    setValueStatus("");
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
              <a
                href={() => false}
                class="close-btn"
                role="button"
                onClick={modalClose}>
                &times;
              </a>
            </div>
          </div>
          <form onSubmit={handleFilter}>
            <div className="row">
              <div className="col-12">
                <label htmlFor="">Status</label>
                <select
                  className="form-input-select-filter"
                  value={valueStatus}
                  onChange={(e) => setValueStatus(e.target.value)}>
                  <option value=" ">Status</option>
                  <option value="1">Used</option>
                  <option value="0">Available</option>
                </select>
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

  return (
    <>
      <div className={classes.toolbar} />
      <Grid container className={classes.headerMaster} spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom>
            History Inventory
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
              <div className="col-4">
                <button className="filter-btn" onClick={modalPopFilter}>
                  Filter
                </button>
              </div>
              <div className="col-4"></div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className="row">
            <HistoryInventoryTable
              searchValue={searchValue}
              filterValue={searchValueFilter}
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
    </>
  );
};

export default HistoryInventory;

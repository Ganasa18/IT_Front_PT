import React, { useState, useEffect } from "react";
import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../assets/select-search.css";

import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Backdrop,
  Fade,
  Modal,
  Divider,
} from "@material-ui/core";

import "../../assets/master.css";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import { authEndPoint, pathEndPoint } from "../../assets/menu";

import Cookies from "universal-cookie";
import TableInventory from "../table/TableInventory";
import CreateInventory from "./inventory/CreateInventory";

const cookies = new Cookies();

const token = cookies.get("token");

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

  buttonAdd: {
    [theme.breakpoints.up("xl")]: {
      width: "150px",
      left: "60%",
      top: "20px",
    },

    [theme.breakpoints.down("lg")]: {
      width: "150px",
      left: "40%",
      top: "20px",
    },
    [theme.breakpoints.down("sm")]: {
      bottom: "20px",
      width: "120px",
    },
    fontSize: 12,
  },
  cardRoot: {
    fontSize: 12,
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
  paperFilter: {
    position: "fixed",
    transform: "translate(-50%,-46%)",
    top: "45%",
    left: "50%",
    width: 540,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 10, 3),
    [theme.breakpoints.down("lg")]: {
      top: "-4%",
      left: "34%",
      width: 540,
      transform: "scale(0.85)",
    },
  },
}));

const Inventory = () => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [lastNumber, setLastNumber] = useState("");
  const [searchValue, SetSearchValue] = useState("");
  const [valueStatus, setValueStatus] = useState("");
  const [valueUserDpt, setValueUserDpt] = useState("");
  const [valueFisikNon, setValueFisikNon] = useState("");
  const [valueUnitPart, setValueUnitPart] = useState("");
  const [valueArea, setValueArea] = useState("");
  const [dataArea, setDataArea] = useState([]);
  const [searchValueFilter, setSearchValueFilter] = useState(null);
  const [modalOpenFilter, setModalOpenFilter] = useState(false);

  useEffect(() => {
    getInvLatestId();
    getAreaList();
  }, []);

  const getAreaList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/area`
      )
      .then((response) => {
        const DataArea = response.data.data.areas;

        const arr = [...DataArea];
        const newArr = arr.map((row) => ({
          value: row.id,
          name: row.area_name,
        }));
        setDataArea(newArr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modalPop = () => {
    setModalOpen(true);
  };

  const modalClose = () => {
    setModalOpen(false);
    setModalOpenFilter(false);
  };

  const modalPopFilter = () => {
    setModalOpenFilter(true);
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
    arr.push(valueUserDpt);
    arr.push(valueArea);
    arr.push(valueFisikNon);
    arr.push(valueUnitPart);

    setSearchValueFilter(arr);
    setTimeout(() => {
      setModalOpenFilter(false);
    }, 2000);
  };

  const handleResetFilter = () => {
    setSearchValueFilter(["reset"]);
    SetSearchValue("");
    setValueStatus("");
    setValueArea("");
    setValueUserDpt("");
    setValueFisikNon("");
    setValueUnitPart("");
  };

  const getInvLatestId = async () => {
    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory/latestId`;

    await axios
      .get(inventory)
      .then((response) => {
        var text = response.data.data?.inventory[0]?.asset_number;
        var numb = 0;
        if (text === undefined) {
          numb = parseInt(numb) + 1;
          var str = "" + numb;
          var pad = "000";
          var ans = pad.substring(0, pad.length - str.length) + str;
          setLastNumber(ans);
          return;
        }
        text = text.split("-")[1].trim();
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

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <div className="row">
            <div className="col-10">
              <h3>Create Inventory</h3>
            </div>
            <div className="col-2">
              <p className="last-number">{lastNumber}</p>
            </div>
          </div>
          <Divider />
          <br />
          <CreateInventory />
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
            <div className="row margin-top-1">
              <div className="col-12">
                <label htmlFor="">User/Departement</label>
                <select
                  className="form-input-select-filter"
                  value={valueUserDpt}
                  onChange={(e) => setValueUserDpt(e.target.value)}>
                  <option value="">User/Departement</option>
                  <option value="user">User</option>
                  <option value="departement">Departement</option>
                </select>
              </div>
            </div>
            <div className="row margin-top-1">
              <div className="col-12">
                <label htmlFor="roleName">Area</label>
                <SelectSearch
                  options={dataArea}
                  value={dataArea}
                  onChange={(e) => {
                    setValueArea(e);
                  }}
                  filterOptions={fuzzySearch}
                  search
                  placeholder="Search Area"
                />
              </div>
            </div>
            <div className="row margin-top-2">
              <div className="col-12">
                <label htmlFor="">Fisik/Non Fisik</label>
                <select
                  className="form-input-select-filter"
                  value={valueFisikNon}
                  onChange={(e) => setValueFisikNon(e.target.value)}>
                  <option value="">Fisik/Non Fisik</option>
                  <option value="fisik">Fisik</option>
                  <option value="nonfisik">Non Fisik</option>
                </select>
              </div>
            </div>
            <div className="row margin-top-1">
              <div className="col-12">
                <label htmlFor="">Unit/Part</label>
                <select
                  className="form-input-select-filter"
                  value={valueUnitPart}
                  onChange={(e) => setValueUnitPart(e.target.value)}>
                  <option value="">Unit/Part</option>
                  <option value="unit">Unit</option>
                  <option value="part">Part</option>
                </select>
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
            Inventory
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
              <div className="col-4">
                <Button
                  onClick={modalPop}
                  variant="contained"
                  color="primary"
                  className={classes.buttonAdd}
                  startIcon={<AddIcon />}>
                  Create New
                </Button>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className="row">
            <TableInventory
              searchValue={searchValue}
              filterValue={searchValueFilter}
            />
          </div>
        </Grid>
      </Grid>
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

export default Inventory;

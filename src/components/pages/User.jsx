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
} from "@material-ui/core";

import "../../assets/master.css";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import { authEndPoint, pathEndPoint } from "../../assets/menu";

import Cookies from "universal-cookie";
import TableUser from "../table/TableUser";

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
    top: "30%",
    left: "50%",
    width: 850,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },

  paperFilter: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "30%",
    left: "50%",
    width: 500,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 10, 3),
  },
}));

const User = () => {
  const classes = useStyles();
  const [dataRole, setDataRole] = useState([]);
  const [dataArea, setDataArea] = useState([]);
  const [listDataDepartement, setListDataDepartement] = useState([]);
  const [dataDepartement, setDataDepartement] = useState([]);
  const [dataSubDepartement, setDataSubDepartement] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenFilter, setModalOpenFilter] = useState(false);
  const [valueArea, setValueArea] = useState("");
  const [valueDepartement, setValueDepartement] = useState("");
  const [valueSubDepartement, setValueSubDepartement] = useState("");
  const [valueRole, setValueRole] = useState("");
  const [valueUsername, setValueUsername] = useState("");
  const [valueEmail, setValueEmail] = useState("");
  const [valueNoHP, setValueNoHP] = useState("");
  const [selectedValueEmply, setSelectedValueEmply] = useState("permanent");
  const [searchValue, SetSearchValue] = useState("");
  const [searchValueFilter, setSearchValueFilter] = useState(null);

  useEffect(() => {
    getRoleList();
    getAreaList();
    getDepartementList();
  }, []);

  const modalPop = () => {
    setModalOpen(true);
  };

  const modalPopFilter = () => {
    setModalOpenFilter(true);
  };

  const getRoleList = async () => {
    await axios
      .get(
        `${authEndPoint[0].url}${
          authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
        }/api/v1/role`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        const DataRole = response.data.data.roles;

        const arr = [...DataRole];
        const newArr = arr.map((row) => ({
          value: row.id,
          name: row.role_name,
        }));
        setDataRole(newArr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const getDepartementList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/departement`
      )
      .then((response) => {
        const DepartementList = response.data.data.departements;
        const arr = [...DepartementList];
        const newArr = arr.map((row) => ({
          value: row.id,
          name: row.departement_name,
        }));
        setListDataDepartement(newArr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modalClose = () => {
    setModalOpen(false);
    setModalOpenFilter(false);
  };

  const handleChangeEmply = (event) => {
    setSelectedValueEmply(event.target.value);
  };

  const saveHandler = async (event) => {
    event.preventDefault();

    await axios
      .post(
        `${authEndPoint[0].url}${
          authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
        }/api/v1/auth/`,
        {
          username: valueUsername,
          email: valueEmail,
          password: "123",
          no_handphone: valueNoHP,
          area: valueArea,
          departement: valueDepartement,
          subdepartement: valueSubDepartement,
          employe_status: selectedValueEmply,
          role: parseInt(valueRole),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        alert(response.data.status);
        setSelectedValueEmply("permanent");
        setValueUsername("");
        setValueEmail("");
        setValueNoHP("");
        setValueArea("");
        setValueDepartement("");
        setValueSubDepartement("");
        setValueRole("");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  const handleArea = async (e) => {
    setValueArea(e);
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/departement`
      )
      .then((response) => {
        const DepartementList = response.data.data.departements;
        const depart = [...DepartementList];
        const idDepart = depart.filter((item) => item.id_area === e);
        if (idDepart === undefined || idDepart.length === 0) {
          setDataDepartement([]);
        } else {
          const newArr = idDepart.map((dpt) => ({
            value: dpt.id,
            name: dpt.departement_name,
          }));
          setDataDepartement(newArr);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubDepartement = async (e) => {
    setValueDepartement(e);
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/subdepartement/${valueDepartement}`
      )
      .then((response) => {
        const SubDepartementList = response.data.data.subdepartement;
        const newArr = SubDepartementList.map((dpt) => ({
          value: dpt.id,
          name: dpt.subdepartement_name,
        }));
        setDataSubDepartement(newArr);
      })
      .catch((err) => {
        console.log(err.response);
      });
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
    arr.push(valueRole);
    arr.push(valueArea);
    arr.push(valueDepartement);
    setSearchValueFilter(arr);
    setTimeout(() => {
      setModalOpenFilter(false);
    }, 2000);
  };

  const handleResetFilter = () => {
    setSearchValueFilter(["reset"]);
    setValueRole("");
    setValueArea("");
  };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <form onSubmit={saveHandler}>
            <div className="row">
              <div className="col-12">
                <h3>New User</h3>
              </div>
              <div className="col-6">
                <label htmlFor="">Employee Status</label>
                <div className="wrapper-radio">
                  <input
                    type="radio"
                    name="select"
                    id="option-1"
                    value="permanent"
                    checked={selectedValueEmply === "permanent"}
                    onChange={handleChangeEmply}
                  />
                  <input
                    type="radio"
                    name="select"
                    id="option-2"
                    value="temporary"
                    checked={selectedValueEmply === "temporary"}
                    onChange={handleChangeEmply}
                  />
                  <label for="option-1" className="option option-1">
                    <div className="dot"></div>
                    <span>Permanent</span>
                  </label>
                  <label for="option-2" className="option option-2">
                    <div className="dot"></div>
                    <span>Temporary</span>
                  </label>
                </div>
              </div>
              <div className="col-6">
                <label htmlFor="roleName">Area</label>
                <SelectSearch
                  options={dataArea}
                  value={dataArea}
                  onChange={handleArea}
                  filterOptions={fuzzySearch}
                  search
                  placeholder="Search Area"
                />
              </div>
              <div className="col-6">
                <label htmlFor="roleName">Name</label>
                <input
                  type="text"
                  id="roleName"
                  value={valueUsername}
                  className="form-input"
                  onChange={(e) => {
                    setValueUsername(e.target.value);
                  }}
                />
              </div>
              <div className="col-6">
                <label htmlFor="roleName">Departement</label>
                <SelectSearch
                  options={dataDepartement}
                  value={dataDepartement}
                  onChange={handleSubDepartement}
                  filterOptions={fuzzySearch}
                  search
                  placeholder="Search Departement"
                />
              </div>
              <div className="col-6">
                <label htmlFor="roleName">Email</label>
                <input
                  type="email"
                  id="roleName"
                  value={valueEmail}
                  className="form-input"
                  onChange={(e) => setValueEmail(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label htmlFor="roleName">Sub Departement</label>
                <SelectSearch
                  options={dataSubDepartement}
                  value={valueSubDepartement}
                  onChange={setValueSubDepartement}
                  filterOptions={fuzzySearch}
                  search
                  placeholder="Search Sub Departement"
                />
              </div>
              <div className="col-6">
                <label htmlFor="roleName">No Hp</label>
                <input
                  type="text"
                  id="roleName"
                  value={valueNoHP}
                  className="form-input"
                  onChange={(e) => setValueNoHP(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label htmlFor="roleName">Role</label>
                <SelectSearch
                  options={dataRole}
                  value={dataRole}
                  onChange={(e) => {
                    setValueRole(e);
                  }}
                  filterOptions={fuzzySearch}
                  search
                  placeholder="Search Role"
                />
              </div>
            </div>
            <br />
            <div className="footer-modal">
              <button className={"btn-cancel"} onClick={modalClose}>
                Cancel
              </button>
              <button className={"btn-submit"} type="submit">
                Submit
              </button>
            </div>
          </form>
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
                <label htmlFor="roleName">Role</label>
                <SelectSearch
                  options={dataRole}
                  value={dataRole}
                  onChange={(e) => {
                    setValueRole(e);
                  }}
                  filterOptions={fuzzySearch}
                  search
                  placeholder="Search Role"
                />
              </div>
            </div>
            <div className="row margin-top-3">
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
            <div className="row margin-top-3">
              <div className="col-12">
                <label htmlFor="roleName">Departement</label>
                <SelectSearch
                  options={listDataDepartement}
                  value={listDataDepartement}
                  onChange={(e) => {
                    setValueDepartement(e);
                  }}
                  filterOptions={fuzzySearch}
                  search
                  placeholder="Search Departement"
                />
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
    <div>
      <div className={classes.toolbar} />

      <Grid container className={classes.headerMaster} spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom>
            Master User
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
                <button onClick={modalPopFilter} className="filter-btn">
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
            <TableUser
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
    </div>
  );
};

export default User;

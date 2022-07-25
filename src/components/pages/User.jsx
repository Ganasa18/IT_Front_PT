import React, { useState, useEffect } from "react";
import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../assets/select-search.css";
import { useDispatch, useSelector } from "react-redux";
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Backdrop,
  Fade,
  Modal,
  IconButton,
} from "@material-ui/core";

import "../../assets/master.css";
import AddIcon from "@material-ui/icons/Add";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import axios from "axios";
import { authEndPoint, pathEndPoint } from "../../assets/menu";

import Cookies from "universal-cookie";
import TableUser from "../table/TableUser";
import {
  getDataAreaUser,
  getDataDepartementUser,
  getDataRole,
  importDataUser,
  openModalExportAct,
} from "../redux/action";
import Gap from "../asset/Gap";
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
  buttonExport: {
    [theme.breakpoints.up("xl")]: {
      width: "100px",
      left: "20%",
      top: "20px",
    },

    [theme.breakpoints.down("lg")]: {
      width: "100px",
      left: "28%",
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

const User = () => {
  const classes = useStyles();
  // const [dataArea, setDataArea] = useState([]);

  const [dataDepartement, setDataDepartement] = useState([]);
  const [dataSubDepartement, setDataSubDepartement] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { userReducer } = useSelector((state) => state);
  const dataRole = userReducer.userRole;
  const modalOpenExport = userReducer.modalOpenExport;
  const listDataDepartement = userReducer.userDepartement;
  const dataArea = userReducer.userArea;
  const files = userReducer.userImport;
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
  const [sortActive, setSortActive] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [modalOpenSort, setModalOpenSort] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDataRole(token));
    dispatch(getDataAreaUser());
    dispatch(getDataDepartementUser(token));
  }, []);

  const modalPopSort = () => {
    setModalOpenSort(true);
  };

  const modalPop = () => {
    setModalOpen(true);
  };

  const modalPopFilter = () => {
    setModalOpenFilter(true);
  };

  const modalClose = () => {
    setModalOpen(false);
    setModalOpenFilter(false);
    setModalOpenSort(false);
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

  const handleResetFilter = () => {
    dispatch({ type: "SET_LOADING", value: true });
    SetSearchValue("");
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

  const handleFile = () => {
    const labelFile = document.getElementById("labelFile");
    labelFile.click();
  };

  const handleChangeFile = (e) => {
    if (e.target.files.length !== 0) {
      dispatch({ type: "SET_USER_FILE", value: e.target.files[0] });
    }
  };

  const bodyModalExport = (
    <>
      <Fade in={modalOpenExport}>
        <div className={classes.paper}>
          <div className="row">
            <div className="col-12">
              <h3>Import User</h3>
            </div>
          </div>
          <div className="content-wrapper-import" onClick={handleFile}>
            <div className={`field-container-import ${files ? "succes" : ""}`}>
              <Gap height={"20px"} />
              <div className="field-file-input">
                {files ? (
                  <label htmlFor="filesImp" id="labelFile">
                    file : {files.name}
                  </label>
                ) : (
                  <label htmlFor="filesImp" id="labelFile">
                    to open file
                  </label>
                )}
                <input
                  accept=".xlsx"
                  type="file"
                  className="file-req"
                  id="filesImp"
                  onChange={(e) => handleChangeFile(e)}
                />
              </div>
            </div>
          </div>
          <br />
          <div className="footer-modal">
            <button
              className={"btn-cancel"}
              onClick={() =>
                dispatch({
                  type: "SET_USER_MODAL_EXPORT",
                  value: false,
                })
              }>
              Cancel
            </button>
            <button
              className={"btn-submit"}
              onClick={() => dispatch(importDataUser(files, token))}>
              Import
            </button>
          </div>
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
              <div className="col-2">
                <Button
                  onClick={modalPop}
                  variant="contained"
                  color="primary"
                  className={classes.buttonAdd}
                  startIcon={<AddIcon />}>
                  Create New
                </Button>
              </div>
              <div className="col-2">
                <Button
                  onClick={() => dispatch(openModalExportAct(token))}
                  color="primary"
                  variant="contained"
                  className={classes.buttonExport}
                  startIcon={<ImportExportIcon />}>
                  Upload
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
              sortValue={sortValue}
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
        open={modalOpenExport}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModalExport}
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

export default User;

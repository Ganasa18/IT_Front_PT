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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
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
}));

const User = () => {
  const classes = useStyles();
  const [dataRole, setDataRole] = useState([]);
  const [dataArea, setDataArea] = useState([]);
  const [dataDepartement, setDataDepartement] = useState([]);
  const [dataSubDepartement, setDataSubDepartement] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [valueArea, setValueArea] = useState("");
  const [valueDepartement, setValueDepartement] = useState("");
  const [valueSubDepartement, setValueSubDepartement] = useState("");
  const [valueRole, setValueRole] = useState("");
  const [valueUsername, setValueUsername] = useState("");
  const [valueEmail, setValueEmail] = useState("");
  const [valueNoHP, setValueNoHP] = useState("");
  const [selectedValueEmply, setSelectedValueEmply] = useState("permanent");

  useEffect(() => {
    getRoleList();
    getAreaList();
  }, []);

  const modalPop = () => {
    setModalOpen(true);
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

  // const getJoinUser = async () => {
  //   const newDataRole = dataRole;
  //   const newDataArea = dataArea;
  //   const newDataUser = dataUser;
  //   const newDataDepartement = joinDepartement;
  //   const newDataSubDepartement = joinSubDepartement;

  //   const arr_user = [...newDataUser];
  //   const arr_area = [...newDataArea];
  //   const arr_departement = [...newDataDepartement];
  //   const arr_subdepartement = [...newDataSubDepartement];
  //   const arr_role = [...newDataRole];

  //   var areamap = {};
  //   arr_area.forEach(function (area_id) {
  //     areamap[area_id.value] = area_id;
  //   });

  //   // now do the "join":
  //   arr_user.forEach(function (user) {
  //     user.area_id = areamap[user.area];
  //   });
  //   const JoinArea = arr_user;

  //   var rolemap = {};
  //   arr_role.forEach(function (role_id) {
  //     rolemap[role_id.value] = role_id;
  //   });

  //   JoinArea.forEach(function (user) {
  //     user.role_id = rolemap[user.role];
  //   });
  //   const JoinRole = JoinArea;

  //   var departementmap = {};
  //   arr_departement.forEach(function (departement_id) {
  //     departementmap[departement_id.value] = departement_id;
  //   });

  //   JoinRole.forEach(function (user) {
  //     user.departement_id = departementmap[user.departement];
  //   });

  //   const JoinDepartement = JoinRole;

  //   var subdepartementmap = {};
  //   arr_subdepartement.forEach(function (subdepartement_id) {
  //     subdepartementmap[subdepartement_id.value] = subdepartement_id;
  //   });

  //   JoinDepartement.forEach(function (user) {
  //     user.subdepartement_id = subdepartementmap[user.subdepartement];
  //   });

  //   setResultJoinUser(JoinDepartement);

  //   // [{id:3124, name:"Mr. Smith", text:"wow", createdBy:"Mr. Jones"},
  //   // {id:710, name:"Mrs. Jones", text:"amazing"}]*

  //   // var results_selected = array1.joinWith(array2, 'id', ['id', 'text', 'name']);

  //   // // [{id:3124, name:"Mr. Smith", text:"wow"},
  //   // // {id:710, name:"Mrs. Jones", text:"amazing"}]*

  //   // /* or equivalently, */
  //   // var results_omitted = array1.joinWith(array2, 'id', ['createdBy'], 1);

  //   // [{id:3124, name:"Mr. Smith", text:"wow"},
  //   // {id:710, name:"Mrs. Jones", text:"amazing"}]*

  //   // console.log(arr_user, arr_area, arr_role);
  // };

  const modalClose = () => {
    setModalOpen(false);
  };

  const handleChangeEmply = (event) => {
    setSelectedValueEmply(event.target.value);
  };

  const saveHandler = async (event) => {
    event.preventDefault();

    // console.log(selectedValueEmply);
    // console.log(valueUsername);
    // console.log(valueEmail);
    // console.log(valueNoHP);
    // console.log(valueArea);
    // console.log(valueDepartement);
    // console.log(valueSubDepartement);
    // console.log(valueRole);

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
          role: valueRole,
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
                <label htmlFor="roleName">Name User</label>
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
                  type="email"
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
                  onChange={setValueRole}
                  filterOptions={fuzzySearch}
                  search
                  placeholder="Search Role"
                />
              </div>
            </div>
            <br />
            <div className="footer-modal">
              <button onClick={modalClose}>Close</button>
              <button type="submit">Submit</button>
            </div>
          </form>
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
                    className="input-field"
                    type="text"
                    placeholder="Search..."
                  />
                </div>
              </div>
              <div className="col-4"></div>
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
            <TableUser />
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
    </div>
  );
};

export default User;

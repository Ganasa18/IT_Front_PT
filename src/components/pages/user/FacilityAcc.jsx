import React, { useEffect, useState, useRef } from "react";
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
import {
  authEndPoint,
  pathEndPoint,
  invEndPoint,
  logsEndPoint,
} from "../../../assets/menu";
import TableFacilityAcc from "../../table/user/TableFacilityAcc";
import FacilityCreate from "./FacilityCreate";
import Cookies from "universal-cookie";
import axios from "axios";
const cookies = new Cookies();
const token = cookies.get("token");
const userID = cookies.get("id");

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
    transform: "translate(-50%,-40%)",
    top: "40%",
    left: "50%",
    width: 1000,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
    [theme.breakpoints.down("lg")]: {
      zoom: "95%",
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
    transform: "translate(35%, -40%)",
  },
}));

const FacilityAcc = () => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [allDataUser, setAllDataUser] = useState([]);
  const [userData, setUserData] = useState([]);
  const [leadEmail, setLeadEmail] = useState(null);

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = async () => {
    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    let area = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/area`;

    let role = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/role`;

    let departement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/departement`;

    let subdepartement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/subdepartement`;

    const requestOne = await axios.get(user, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const requestTwo = await axios.get(area);
    const requestThree = await axios.get(role, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const requestFour = await axios.get(departement);

    const requestFive = await axios.get(subdepartement);

    axios
      .all([requestOne, requestTwo, requestThree, requestFour, requestFive])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const responesThree = responses[2];
          const responesFour = responses[3];
          const responesFive = responses[4];

          let newDataUser = responseOne.data.data.users;
          let newDataArea = responseTwo.data.data.areas;
          let newDataRole = responesThree.data.data.roles;
          let newDataDepartement = responesFour.data.data.departements;
          let newDataSubDepartement = responesFive.data.data.subdepartements;

          const AllData = newDataUser.map((item) => ({
            id: item.id,
            name: item.username,
            role: item.role,
            departement: item.departement,
            subdepartement: item.subdepartement,
            area: item.area,
            email: item.email,
          }));
          setAllDataUser(AllData);

          var getID = newDataUser.filter(
            (item) => item.id === parseInt(userID)
          );
          getID = getID.map((item) => ({
            id: item.id,
            name: item.username,
            role: item.role,
            departement: item.departement,
            subdepartement: item.subdepartement,
            area: item.area,
            email: item.email,
            employe: item.employe_status,
          }));

          var areamap = {};
          newDataArea.forEach(function (area_id) {
            areamap[area_id.id] = area_id;
          });

          getID.forEach(function (user) {
            user.area_id = areamap[user.area];
          });
          var rolemap = {};
          newDataRole.forEach(function (role_id) {
            rolemap[role_id.id] = role_id;
          });

          getID.forEach(function (user) {
            user.role_id = rolemap[user.role];
          });

          var departementmap = {};
          newDataDepartement.forEach(function (depart_id) {
            departementmap[depart_id.id] = depart_id;
          });

          getID.forEach(function (user) {
            user.depart_id = departementmap[user.departement];
          });

          var subdepartementmap = {};
          newDataSubDepartement.forEach(function (subdepart_id) {
            subdepartementmap[subdepart_id.id] = subdepart_id;
          });

          getID.forEach(function (user) {
            user.subdepart_id = subdepartementmap[user.subdepartement];
          });

          console.log(getID);
          setUserData(getID);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  // const getUserList = async () => {
  //   let user = `${authEndPoint[0].url}${
  //     authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
  //   }/api/v1/auth/`;

  //   await axios
  //     .get(user, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //     .then((response) => {
  //       const DataUser = response.data.data.users;
  //       const AllData = DataUser.map((item) => ({
  //         id: item.id,
  //         name: item.username,
  //         role: item.role,
  //         departement: item.departement,
  //         subdepartement: item.subdepartement,
  //         area: item.area,
  //         email: item.email,
  //       }));

  //       setAllDataUser(AllData);

  //       var getID = DataUser.filter((item) => item.id === parseInt(userID));
  //       getID = getID.map((item) => ({
  //         id: item.id,
  //         name: item.username,
  //         role: item.role,
  //         departement: item.departement,
  //         subdepartement: item.subdepartement,
  //         area: item.area,
  //         email: item.email,
  //       }));

  //       setUserData(getID);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       alert("something wrong");
  //     });
  // };

  const modalPop = () => {
    setModalOpen((prevSelected) => !prevSelected);

    const getData = allDataUser.filter(
      (item) =>
        (item.departement === userData[0].departement && item.role === 3) ||
        (item.departement === userData[0].departement && item.role === 6)
    );

    const getDataAdmin = allDataUser.filter((item) => item.role === 1);

    if (getData.length > 0) {
      setLeadEmail(getData[0].email);
      if (userData[0].role === 3) {
        var arr = [];
        getDataAdmin.forEach((x) => arr.push(x.email));
        setLeadEmail(arr);
      }
    } else {
      setLeadEmail("it@markindo.co.id");
    }
  };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <FacilityCreate userData={userData} leadEmail={leadEmail} />
          <Button
            className={classes.cancelBtn}
            onClick={modalPop}
            variant="outlined">
            Cancel
          </Button>
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
            Facility Access
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
              <div className="col-4">
                <button className="filter-btn">Filter</button>
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
            <TableFacilityAcc />
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
    </>
  );
};

export default FacilityAcc;

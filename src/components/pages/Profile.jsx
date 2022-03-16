import React, { useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import {
  makeStyles,
  Grid,
  Avatar,
  Button,
  Backdrop,
  Fade,
  Modal,
} from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";
import { authEndPoint, pathEndPoint } from "../../assets/menu";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("token");
const userId = cookies.get("id");

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  cardPadding: {
    marginTop: theme.spacing(5),
  },
  buttonChangedPassword: {
    [theme.breakpoints.up("xl")]: {
      width: "180px",
      left: "60%",
      top: "60px",
      transform: "translate(180%, -0%)",
    },

    [theme.breakpoints.down("lg")]: {
      width: "180px",
      left: "50%",
      top: "60px",
      transform: "translate(180%, -0%)",
    },
    [theme.breakpoints.down("sm")]: {
      bottom: "20px",
      width: "120px",
    },
    fontSize: 10,
  },

  large: {
    fontSize: "50px",
    width: theme.spacing(27),
    height: theme.spacing(27),
    position: "absolute",
    bottom: "50%",
    transform: "translate(60%, -60%);",

    [theme.breakpoints.up("xl")]: {
      width: theme.spacing(35),
      height: theme.spacing(35),
      bottom: "50%",
      transform: "translate(80%, -50%);",
    },

    [theme.breakpoints.down("lg")]: {
      width: theme.spacing(27),
      height: theme.spacing(27),
      transform: "translate(25%, 50%);",
    },
  },
  paper: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "30%",
    left: "50%",
    width: 650,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
}));

function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const classes = useStyles();

  const modalPop = () => {
    setModalOpen(true);
  };

  const modalClose = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    getDataUser();
  }, []);

  const getDataUser = async () => {
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

          const userProp = newDataUser;

          const userNow = userProp.find((item) => item.id === parseInt(userId));

          const userArea = newDataArea.find((item) => item.id === userNow.area);

          const userDepartement = newDataDepartement.find(
            (item) => item.id === userNow.departement
          );

          const userSubDepartement = newDataSubDepartement.find(
            (item) => item.id === userNow.subdepartement
          );

          const userRole = newDataRole.find((item) => item.id === userNow.role);

          const userData = [
            {
              username: userNow.username,
              email: userNow.email,
              no_handphone: userNow.no_handphone,
              employe_status: userNow.employe_status,
              area: userArea.area_name,
              role: userRole.role_name,
              departement: userDepartement.departement_name,
              subdepartement:
                userSubDepartement !== undefined
                  ? userSubDepartement.subdepartement_name
                  : null,
            },
          ];

          setUserData(userData);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(oldPassword);
    console.log(userId);

    if (newPassword.length < 4) {
      alert("Please Fill Password Min 4 Character");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      alert("Password Confirm not match");
      return;
    }
    document.getElementById("overlay").style.display = "block";

    let changePass = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/change-password`;

    await axios
      .patch(
        changePass,
        {
          id: userId,
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        document.getElementById("overlay").style.display = "none";
        setModalOpen(false);
        setOldPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
        setError("");
        alert(response.data.status);
      })
      .catch((error) => {
        if (error.response.status === 429) {
          return setError(error.response.data);
        }
        setError(
          error.response.data.message === undefined
            ? error.response
            : error.response.data.message
        );
        document.getElementById("overlay").style.display = "none";
      });
  };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12">
                <h3>Change Password</h3>
              </div>
              <div className="col-12">
                <label htmlFor="">Old Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  id="oldPassword"
                  className="form-input"
                  onChange={function (e) {
                    setOldPassword(e.target.value);
                  }}
                />
              </div>
              <div className="col-12">
                <label htmlFor="">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  id="newPassword"
                  className="form-input"
                  onChange={function (e) {
                    setNewPassword(e.target.value);
                  }}
                />
              </div>
              <div className="col-12">
                <label htmlFor="">Repeat Password</label>
                <input
                  type="password"
                  value={newPasswordConfirm}
                  id="newPassword2"
                  className="form-input"
                  onChange={function (e) {
                    setNewPasswordConfirm(e.target.value);
                  }}
                />
              </div>
            </div>
            {error && <div className="error-msg">{error}</div>}
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
      <div id="overlay">
        <Loader
          className="loading-data"
          type="Rings"
          color="#CECECE"
          height={550}
          width={80}
        />
      </div>
    </>
  );

  return (
    <>
      <div className={classes.toolbar} />
      <h2>My Profile</h2>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <Button
            onClick={modalPop}
            variant="contained"
            color="primary"
            className={classes.buttonChangedPassword}
            startIcon={<SettingsIcon />}>
            Change Password
          </Button>
        </Grid>
        <div className="card-profile">
          <div className="row">
            <div className="col-3">
              {userData === null ? (
                console.log("tidak ada")
              ) : (
                <Avatar className={classes.large}>
                  {userData[0].username.substring(0, 1)}
                </Avatar>
              )}
            </div>
            <div class="vertical-line" />
            <div className="col-9">
              <br />
              <div className="row">
                <h4 style={{ marginLeft: "15px" }}>Information</h4>
              </div>

              {userData === null ? (
                console.log("tidak ada")
              ) : (
                <>
                  <div className="row">
                    {userData.map((item) => (
                      <>
                        <div className="col-2">
                          <p className="label-asset">Name</p>
                          <p>{item.username}</p>
                        </div>
                        <div className="col-3">
                          <p className="label-asset">Email</p>
                          <p>{item.email}</p>
                        </div>
                        <div className="col-2">
                          <p className="label-asset">No Hp</p>
                          <p>{item.no_handphone}</p>
                        </div>
                        <div className="col-2">
                          <p className="label-asset">Role</p>
                          <p>{item.role}</p>
                        </div>
                        <div className="col-2">
                          <p className="label-asset">Status</p>
                          <p>{item.employe_status}</p>
                        </div>
                      </>
                    ))}
                  </div>
                  <div className="row">
                    <h4 style={{ marginLeft: "15px" }}>Work Information</h4>
                  </div>

                  <div className="row">
                    {userData.map((item) => (
                      <>
                        <div className="col-2">
                          <p className="label-asset">Area</p>
                          <p>{item.area}</p>
                        </div>
                        <div className="col-3">
                          <p className="label-asset">Departement</p>
                          <p>{item.departement}</p>
                        </div>
                        <div className="col-3">
                          <p className="label-asset">Sub Departement</p>
                          <p>{`${
                            item.subdepartement ? item.subdepartement : null
                          } `}</p>
                        </div>
                      </>
                    ))}
                  </div>
                </>
              )}

              {/* <div className="row">
                {userData.map((item) => (
                  <>
                    <div className="col-2">
                      <p className="label-asset">Name</p>
                      <p>{item.username}</p>
                    </div>
                    <div className="col-3">
                      <p className="label-asset">Email</p>
                      <p>{item.email}</p>
                    </div>
                    <div className="col-2">
                      <p className="label-asset">No Hp</p>
                      <p>{item.no_handphone}</p>
                    </div>
                    <div className="col-2">
                      <p className="label-asset">Role</p>
                      <p>{item.role}</p>
                    </div>
                    <div className="col-2">
                      <p className="label-asset">Status</p>
                      <p>{item.employe_status}</p>
                    </div>
                  </>
                ))}
              </div>

              <div className="row">
                {userData.map((item) => (
                  <>
                    <div className="col-2">
                      <p className="label-asset">Area</p>
                      <p>{item.area}</p>
                    </div>
                    <div className="col-3">
                      <p className="label-asset">Departement</p>
                      <p>{item.departement}</p>
                    </div>
                    <div className="col-3">
                      <p className="label-asset">Sub Departement</p>
                      <p>{item.subdepartement}</p>
                    </div>
                  </>
                ))}
              </div> */}
            </div>
          </div>
        </div>
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

export default Profile;

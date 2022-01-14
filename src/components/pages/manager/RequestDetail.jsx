import React, { useState, useEffect } from "react";
import { invEndPoint, authEndPoint, pathEndPoint } from "../../../assets/menu";
import Loading from "../../asset/Loading";
import { makeStyles, Grid, Breadcrumbs, Typography } from "@material-ui/core";

import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import "../../../assets/master.css";
import "../../../assets/asset_user.css";
import "../../asset/chips.css";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const userID = cookies.get("id");
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

  cardPadding: {
    marginTop: theme.spacing(5),
  },
  paper: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "35%",
    left: "50%",
    width: 650,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 10, 3),
  },
}));

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

const RequestDetail = () => {
  const classes = useStyles();
  const req_no = localStorage.getItem("req_no");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [infoRequest, setInfoRequest] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    getInfoRequest();
    setTimeout(() => {
      getInfoUser();
    }, 1000);
  }, []);

  const getInfoRequest = async () => {
    let act_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/`;

    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory`;

    const requestOne = await axios.get(act_req);
    const requestTwo = await axios.get(inventory);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];

          let newDataRequest = responseOne.data.data.request_tiket;
          let newDataInventory = responseTwo.data.data.inventorys;

          let arr_request = [...newDataRequest];
          const arr_inventory = [...newDataInventory];

          arr_request = arr_request.filter(
            (item) => item.action_req_code === req_no
          );

          var inventmap = {};

          arr_inventory.forEach(function (invent_id) {
            inventmap[invent_id.id] = invent_id;
          });

          arr_request.forEach(function (request_id) {
            request_id.invent_id = inventmap[request_id.asset_id];
          });

          console.log(arr_request);
          localStorage.setItem("userId", arr_request[0].user_id);
          setInfoRequest(arr_request);
          setIsLoading(false);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  const getInfoUser = async () => {
    const userId = localStorage.getItem("userId");

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
          const responseThree = responses[2];
          const responseFour = responses[3];
          const responseFive = responses[4];
          let newDataUser = responseOne.data.data.users;
          let newDataArea = responseTwo.data.data.areas;
          let newDataRole = responseThree.data.data.roles;
          let newDataDepartement = responseFour.data.data.departements;
          let newDataSubDepartement = responseFive.data.data.subdepartements;

          newDataUser = newDataUser.map((item) => ({
            id: item.id,
            name: item.username,
            role: item.role,
            departement: item.departement,
            subdepartement: item.subdepartement,
            area: item.area,
            email: item.email,
            employe: item.employe_status,
          }));

          newDataUser = newDataUser.filter(
            (item) => item.id === parseInt(userId)
          );

          let arr_user = [...newDataUser];
          let arr_area = [...newDataArea];
          let arr_role = [...newDataRole];
          let arr_departement = [...newDataDepartement];
          let arr_subdepartement = [...newDataSubDepartement];

          var usermap = {};

          arr_area.forEach(function (id_area_user) {
            usermap[id_area_user.id] = id_area_user;
          });

          arr_user.forEach(function (request_id) {
            request_id.id_area_user = usermap[request_id.area];
          });

          arr_role.forEach(function (id_role_user) {
            usermap[id_role_user.id] = id_role_user;
          });

          arr_user.forEach(function (request_id) {
            request_id.id_role_user = usermap[request_id.role];
          });

          arr_departement.forEach(function (id_departement_user) {
            usermap[id_departement_user.id] = id_departement_user;
          });

          arr_user.forEach(function (request_id) {
            request_id.id_departement_user = usermap[request_id.departement];
          });

          arr_subdepartement.forEach(function (id_sub_departement_user) {
            usermap[id_sub_departement_user.id] = id_sub_departement_user;
          });

          arr_user.forEach(function (request_id) {
            request_id.id_sub_departement_user =
              usermap[request_id.subdepartement];
          });

          setUserInfo(arr_user);
          setIsLoadingUser(false);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className={classes.toolbar} />
      <br />
      <Breadcrumbs
        onClick={function () {
          const origin = window.location.origin;
          window.location.href = `${origin}/procurement-approval`;
        }}
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        <span className={"span_crumb"}>Action Request</span>
        <Typography color="textPrimary">{req_no}</Typography>
      </Breadcrumbs>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <div className="flex-card">
              <h3>Information</h3>
            </div>
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Request Number</p>
                <p>{infoRequest[0].action_req_code}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Asset Number</p>
                <p>{infoRequest[0].invent_id.asset_number}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Description Of Problem</p>
                <p className="wrap-paraf">
                  {infoRequest[0].action_req_description}
                </p>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Request Date</p>
                {calbill(infoRequest[0].createdAt)}
                <p></p>
              </div>
              <div className="col-3">
                <p className="label-asset">Asset Name</p>
                <p>{infoRequest[0].invent_id.asset_name}</p>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
      {isLoadingUser ? (
        <Loading />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} className={classes.cardPadding}>
            <div className="card-asset-action">
              <div className="flex-card">
                <h3>Profile</h3>
              </div>
              <div className="row">
                <div className="col-3">
                  <p className="label-asset">Request By</p>
                  <p>{capitalizeFirstLetter(userInfo[0].name)}</p>
                </div>
                <div className="col-3">
                  <p className="label-asset">Departement</p>
                  <p>
                    {capitalizeFirstLetter(
                      userInfo[0].id_departement_user.departement_name
                    )}
                  </p>
                </div>
                <div className="col-3">
                  <p className="label-asset">Role</p>
                  <p>
                    {capitalizeFirstLetter(userInfo[0].id_role_user.role_name)}
                  </p>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-3">
                  <p className="label-asset">Area</p>
                  <p>
                    {`${capitalizeFirstLetter(
                      userInfo[0].id_area_user.area_name
                    )}-${userInfo[0].id_area_user.alias_name}`}
                  </p>
                </div>
                <div className="col-3">
                  <p className="label-asset">Sub Department </p>
                  <p>
                    {capitalizeFirstLetter(
                      userInfo[0].id_sub_departement_user.subdepartement_name
                    )}
                  </p>
                </div>
                <div className="col-3">
                  <p className="label-asset">Status Employee </p>
                  <p>{capitalizeFirstLetter(userInfo[0].employe)}</p>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default RequestDetail;

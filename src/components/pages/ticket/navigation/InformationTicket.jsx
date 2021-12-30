import React, { useState, useEffect } from "react";

import { makeStyles, Grid } from "@material-ui/core";
import axios from "axios";

import "../../../../assets/master.css";
import "../../../../assets/asset_user.css";
import "../../../asset/chips.css";
import { LoadingRequest } from "../../../asset/Loading";
import {
  authEndPoint,
  pathEndPoint,
  invEndPoint,
} from "../../../../assets/menu";
import Cookies from "universal-cookie";

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

  cardPadding: {
    marginTop: theme.spacing(5),
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

const InformationTicket = () => {
  const classes = useStyles();
  const req_no = localStorage.getItem("req_no");
  const [ticketData, setTicketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getRequest();
  }, []);

  const getRequest = async () => {
    let act_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/`;

    let status = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/status`;

    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory`;

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
    const requestTwo = await axios.get(act_req);
    const requestThree = await axios.get(status);
    const requestFour = await axios.get(inventory);
    const requestFive = await axios.get(area);
    const requestSix = await axios.get(role, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const requestSevent = await axios.get(departement);
    const requestEight = await axios.get(subdepartement);

    axios
      .all([
        requestOne,
        requestTwo,
        requestThree,
        requestFour,
        requestFive,
        requestSix,
        requestSevent,
        requestEight,
      ])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const responseThree = responses[2];
          const responseFour = responses[3];
          const requestFive = responses[4];
          const requestSix = responses[5];
          const requestSevent = responses[6];
          const requestEight = responses[7];

          let newDataUser = responseOne.data.data.users;
          let newDataRequest = responseTwo.data.data.request_tiket;
          let newStatus = responseThree.data.data.statuss;
          let newInvent = responseFour.data.data.inventorys;
          let newDataArea = requestFive.data.data.areas;
          let newDataRole = requestSix.data.data.roles;
          let newDataDepartement = requestSevent.data.data.departements;
          let newDataSubDepartement = requestEight.data.data.subdepartements;

          const getUser = newDataUser.map((item) => ({
            id: item.id,
            name: item.username,
            role: item.role,
            departement: item.departement,
            subdepartement: item.subdepartement,
            area: item.area,
            email: item.email,
            employe: item.employe_status,
          }));
          var arr_request = [...newDataRequest];
          const arr_status = [...newStatus];
          const arr_inventory = [...newInvent];
          const arr_area = [...newDataArea];
          const arr_role = [...newDataRole];
          const arr_departement = [...newDataDepartement];
          const arr_subdepartement = [...newDataSubDepartement];

          arr_request = arr_request.filter(
            (item) => item.action_req_code === req_no
          );

          var statusmap = {};

          arr_status.forEach(function (status_id) {
            statusmap[status_id.id] = status_id;
          });

          arr_request.forEach(function (request_id) {
            request_id.status_id = statusmap[request_id.status_id];
          });

          let JoinStatus = arr_request;

          var inventmap = {};

          arr_inventory.forEach(function (invent_id) {
            inventmap[invent_id.id] = invent_id;
          });

          JoinStatus.forEach(function (request_id) {
            request_id.invent_id = inventmap[request_id.asset_id];
          });

          let JoinInvent = JoinStatus;

          // Filter User

          var usermap = {};
          getUser.forEach(function (id_user) {
            usermap[id_user.id] = id_user;
          });

          JoinInvent.forEach(function (request_id) {
            request_id.id_user = usermap[request_id.user_id];
          });

          arr_area.forEach(function (id_area_user) {
            usermap[id_area_user.id] = id_area_user;
          });

          JoinInvent.forEach(function (request_id) {
            request_id.id_area_user = usermap[request_id.id_user.area];
          });

          arr_role.forEach(function (id_role_user) {
            usermap[id_role_user.id] = id_role_user;
          });

          JoinInvent.forEach(function (request_id) {
            request_id.id_role_user = usermap[request_id.id_user.role];
          });

          arr_departement.forEach(function (id_departement_user) {
            usermap[id_departement_user.id] = id_departement_user;
          });

          JoinInvent.forEach(function (request_id) {
            request_id.id_departement_user =
              usermap[request_id.id_user.departement];
          });

          arr_subdepartement.forEach(function (id_sub_departement_user) {
            usermap[id_sub_departement_user.id] = id_sub_departement_user;
          });

          JoinInvent.forEach(function (request_id) {
            request_id.id_sub_departement_user =
              usermap[request_id.id_user.subdepartement];
          });

          // Get Lead

          let JoinUser = JoinInvent;

          var leadmap = {};
          getUser.forEach(function (id_lead) {
            leadmap[id_lead.id] = id_lead;
          });

          JoinUser.forEach(function (request_id) {
            request_id.id_lead = leadmap[request_id.leader_id];
          });

          // Result

          setTicketData(JoinUser);
          console.log(JoinUser);
          setIsLoading();
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  if (isLoading) {
    return (
      <>
        <LoadingRequest />
      </>
    );
  }

  return (
    <>
      <Grid item xs={12} className={classes.cardPadding}>
        <div className="card-asset-action">
          <h3>Information</h3>
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Request Number</p>
              <p>{ticketData[0].action_req_code}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Asset Number</p>
              <p>{ticketData[0].invent_id.asset_number}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Asset Name</p>
              <p>{ticketData[0].invent_id.asset_name}</p>
            </div>
            <div className="col-3">
              <p className="label-asset text-center">Status</p>
              <p className="text-center">
                <span
                  class="chip-action"
                  style={{
                    background: `${ticketData[0].status_id.color_status}4C`,
                    color: `${ticketData[0].status_id.color_status}FF`,
                  }}>
                  {capitalizeFirstLetter(ticketData[0].status_id.status_name)}
                </span>
              </p>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Date</p>
              <p>{`${calbill(ticketData[0].createdAt)}`}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Description Of Problem</p>
              <p className="wrap-paraf">
                {ticketData[0].action_req_description}
              </p>
            </div>

            {ticketData[0].id_lead !== undefined ? (
              <>
                <div className="col-2">
                  <p className="label-asset">Approved By</p>
                  <p>{capitalizeFirstLetter(ticketData[0].id_lead.name)}</p>
                </div>

                <div className="col-3">
                  <p className="label-asset">Comment</p>
                  <p className="wrap-paraf">{ticketData[0].leader_comment}</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </Grid>
      <Grid item xs={12} className={classes.cardPadding}>
        <div className="card-asset-action">
          <h3>Profile</h3>
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Request By</p>
              <p>{capitalizeFirstLetter(ticketData[0].id_user.name)}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Departement</p>
              <p>
                {capitalizeFirstLetter(
                  ticketData[0].id_departement_user.departement_name
                )}
              </p>
            </div>
            <div className="col-3">
              <p className="label-asset">Role</p>
              <p>
                {capitalizeFirstLetter(ticketData[0].id_role_user.role_name)}
              </p>
            </div>
            <div className="col-3"></div>
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Area</p>
              <p>
                {capitalizeFirstLetter(ticketData[0].id_area_user.area_name)}-
                {ticketData[0].id_area_user.alias_name}
              </p>
            </div>
            <div className="col-3">
              <p className="label-asset">Sub Departement</p>
              <p>
                {capitalizeFirstLetter(
                  ticketData[0].id_sub_departement_user.subdepartement_name
                )}
              </p>
            </div>
            <div className="col-3">
              <p className="label-asset">Status User</p>
              <p>{capitalizeFirstLetter(ticketData[0].id_user.employe)}</p>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
      </Grid>
    </>
  );
};

export default InformationTicket;

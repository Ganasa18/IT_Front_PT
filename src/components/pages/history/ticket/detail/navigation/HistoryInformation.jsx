import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
import { makeStyles, Grid } from "@material-ui/core";
import axios from "axios";
import "../../../../../../assets/master.css";
import "../../../../../../assets/asset_user.css";
import "../../../../../asset/chips.css";

import {
  logsEndPoint,
  pathEndPoint,
  invEndPoint,
  authEndPoint,
} from "../../../../../../assets/menu";
import Loading from "../../../../../asset/Loading";
import Cookies from "universal-cookie";

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

function fadeIn(el, time) {
  el.style.opacity = 0;

  var last = +new Date();
  var tick = function () {
    el.style.opacity = +el.style.opacity + (new Date() - last) / time;
    el.style.display = "block";
    last = +new Date();

    if (+el.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) ||
        setTimeout(tick, 16);
    }
  };

  tick();
}

const HistoryInformation = (props) => {
  const classes = useStyles();
  const req_no = localStorage.getItem("req_no");
  const [ticketData, setTicketData] = useState([]);
  const [arData, setArData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [leadUser, setLeadUser] = useState([]);

  const { dateNow } = props;

  useEffect(() => {
    getDataHistory();
  }, [dateNow]);

  const getDataHistory = async () => {
    document.getElementById("overlay").style.display = "block";
    const logs = `${logsEndPoint[0].url}${
      logsEndPoint[0].port !== "" ? ":" + logsEndPoint[0].port : ""
    }/api/v1/logs-login/history-ar`;

    let act_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/`;

    const status = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/status`;

    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    const requestOne = await axios.get(logs);
    const requestTwo = await axios.get(act_req);
    const requestThree = await axios.get(status);
    const requestFour = await axios.get(user, {
      headers: { Authorization: `Bearer ${token}` },
    });

    axios
      .all([requestOne, requestTwo, requestThree, requestFour])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const responseThree = responses[2];
          const responseFour = responses[3];
          let newDataLog = responseOne.data.data.log_ar;
          let newDataRequest = responseTwo.data.data.request_tiket;
          let newDataStatus = responseThree.data.data.statuss;
          let newDataUser = responseFour.data.data.users;

          newDataLog = newDataLog.filter(
            (item) => item.request_number === req_no
          );

          newDataRequest = newDataRequest.filter(
            (item) => item.action_req_code === req_no
          );
          setArData(newDataRequest);
          newDataLog = newDataLog.filter((item) => item.createdAt === dateNow);

          var joinmap = {};
          newDataStatus.forEach(function (status_id) {
            joinmap[status_id.id] = status_id;
          });

          newDataLog.forEach(function (request_id) {
            request_id.status_id = joinmap[request_id.status_ar];
          });

          newDataRequest.forEach(function (req_id) {
            joinmap[req_id.id] = req_id;
          });

          let getUser = newDataUser.map((item) => ({
            id: item.id,
            name: item.username,
            role: item.role,
            departement: item.departement,
            subdepartement: item.subdepartement,
            area: item.area,
            email: item.email,
            employe: item.employe_status,
          }));

          if (newDataRequest[0].leader_id !== null) {
            getUser = getUser.filter(
              (row) => row.id === newDataRequest[0].leader_id
            );
            setLeadUser(getUser);
          }
          setTicketData(newDataLog);
          setIsLoading(false);
          document.getElementById("overlay").style.display = "none";
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });

    // console.log(dateNow);
  };

  const viewImg = () => {
    const pop = document.querySelector(".popimg");
    fadeIn(pop, 1000);

    const popImg = document.querySelector(".pop_upcontent img");
    setTimeout(() => {
      popImg.style.display = "block";
    }, 1500);
    popImg.setAttribute(
      "src",
      `${invEndPoint[0].url}${
        invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
      }/${arData[0].picture_req}`
    );

    const closePop = document.querySelector(".closepop");
    closePop.style.display = "block";
  };

  const closeImg = () => {
    const pop = document.querySelector(".popimg");
    pop.style.display = "none";
    const popImg = document.querySelector(".pop_upcontent img");
    popImg.style.display = "none";
    const closePop = document.querySelector(".closepop");
    closePop.style.display = "none";
  };

  if (isLoading) {
    return (
      <div id="overlay">
        <Loader
          className="loading-data"
          type="Rings"
          color="#CECECE"
          height={550}
          width={80}
        />
      </div>
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
              <p>{arData[0].action_req_code}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Asset Number</p>
              <p>{ticketData[0].asset_number}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Asset Name</p>
              <p>{ticketData[0].asset_name}</p>
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
              <p className="label-asset">Date Create</p>
              <p>{calbill(arData[0].createdAt)}</p>
            </div>

            <div className="col-3">
              <p className="label-asset">Description Of Problem</p>
              <p className="wrap-paraf">{arData[0].action_req_description}</p>
            </div>

            {leadUser.length === 0 ? null : (
              <>
                <div className="col-2">
                  <p className="label-asset">Approved By</p>
                  <p>{capitalizeFirstLetter(leadUser[0].name)}</p>
                </div>

                <div className="col-3">
                  <p className="label-asset">Comment</p>
                  <p className="wrap-paraf">{arData[0].leader_comment}</p>
                </div>
              </>
            )}
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Attachment</p>
              <p>
                {arData[0].picture_req !== null ? (
                  <>
                    <button className="attachment-view" onClick={viewImg}>
                      view
                    </button>
                    <div class="popimg"></div>
                    <div class="pop_upcontent">
                      <img id="idimgcontent" alt="img" />
                      <span class="closepop" onClick={closeImg}>
                        Close
                      </span>
                    </div>
                  </>
                ) : (
                  <button className="attachment-view-disabled">view</button>
                )}
              </p>
            </div>
            <div className="col-3">
              <p className="label-asset">Troubleshoot</p>
              <p>
                {ticketData[0].trouble_title === ""
                  ? "-"
                  : ticketData[0].trouble_title}
              </p>
              <p className="wrap-paraf">
                {!ticketData[0].trouble_detail
                  ? "-"
                  : ticketData[0].trouble_detail}
              </p>
            </div>
            <div className="col-2">
              <p className="label-asset">Close Remark</p>
              <p className="wrap-paraf">
                {!ticketData[0].close_remark ? "-" : ticketData[0].close_remark}
              </p>
            </div>

            {leadUser.length === 0 ? null : (
              <div className="col-2">
                <p className="label-asset">Date Aproved</p>
                <p>{calbill(ticketData[0].ticketCreated)}</p>
              </div>
            )}
          </div>
        </div>
      </Grid>
      <Grid item xs={12} className={classes.cardPadding}>
        <div className="card-asset-action">
          <h3>Profile</h3>
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Request By</p>
              <p>{capitalizeFirstLetter(ticketData[0].request_by)}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Departement</p>
              <p>{capitalizeFirstLetter(ticketData[0].departement_user)}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Role</p>
              <p>{capitalizeFirstLetter(ticketData[0].role_user)}</p>
            </div>
            <div className="col-3"></div>
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Area</p>
              <p>{ticketData[0].area_user}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Sub Departement</p>
              <p>{ticketData[0].subdepartement_user}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Status User</p>
              <p>{capitalizeFirstLetter(ticketData[0].status_user)}</p>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
      </Grid>

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
};

export default HistoryInformation;

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

const HistoryInformation = (props) => {
  const classes = useStyles();
  const req_no = localStorage.getItem("req_no");
  const [isLoading, setIsLoading] = useState(true);
  const [ticketData, setTicketData] = useState([]);
  const [generalRequest, setGeneralRequest] = useState([]);
  const [applicationRequest, setApplicationRequest] = useState([]);

  const { dateNow } = props;

  useEffect(() => {
    getDataHistory();
  }, [dateNow]);

  const getDataHistory = async () => {
    document.getElementById("overlay").style.display = "block";
    const logs = `${logsEndPoint[0].url}${
      logsEndPoint[0].port !== "" ? ":" + logsEndPoint[0].port : ""
    }/api/v1/logs-login/history-fr`;

    const status = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/status`;

    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    const requestOne = await axios.get(logs);
    const requestTwo = await axios.get(status);
    const requestThree = await axios.get(user, {
      headers: { Authorization: `Bearer ${token}` },
    });

    axios
      .all([requestOne, requestTwo, requestThree])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          const responseThree = responses[2];

          let newDataLog = responseOne.data.data.log_fr;
          let newDataStatus = responseTwo.data.data.statuss;
          let newDataUser = responseThree.data.data.users;

          newDataLog = newDataLog.filter(
            (item) => item.request_number === req_no
          );

          newDataLog = newDataLog.filter((item) => item.createdAt === dateNow);

          var joinmap = {};
          newDataStatus.forEach(function (status_id) {
            joinmap[status_id.id] = status_id;
          });

          newDataLog.forEach(function (request_id) {
            request_id.status_id = joinmap[request_id.status_ar];
          });
          console.log(newDataLog);

          setTicketData(newDataLog);
          setGeneralRequest(JSON.parse(newDataLog[0].general_request));
          setApplicationRequest(JSON.parse(newDataLog[0].aplication_req));
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
          <div className="flex-card">
            <h3>Personal Data</h3>

            {!ticketData[0].user_create ? (
              <p style={{ marginRight: "5px" }}>
                <span
                  className="iconify iconFailedFac"
                  data-icon="ps:forbidden"
                ></span>
                Not Create Account
              </p>
            ) : (
              <p style={{ marginRight: "5px" }}>
                <span
                  className="iconify iconSuccessFac"
                  data-icon="clarity:success-standard-solid"
                ></span>
                Success Create Account
              </p>
            )}
          </div>

          <div className="row">
            <div className="col-3">
              <p className="label-asset">Request Number</p>
              <p>{ticketData[0].request_number}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">New User</p>
              <p>{ticketData[0].user_name}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Email</p>
              <p>{ticketData[0].user_email}</p>
            </div>
            <div className="col-3">
              <p className="label-asset ">Status</p>
              <span
                class="chip-action"
                style={{
                  background: `${ticketData[0].status_id.color_status}4C`,
                  color: `${ticketData[0].status_id.color_status}FF`,
                }}
              >
                {ticketData[0].status_id.status_name}
              </span>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Area</p>
              <p className="">{ticketData[0].user_area}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Department</p>
              <p>{ticketData[0].departement_user}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Sub Department</p>
              <p>{ticketData[0].subdepartement_user}</p>
            </div>
            <div className="col-3">
              <p className="label-asset ">Date Create</p>
              <p className="">{`${calbill(ticketData[0].ticketCreated)}`}</p>
            </div>
            <div className="col-3">
              <p className="label-asset ">Create By</p>
              <p className="">{ticketData[0].request_by}</p>
            </div>
            {!ticketData[0].leader_name ? null : (
              <>
                <div className="col-3">
                  <p className="label-asset">Lead Name</p>
                  <p>{ticketData[0].leader_name}</p>
                </div>
                <div className="col-3">
                  <p className="label-asset">Comment</p>
                  <p className="wrap-paraf">{ticketData[0].leader_comment}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </Grid>
      <Grid item xs={12} className={classes.cardPadding}>
        <div className="card-asset-action">
          <h4>General Request</h4>
          <div className="row">
            <div className="col-3">
              <p className="label-asset">
                Computer
                <span
                  class="iconify check-class"
                  data-icon="clarity:success-line"
                ></span>
              </p>
              <p className="wrap-paraf">{generalRequest.comp_detail}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">
                Telephone
                {generalRequest.telephone === "yes" ? (
                  <span
                    class="iconify check-class"
                    data-icon="clarity:success-line"
                  ></span>
                ) : null}
              </p>
              <p className="wrap-paraf">
                {generalRequest.telephone_detail === ""
                  ? "-"
                  : generalRequest.telephone_detail}
              </p>
            </div>
            <div className="col-3">
              <p className="label-asset">
                Internet
                {generalRequest.internetacc === "yes" ? (
                  <span
                    class="iconify check-class"
                    data-icon="clarity:success-line"
                  ></span>
                ) : null}
              </p>
              <p className="wrap-paraf">
                {generalRequest.internetacc_detail === ""
                  ? "-"
                  : generalRequest.internetacc_detail}
              </p>
            </div>
            <div className="col-3">
              <p className="label-asset wrap-paraf">Others</p>
              <p className="wrap-paraf">
                {generalRequest.other === "" ? "-" : generalRequest.other}
              </p>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">
                Email ID Internet
                {generalRequest.emailid === "yes" ? (
                  <span
                    class="iconify check-class"
                    data-icon="clarity:success-line"
                  ></span>
                ) : null}
              </p>
              <p className="wrap-paraf">
                {generalRequest.emailid_detail === ""
                  ? "-"
                  : generalRequest.emailid_detail}
              </p>
            </div>
            <div className="col-3">
              <p className="label-asset">
                Printer Access
                {generalRequest.printeracc === "yes" ? (
                  <span
                    class="iconify check-class"
                    data-icon="clarity:success-line"
                  ></span>
                ) : null}
              </p>
              <p className="wrap-paraf">
                {generalRequest.printeracc_detail === ""
                  ? "-"
                  : generalRequest.printeracc_detail}
              </p>
            </div>
            <div className="col-3">
              <p className="label-asset">
                Wifi
                {generalRequest.wifiaccess === "yes" ? (
                  <span
                    class="iconify check-class"
                    data-icon="clarity:success-line"
                  ></span>
                ) : null}
              </p>
              <p className="wrap-paraf">
                {generalRequest.wifiaccess_detail === ""
                  ? "-"
                  : generalRequest.wifiaccess_detail}
              </p>
            </div>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} className={classes.cardPadding}>
        <div className="card-asset-action">
          <h4>Application</h4>
          <div className="row">
            <div className="col-3">
              <p className="">
                Open ERP
                {applicationRequest.openERP === true ? (
                  <span
                    class="iconify check-class"
                    data-icon="clarity:success-line"
                  ></span>
                ) : null}
              </p>
            </div>
            <div className="col-3">
              <p className="">
                Klick BCA bisnis
                {applicationRequest.clickBca === true ? (
                  <span
                    class="iconify check-class"
                    data-icon="clarity:success-line"
                  ></span>
                ) : null}
              </p>
            </div>
            <div className="col-3">
              <p className="">
                Odoo
                {applicationRequest.odoo === true ? (
                  <span
                    class="iconify check-class"
                    data-icon="clarity:success-line"
                  ></span>
                ) : null}
              </p>
            </div>
            <div className="col-3"></div>
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="">
                Eskom
                {applicationRequest.eskom === true ? (
                  <span
                    class="iconify check-class"
                    data-icon="clarity:success-line"
                  ></span>
                ) : null}
              </p>
            </div>
            <div className="col-3">
              <p className="">
                Randevoo
                {applicationRequest.randevoo === true ? (
                  <span
                    class="iconify check-class"
                    data-icon="clarity:success-line"
                  ></span>
                ) : null}
              </p>
            </div>

            <div className="col-3">
              <p className="wrap-paraf">Others </p>
              {generalRequest.other === "" ? null : (
                <p className="wrap-paraf">
                  {generalRequest.other === "" ? "-" : generalRequest.other}
                </p>
              )}
            </div>
            <div className="col-3"></div>
            <div className="col-3">
              <p className="">
                Accurate
                {applicationRequest.accurate === true ? (
                  <span
                    class="iconify check-class"
                    data-icon="clarity:success-line"
                  ></span>
                ) : null}
              </p>
            </div>
            <div className="col-3">
              <p className="">
                Solution
                {applicationRequest.solution === true ? (
                  <span
                    class="iconify check-class"
                    data-icon="clarity:success-line"
                  ></span>
                ) : null}
              </p>
            </div>
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

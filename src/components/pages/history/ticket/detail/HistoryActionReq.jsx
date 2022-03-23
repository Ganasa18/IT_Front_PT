import React, { useState, useEffect } from "react";

import {
  makeStyles,
  Grid,
  Button,
  Backdrop,
  Fade,
  Modal,
  Divider,
} from "@material-ui/core";
import "../../../../../assets/master.css";
import "../../../../../assets/asset_user.css";
import "../../../../asset/chips.css";
import "../../../../../assets/timeline.css";
import { pathEndPoint, logsEndPoint } from "../../../../../assets/menu";
import axios from "axios";
import { NavLink } from "react-router-dom";
import BreadcrumbComponent from "../../../../asset/BreadcrumbComponent";
import AddIcon from "@material-ui/icons/Add";
import HistoryInformation from "./navigation/HistoryInformation";
import ChatComponent from "../../../../asset/ChatComponent";
import ChatHistory from "../../../../asset/ChatHistory";
import HistoryInventory from "./navigation/HistoryInventory";
import HistoryPurchase from "./navigation/HistoryPurchase";
import HistoryGoodReceived from "./navigation/HistoryGoodReceived";
import Loading from "../../../../asset/Loading";

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

var isDown = false;
var scrollX;
var scrollLeft;

const HandleMouseUp = () => {
  const scroll = document.querySelector(".scroll");
  isDown = false;
  scroll.classList.remove("active");
};

const HandleMouseLeave = () => {
  const scroll = document.querySelector(".scroll");
  isDown = false;
  scroll.classList.remove("active");
};

const HandleMouseDown = (e) => {
  const scroll = document.querySelector(".scroll");
  e.preventDefault();
  isDown = true;
  scroll.classList.add("active");
  scrollX = e.pageX - scroll.offsetLeft;
  scrollLeft = scroll.scrollLeft;
};

const HandleMouseMove = (e) => {
  const scroll = document.querySelector(".scroll");
  if (!isDown) return;
  e.preventDefault();
  var element = e.pageX - scroll.offsetLeft;
  var scrolling = (element - scrollX) * 2;
  scroll.scrollLeft = scrollLeft - scrolling;
};

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

const HistoryActionReq = () => {
  const classes = useStyles();
  const req_no = localStorage.getItem("req_no");
  const [ticketDataDate, setTicketDataDate] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateSelect, setDateSelect] = useState(null);
  const [dateSelectPR, setDateSelectPR] = useState(null);
  const [dateSelectPRNow, setDateSelectPRNow] = useState(null);
  const [activeLink, setActiveLink] = useState(null);

  useEffect(() => {
    getDataHistory();
  }, []);

  const getDataHistory = async () => {
    const logs = `${logsEndPoint[0].url}${
      logsEndPoint[0].port !== "" ? ":" + logsEndPoint[0].port : ""
    }/api/v1/logs-login/history-ar`;

    const status = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/status`;

    const requestOne = await axios.get(logs);
    const requestTwo = await axios.get(status);

    await axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];

          let newDataLog = responseOne.data.data.log_ar;
          let newStatus = responseTwo.data.data.statuss;

          newDataLog = newDataLog.filter(
            (item) => item.request_number === req_no
          );

          var statusmap = {};
          newStatus.forEach(function (status_id) {
            statusmap[status_id.id] = status_id;
          });

          newDataLog.forEach(function (request_id) {
            request_id.status_id = statusmap[request_id.status_ar];
          });

          newStatus.forEach(function (status_id_pr) {
            statusmap[status_id_pr.id] = status_id_pr;
          });

          newDataLog.forEach(function (request_id) {
            request_id.status_id_pr = statusmap[request_id.status_pr];
          });

          // PR Filter
          const newDataLogPR = newDataLog.filter(
            (item) => item.status_pr !== null
          );

          if (newDataLogPR.length === 0) {
            setDateSelectPRNow(null);
          } else {
            setDateSelectPRNow(newDataLogPR[0].createdAt);
          }
          setDateSelect(newDataLog[0].createdAt);
          setActiveLink(newDataLog[0].id);
          setTicketDataDate(newDataLog);
          setDateSelectPR(newDataLogPR);

          setIsLoading(false);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  let links = [
    {
      url: "/history/ticket/action-req/detail/information",
      text: " Information",
    },
    {
      url: "/history/ticket/action-req/detail/inventory",
      text: " Inventory",
    },
    { url: "/history/ticket/action-req/detail/purchase", text: " Purchase" },
    {
      url: "/history/ticket/action-req/detail/good-receive",
      text: "Goods Received",
    },
  ];

  if (isLoading) {
    return <Loading />;
  }

  switch (window.location.pathname) {
    case "/history/ticket/action-req/detail/information":
      return (
        <>
          <div className={classes.toolbar} />
          <br />
          <BreadcrumbComponent
            Onclick={function () {
              const origin = window.location.origin;
              window.location.href = `${origin}/history/ticket`;
            }}
            textSpan={"Action Request"}
            typographyText={req_no}
          />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className="container-timeline">
                <div
                  class="scroll"
                  onMouseUp={HandleMouseUp}
                  onMouseLeave={HandleMouseLeave}
                  onMouseDown={HandleMouseDown}
                  onMouseMove={HandleMouseMove}>
                  {ticketDataDate.map((row) => (
                    <div
                      className={`card-timeline ${
                        activeLink === row.id ? "active" : ""
                      }`}
                      onClick={function () {
                        setDateSelect(row.createdAt);
                        setActiveLink(row.id);
                      }}>
                      <div className="card-inner">
                        <p className="text-center">
                          <span
                            class="chip"
                            style={{
                              background: `${row.status_id.color_status}4C`,
                              color: `${row.status_id.color_status}FF`,
                            }}>
                            {capitalizeFirstLetter(row.status_id.status_name)}
                          </span>
                        </p>
                        <br />
                        <p class="paragraph truncate">
                          {calbill(row.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              {links.map(({ url, text, index }) => (
                <NavLink
                  key={index}
                  to={url}
                  className={`navigation-tabs`}
                  activeClassName="selected">
                  {text}
                </NavLink>
              ))}
            </Grid>
            <Grid item xs={12} className={classes.cardPadding}>
              <HistoryInformation dateNow={dateSelect} />
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={8}>
              <ChatHistory />
            </Grid>
          </Grid>
        </>
      );
    case "/history/ticket/action-req/detail/inventory":
      return (
        <>
          <div className={classes.toolbar} />
          <br />

          <BreadcrumbComponent
            Onclick={function () {
              const origin = window.location.origin;
              window.location.href = `${origin}/history/ticket`;
            }}
            textSpan={"Action Request"}
            typographyText={req_no}
          />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className="container-timeline">
                <div
                  class="scroll"
                  onMouseUp={HandleMouseUp}
                  onMouseLeave={HandleMouseLeave}
                  onMouseDown={HandleMouseDown}
                  onMouseMove={HandleMouseMove}>
                  {ticketDataDate.map((row) => (
                    <div
                      className={`card-timeline ${
                        activeLink === row.id ? "active" : ""
                      }`}
                      onClick={function () {
                        setDateSelect(row.createdAt);
                        setActiveLink(row.id);
                      }}>
                      <div className="card-inner">
                        <p className="text-center">
                          <span
                            class="chip"
                            style={{
                              background: `${row.status_id.color_status}4C`,
                              color: `${row.status_id.color_status}FF`,
                            }}>
                            {capitalizeFirstLetter(row.status_id.status_name)}
                          </span>
                        </p>
                        <br />
                        <p class="paragraph truncate">
                          {calbill(row.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              {links.map(({ url, text, index }) => (
                <NavLink
                  key={index}
                  to={url}
                  className={`navigation-tabs`}
                  activeClassName="selected">
                  {text}
                </NavLink>
              ))}
            </Grid>
            <Grid item xs={12} className={classes.cardPadding}>
              <HistoryInventory dateNow={dateSelect} />
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={8}>
              <ChatHistory />
            </Grid>
          </Grid>
        </>
      );

    case "/history/ticket/action-req/detail/purchase":
      return (
        <>
          <div className={classes.toolbar} />
          <br />
          <BreadcrumbComponent
            Onclick={function () {
              const origin = window.location.origin;
              window.location.href = `${origin}/history/ticket`;
            }}
            textSpan={"Action Request"}
            typographyText={req_no}
          />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className="container-timeline">
                <div
                  class="scroll"
                  onMouseUp={HandleMouseUp}
                  onMouseLeave={HandleMouseLeave}
                  onMouseDown={HandleMouseDown}
                  onMouseMove={HandleMouseMove}>
                  {dateSelectPR.map((row) => (
                    <div
                      className={`card-timeline ${
                        activeLink === row.id ? "active" : ""
                      }`}
                      onClick={function () {
                        setDateSelectPRNow(row.createdAt);
                        setActiveLink(row.id);
                      }}>
                      <div className="card-inner">
                        <p className="text-center">
                          <span
                            class="chip"
                            style={{
                              background: `${row.status_id_pr.color_status}4C`,
                              color: `${row.status_id_pr.color_status}FF`,
                            }}>
                            {capitalizeFirstLetter(
                              row.status_id_pr.status_name
                            )}
                          </span>
                        </p>
                        <br />
                        <p class="paragraph truncate">
                          {calbill(row.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              {links.map(({ url, text, index }) => (
                <NavLink
                  key={index}
                  to={url}
                  className={`navigation-tabs`}
                  activeClassName="selected">
                  {text}
                </NavLink>
              ))}
            </Grid>
            <Grid item xs={12} className={classes.cardPadding}>
              <HistoryPurchase
                dataLogPR={dateSelectPR}
                dateNow={dateSelectPRNow}
              />
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={8}>
              <ChatHistory />
            </Grid>
          </Grid>
        </>
      );

    case "/history/ticket/action-req/detail/good-receive":
      return (
        <>
          <div className={classes.toolbar} />
          <br />
          <BreadcrumbComponent
            Onclick={function () {
              const origin = window.location.origin;
              window.location.href = `${origin}/history/ticket`;
            }}
            textSpan={"Action Request"}
            typographyText={req_no}
          />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className="container-timeline">
                <div
                  class="scroll"
                  onMouseUp={HandleMouseUp}
                  onMouseLeave={HandleMouseLeave}
                  onMouseDown={HandleMouseDown}
                  onMouseMove={HandleMouseMove}>
                  {ticketDataDate.map((row) => (
                    <div
                      className={`card-timeline ${
                        activeLink === row.id ? "active" : ""
                      }`}
                      onClick={function () {
                        setDateSelect(row.createdAt);
                        setActiveLink(row.id);
                      }}>
                      <div className="card-inner">
                        <p className="text-center">
                          <span
                            class="chip"
                            style={{
                              background: `${row.status_id.color_status}4C`,
                              color: `${row.status_id.color_status}FF`,
                            }}>
                            {capitalizeFirstLetter(row.status_id.status_name)}
                          </span>
                        </p>
                        <br />
                        <p class="paragraph truncate">
                          {calbill(row.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              {links.map(({ url, text, index }) => (
                <NavLink
                  key={index}
                  to={url}
                  className={`navigation-tabs`}
                  activeClassName="selected">
                  {text}
                </NavLink>
              ))}
            </Grid>
            <Grid item xs={12} className={classes.cardPadding}>
              <HistoryGoodReceived />
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={8}>
              <ChatHistory />
            </Grid>
          </Grid>
        </>
      );

    default:
      return "ERROR!";
  }
};

export default HistoryActionReq;

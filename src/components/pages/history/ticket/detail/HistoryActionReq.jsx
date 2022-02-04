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
import { pathEndPoint, invEndPoint } from "../../../../../assets/menu";
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

const HistoryActionReq = () => {
  const classes = useStyles();
  const req_no = localStorage.getItem("req_no");
  const [ticketData, setTicketData] = useState([]);

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
                  <div className="card-timeline">
                    <div className="card-inner">
                      <p className="text-center">
                        <span
                          class="chip-timeline"
                          style={{
                            background: `#2196534C`,
                            color: `#219653FF`,
                          }}>
                          Open
                        </span>
                      </p>
                      <br />
                      <p class="paragraph truncate">28 Oct 2021</p>
                    </div>
                  </div>
                  <div className="card-timeline">
                    <div className="card-inner">
                      <p className="text-center">
                        <span
                          class="chip-timeline"
                          style={{
                            background: `#2196534C`,
                            color: `#219653FF`,
                          }}>
                          Open
                        </span>
                      </p>
                      <br />
                      <p class="paragraph truncate">28 Oct 2021</p>
                    </div>
                  </div>
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
              <HistoryInformation />
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
                  <div className="card-timeline">
                    <div className="card-inner">
                      <p className="text-center">
                        <span
                          class="chip-timeline"
                          style={{
                            background: `#2196534C`,
                            color: `#219653FF`,
                          }}>
                          Open
                        </span>
                      </p>
                      <br />
                      <p class="paragraph truncate">28 Oct 2021</p>
                    </div>
                  </div>
                  <div className="card-timeline">
                    <div className="card-inner">
                      <p className="text-center">
                        <span
                          class="chip-timeline"
                          style={{
                            background: `#2196534C`,
                            color: `#219653FF`,
                          }}>
                          Open
                        </span>
                      </p>
                      <br />
                      <p class="paragraph truncate">28 Oct 2021</p>
                    </div>
                  </div>
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
              <HistoryInventory />
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
                  <div className="card-timeline">
                    <div className="card-inner">
                      <p className="text-center">
                        <span
                          class="chip-timeline"
                          style={{
                            background: `#2196534C`,
                            color: `#219653FF`,
                          }}>
                          Open
                        </span>
                      </p>
                      <br />
                      <p class="paragraph truncate">28 Oct 2021</p>
                    </div>
                  </div>
                  <div className="card-timeline">
                    <div className="card-inner">
                      <p className="text-center">
                        <span
                          class="chip-timeline"
                          style={{
                            background: `#2196534C`,
                            color: `#219653FF`,
                          }}>
                          Open
                        </span>
                      </p>
                      <br />
                      <p class="paragraph truncate">28 Oct 2021</p>
                    </div>
                  </div>
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
              <HistoryPurchase />
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
                  <div className="card-timeline">
                    <div className="card-inner">
                      <p className="text-center">
                        <span
                          class="chip-timeline"
                          style={{
                            background: `#2196534C`,
                            color: `#219653FF`,
                          }}>
                          Open
                        </span>
                      </p>
                      <br />
                      <p class="paragraph truncate">28 Oct 2021</p>
                    </div>
                  </div>
                  <div className="card-timeline">
                    <div className="card-inner">
                      <p className="text-center">
                        <span
                          class="chip-timeline"
                          style={{
                            background: `#2196534C`,
                            color: `#219653FF`,
                          }}>
                          Open
                        </span>
                      </p>
                      <br />
                      <p class="paragraph truncate">28 Oct 2021</p>
                    </div>
                  </div>
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

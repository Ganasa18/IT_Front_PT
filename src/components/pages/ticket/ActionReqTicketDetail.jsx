import React from "react";

import { makeStyles, Grid, Divider } from "@material-ui/core";
import "../../../assets/master.css";
import "../../../assets/asset_user.css";
import "../../asset/chips.css";
import { NavLink } from "react-router-dom";
import InformationTicket from "./navigation/InformationTicket";
import InventoryTicket from "./navigation/InventoryTicket";
import PurchaseTicket from "./navigation/PurchaseTicket";
import BreadcrumbComponent from "../../asset/BreadcrumbComponent";
import ChatComponent from "../../asset/ChatComponent";
import StatusButton from "../../asset/StatusButton";

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

const links = [
  {
    url: "/ticket-admin/action-request/detail/information",
    text: " Information",
  },
  { url: "/ticket-admin/action-request/detail/inventory", text: " Inventory" },
  { url: "/ticket-admin/action-request/detail/purchase", text: " Purchase" },
];

const ActionReqTicketDetail = () => {
  const classes = useStyles();
  const req_no = localStorage.getItem("req_no");

  switch (window.location.pathname) {
    case "/ticket-admin/action-request/detail/information":
      return (
        <>
          <div className={classes.toolbar} />
          <br />

          <BreadcrumbComponent
            Onclick={function () {
              const origin = window.location.origin;
              window.location.href = `${origin}/ticket-admin/action-request/`;
            }}
            textSpan={"Action Request"}
            typographyText={req_no}
          />

          {links.map(({ url, text, index }) => (
            <NavLink
              key={index}
              to={url}
              className={"navigation-tabs"}
              activeClassName="selected">
              {text}
            </NavLink>
          ))}

          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.cardPadding}>
              <InformationTicket />
            </Grid>
            <Grid item xs={4}>
              <div className="card-status">
                <h3>Change Status</h3>
                <br />
                <div className="card-status-item">
                  <StatusButton
                    status={"Open"}
                    nameBtn={"Open"}
                    colorName={"#219653"}
                    backgroundColor={"#219653"}
                  />
                  <StatusButton
                    nameBtn={"On Progress"}
                    colorName={"#EC9108"}
                    backgroundColor={"#EC9108"}
                  />
                  <StatusButton
                    nameBtn={"Demage"}
                    colorName={"#EB5757"}
                    backgroundColor={"#EB5757"}
                  />
                </div>
                <br />
              </div>
            </Grid>
            <Grid item xs={8}>
              <ChatComponent />
            </Grid>
          </Grid>
        </>
      );

    case "/ticket-admin/action-request/detail/inventory":
      return (
        <>
          <div className={classes.toolbar} />
          <br />
          <BreadcrumbComponent
            Onclick={function () {
              const origin = window.location.origin;
              window.location.href = `${origin}/ticket-admin/action-request/`;
            }}
            textSpan={"Action Request"}
            typographyText={req_no}
          />
          {links.map(({ url, text, index }) => (
            <NavLink
              key={index}
              to={url}
              className={"navigation-tabs"}
              activeClassName="selected">
              {text}
            </NavLink>
          ))}
          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.cardPadding}>
              <InventoryTicket />
            </Grid>
            <Grid item xs={4}>
              <div className="card-status">
                <h3>Change Status</h3>
                <br />
                <div className="card-status-item">
                  <StatusButton
                    status={"Open"}
                    nameBtn={"Open"}
                    colorName={"#219653"}
                    backgroundColor={"#219653"}
                  />
                  <StatusButton
                    nameBtn={"On Progress"}
                    colorName={"#EC9108"}
                    backgroundColor={"#EC9108"}
                  />
                </div>
                <br />
              </div>
            </Grid>
            <Grid item xs={8}>
              <ChatComponent />
            </Grid>
          </Grid>
        </>
      );

    case "/ticket-admin/action-request/detail/purchase":
      return (
        <>
          <div className={classes.toolbar} />
          <br />
          <BreadcrumbComponent
            Onclick={function () {
              const origin = window.location.origin;
              window.location.href = `${origin}/ticket-admin/action-request/`;
            }}
            textSpan={"Action Request"}
            typographyText={req_no}
          />
          {links.map(({ url, text, index }) => (
            <NavLink
              key={index}
              to={url}
              className={"navigation-tabs"}
              activeClassName="selected">
              {text}
            </NavLink>
          ))}
          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.cardPadding}>
              <PurchaseTicket />
            </Grid>
            <Grid item xs={4}>
              <div className="card-status">
                <h3>Change Status</h3>
                <br />
                <div className="card-status-item">
                  <StatusButton
                    nameBtn={"Open"}
                    colorName={"#219653"}
                    backgroundColor={"#219653"}
                  />
                  <StatusButton
                    nameBtn={"On Progress"}
                    colorName={"#EC9108"}
                    backgroundColor={"#EC9108"}
                  />
                  <StatusButton
                    nameBtn={"Demage"}
                    colorName={"#EB5757"}
                    backgroundColor={"#EB5757"}
                  />
                  <StatusButton
                    nameBtn={"Troubleshoot"}
                    colorName={"#1653A6"}
                    backgroundColor={"#1653A6"}
                  />
                  <StatusButton
                    nameBtn={"Close"}
                    colorName={"#EF5DA8"}
                    backgroundColor={"#EF5DA8"}
                  />
                </div>
                <br />
              </div>
            </Grid>
            <Grid item xs={8}>
              <ChatComponent />
            </Grid>
          </Grid>
        </>
      );
    default:
      return "ERROR!";
  }
};

export default ActionReqTicketDetail;

import React, { useState } from "react";

import {
  makeStyles,
  Grid,
  Button,
  Backdrop,
  Fade,
  Modal,
  Divider,
} from "@material-ui/core";
import "../../../assets/master.css";
import "../../../assets/asset_user.css";
import "../../asset/chips.css";
import { NavLink } from "react-router-dom";
import InformationTicket from "./navigation/InformationTicket";
import InventoryTicket from "./navigation/InventoryTicket";
import PurchaseTicket from "./navigation/PurchaseTicket";
import CreateTicketPurchase from "./navigation/CreateTicketPurchase";
import BreadcrumbComponent from "../../asset/BreadcrumbComponent";
import ChatComponent from "../../asset/ChatComponent";
import StatusButton from "../../asset/StatusButton";
import AddIcon from "@material-ui/icons/Add";
import GoodReceiveTicket from "./navigation/GoodReceiveTicket";

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

  buttonAdd: {
    position: "absolute",
    [theme.breakpoints.up("xl")]: {
      width: "150px",
      height: "40px",
      left: "100%",
      top: "12%",
      transform: "translate(-110%, 0%)",
    },

    [theme.breakpoints.down("lg")]: {
      width: "150px",
      height: "40px",
      left: "100%",
      top: "16%",
      transform: "translate(-110%, 0%)",
    },
    [theme.breakpoints.down("sm")]: {
      bottom: "20px",
      width: "120px",
    },
    fontSize: 12,
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

  paper: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "40%",
    left: "50%",
    width: 950,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 6, 3),
  },
}));

const links = [
  {
    url: "/ticket-admin/action-request/detail/information",
    text: " Information",
  },
  { url: "/ticket-admin/action-request/detail/inventory", text: " Inventory" },
  { url: "/ticket-admin/action-request/detail/purchase", text: " Purchase" },
  {
    url: "/ticket-admin/action-request/detail/good-receive",
    text: "Goods Received",
  },
];

const ActionReqTicketDetail = () => {
  const classes = useStyles();
  const req_no = localStorage.getItem("req_no");
  const [modalOpen, setModalOpen] = useState(false);

  const modalPop = () => {
    setModalOpen(true);
  };

  const modalClose = () => {
    setModalOpen(false);
  };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <CreateTicketPurchase />
          <Button
            className={classes.cancelBtn}
            onClick={modalClose}
            variant="outlined"
          >
            Cancel
          </Button>
        </div>
      </Fade>
    </>
  );

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
              activeClassName="selected"
            >
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
              activeClassName="selected"
            >
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
              activeClassName="selected"
            >
              {text}
            </NavLink>
          ))}

          <Button
            onClick={modalPop}
            variant="contained"
            color="primary"
            className={classes.buttonAdd}
            startIcon={<AddIcon />}
          >
            Create New
          </Button>
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
          <Modal
            open={modalOpen}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            {bodyModal}
          </Modal>
        </>
      );

    case "/ticket-admin/action-request/detail/good-receive":
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
              activeClassName="selected"
            >
              {text}
            </NavLink>
          ))}
          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.cardPadding}>
              <GoodReceiveTicket />
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
    default:
      return "ERROR!";
  }
};

export default ActionReqTicketDetail;

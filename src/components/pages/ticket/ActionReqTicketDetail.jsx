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
import "../../../assets/master.css";
import "../../../assets/asset_user.css";
import "../../asset/chips.css";
import { pathEndPoint, invEndPoint } from "../../../assets/menu";
import axios from "axios";
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
    transform: "translate(-50%,-60%)",
    top: "54%",
    left: "50%",
    width: 1200,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(4, 10, 4),
    [theme.breakpoints.down("lg")]: {
      transform: "translate(-50%,-45%)",
      width: 1000,
    },
  },
}));

const ActionReqTicketDetail = () => {
  const classes = useStyles();
  const req_no = localStorage.getItem("req_no");

  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusBtn, setStatusBtn] = useState([]);
  const [ticketData, setTicketData] = useState([]);

  useEffect(() => {
    getTicket();
    getStatus();
  }, []);

  const getTicket = async () => {
    let act_req = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/`;

    let status = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/status`;

    const requestOne = await axios.get(act_req);
    const requestTwo = await axios.get(status);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          let newDataRequest = responseOne.data.data.request_tiket;
          let newStatus = responseTwo.data.data.statuss;
          var arr_request = [...newDataRequest];
          const arr_status = [...newStatus];

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

          setTicketData(arr_request);
          setIsLoading(false);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  const getStatus = async () => {
    let status = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/status`;

    axios
      .get(status)
      .then((response) => {
        let newStatus = response.data.data.statuss;
        setStatusBtn(newStatus);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modalPop = () => {
    if (ticketData[0].status_id.id === 8) {
      setModalOpen(true);
      return;
    }
    alert("must changed status damaged first");
  };

  const modalClose = () => {
    setModalOpen(false);
  };

  let links = [
    {
      url: "/ticket-admin/action-request/detail/information",
      text: " Information",
    },
    {
      url: "/ticket-admin/action-request/detail/inventory",
      text: " Inventory",
    },
    { url: "/ticket-admin/action-request/detail/purchase", text: " Purchase" },
    {
      url: "/ticket-admin/action-request/detail/good-receive",
      text: "Goods Received",
    },
  ];

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <CreateTicketPurchase dataTicket={ticketData} />
          <Button
            className={classes.cancelBtn}
            onClick={modalClose}
            variant="outlined">
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
          {isLoading
            ? null
            : links.map(({ url, text, index }) => (
                <NavLink
                  key={index}
                  to={url}
                  className={`${
                    ticketData[0].status_id.id === 13 ||
                    ticketData[0].status_id.id === 14
                      ? "navigation-tabs"
                      : text === "Goods Received"
                      ? "navigation-tabs-disabled"
                      : "navigation-tabs"
                  }`}
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
                {isLoading ? null : (
                  <div className="card-status-item">
                    {statusBtn
                      .filter(
                        (row) =>
                          row.id !== 1 &&
                          row.id !== 7 &&
                          row.id !== 10 &&
                          row.id !== 13 &&
                          row.id !== 14 &&
                          row.id !== 15 &&
                          row.id !== 16 &&
                          row.id !== 17 &&
                          row.id !== 18
                      )
                      .map((row) => (
                        <StatusButton
                          idStatus={row.id}
                          status={`${
                            ticketData[0].status_id.status_name ===
                            row.status_name
                              ? ticketData[0].status_id.status_name
                              : ""
                          }`}
                          nameBtn={row.status_name}
                          colorName={row.color_status}
                          backgroundColor={row.color_status}
                          data={ticketData[0]}
                        />
                      ))}
                    {console.log(ticketData)}
                  </div>
                )}

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
          {isLoading
            ? null
            : links.map(({ url, text, index }) => (
                <NavLink
                  key={index}
                  to={url}
                  className={`${
                    ticketData[0].status_id.id === 13 ||
                    ticketData[0].status_id.id === 14
                      ? "navigation-tabs"
                      : text === "Goods Received"
                      ? "navigation-tabs-disabled"
                      : "navigation-tabs"
                  }`}
                  activeClassName="selected">
                  {text}
                </NavLink>
              ))}
          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.cardPadding}>
              <InventoryTicket dataTicket={ticketData[0]} />
            </Grid>
            <Grid item xs={4}>
              <div className="card-status">
                <h3>Change Status</h3>
                <br />
                {isLoading ? null : (
                  <div className="card-status-item">
                    {statusBtn
                      .filter(
                        (row) =>
                          row.id !== 1 &&
                          row.id !== 7 &&
                          row.id !== 10 &&
                          row.id !== 13 &&
                          row.id !== 14 &&
                          row.id !== 15 &&
                          row.id !== 16 &&
                          row.id !== 17 &&
                          row.id !== 18
                      )
                      .map((row) => (
                        <StatusButton
                          idStatus={row.id}
                          status={`${
                            ticketData[0].status_id.status_name ===
                            row.status_name
                              ? ticketData[0].status_id.status_name
                              : ""
                          }`}
                          nameBtn={row.status_name}
                          colorName={row.color_status}
                          backgroundColor={row.color_status}
                          data={ticketData[0]}
                        />
                      ))}
                  </div>
                )}
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
          {isLoading
            ? null
            : links.map(({ url, text, index }) => (
                <NavLink
                  key={index}
                  to={url}
                  className={`${
                    ticketData[0].status_id.id === 13 ||
                    ticketData[0].status_id.id === 14
                      ? "navigation-tabs"
                      : text === "Goods Received"
                      ? "navigation-tabs-disabled"
                      : "navigation-tabs"
                  }`}
                  activeClassName="selected">
                  {text}
                </NavLink>
              ))}

          <Button
            onClick={modalPop}
            variant="contained"
            color="primary"
            className={classes.buttonAdd}
            startIcon={<AddIcon />}>
            Create New
          </Button>
          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.cardPadding}>
              <PurchaseTicket dataTicket={ticketData[0]} />
            </Grid>
            <Grid item xs={4}>
              <div className="card-status">
                <h3>Change Status</h3>
                <br />
                {isLoading ? null : (
                  <div className="card-status-item">
                    {statusBtn
                      .filter(
                        (row) =>
                          row.id !== 1 &&
                          row.id !== 7 &&
                          row.id !== 10 &&
                          row.id !== 13 &&
                          row.id !== 14 &&
                          row.id !== 15 &&
                          row.id !== 16 &&
                          row.id !== 17 &&
                          row.id !== 18
                      )
                      .map((row) => (
                        <StatusButton
                          idStatus={row.id}
                          status={`${
                            ticketData[0].status_id.status_name ===
                            row.status_name
                              ? ticketData[0].status_id.status_name
                              : ""
                          }`}
                          nameBtn={row.status_name}
                          colorName={row.color_status}
                          backgroundColor={row.color_status}
                          data={ticketData[0]}
                        />
                      ))}
                  </div>
                )}
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
            }}>
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
              activeClassName="selected">
              {text}
            </NavLink>
          ))}
          <Grid container spacing={3}>
            <Grid item xs={12} className={classes.cardPadding}>
              <GoodReceiveTicket dataTicket={ticketData[0]} />
            </Grid>
            <Grid item xs={4}>
              <div className="card-status">
                <h3>Change Status</h3>
                <br />
                {isLoading ? null : (
                  <div className="card-status-item">
                    {statusBtn
                      .filter((row) => [13, 14, 15].includes(row.id))
                      .sort((a, b) => (a.id > b.id ? 1 : -1))
                      .map((row) => (
                        <StatusButton
                          idStatus={row.id}
                          status={`${
                            ticketData[0].status_id.status_name ===
                            row.status_name
                              ? ticketData[0].status_id.status_name
                              : ""
                          }`}
                          nameBtn={row.status_name}
                          colorName={row.color_status}
                          backgroundColor={row.color_status}
                          data={ticketData[0]}
                        />
                      ))}
                  </div>
                )}
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

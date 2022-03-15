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
import { pathEndPoint, FacEndPoint } from "../../../assets/menu";
import axios from "axios";
import { NavLink } from "react-router-dom";

import BreadcrumbComponent from "../../asset/BreadcrumbComponent";
import ChatComponent from "../../asset/ChatComponent";
import StatusButton from "../../asset/StatusButton";
import AddIcon from "@material-ui/icons/Add";
import InformationTicketFac from "./facnavigation/InformationTicketFac";
import ChatFacility from "../../asset/ChatFacility";
import ButtonStatusFacility from "../../asset/ButtonStatusFacility";
import PurchaseTicketFac from "./facnavigation/PurchaseTicketFac";
import CreateTicketPurchase from "./navigation/CreateTicketPurchase";
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
    transform: "translate(-50%,-40%)",
    top: "54%",
    left: "50%",
    width: 1200,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(4, 10, 4),
    [theme.breakpoints.down("lg")]: {
      transform: "translate(-50%,-50%)",
      width: 1000,
    },

    [theme.breakpoints.between("xlm", "xl")]: {
      top: "-2%",
      left: "20%",
      transform: "scale(0.9)",
    },
  },
}));

const FacilityReqTicketDetail = () => {
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

  const modalPop = () => {
    if (ticketData[0].status_id.id === 21) {
      setModalOpen(true);
      return;
    }
    alert("must changed status request first");
  };

  const modalClose = () => {
    setModalOpen(false);
  };

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

  const getTicket = async () => {
    let act_req = `${FacEndPoint[0].url}${
      FacEndPoint[0].port !== "" ? ":" + FacEndPoint[0].port : ""
    }/api/v1/facility-req/`;

    let status = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/status`;

    let area = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/area`;

    let departement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/departement`;

    let subdepartement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/subdepartement`;

    const requestOne = await axios.get(act_req);
    const requestTwo = await axios.get(status);
    const requestThree = await axios.get(area);
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

          let newDataRequest = responseOne.data.data.request_facility;
          let newStatus = responseTwo.data.data.statuss;
          let newDataArea = responesThree.data.data.areas;
          let newDataDepartement = responesFour.data.data.departements;
          let newDataSubDepartement = responesFive.data.data.subdepartements;

          var arr_request = [...newDataRequest];
          const arr_status = [...newStatus];
          const arr_area = [...newDataArea];
          const arr_departement = [...newDataDepartement];
          const arr_subdepartement = [...newDataSubDepartement];

          arr_request = arr_request.filter(
            (item) => item.facility_req_code === req_no
          );

          var statusmap = {};

          arr_status.forEach(function (status_id) {
            statusmap[status_id.id] = status_id;
          });

          arr_request.forEach(function (request_id) {
            request_id.status_id = statusmap[request_id.status_id];
          });

          arr_area.forEach(function (area_id) {
            statusmap[area_id.id] = area_id;
          });

          arr_request.forEach(function (user) {
            user.area_id = statusmap[user.user_area];
          });

          arr_departement.forEach(function (depart_id) {
            statusmap[depart_id.id] = depart_id;
          });

          arr_request.forEach(function (user) {
            user.depart_id = statusmap[user.user_departement];
          });

          arr_subdepartement.forEach(function (subdepart_id) {
            statusmap[subdepart_id.id] = subdepart_id;
          });

          arr_request.forEach(function (user) {
            user.subdepart_id = statusmap[user.user_subdepartement];
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

  let links = [
    {
      url: "/ticket-admin/facility-request/detail/information",
      text: "Information",
    },

    {
      url: "/ticket-admin/facility-request/detail/purchase",
      text: " Purchase",
    },
    {
      url: "/ticket-admin/facility-request/detail/good-receive",
      text: "Goods Received",
    },
  ];

  switch (window.location.pathname) {
    case "/ticket-admin/facility-request/detail/information":
      return (
        <>
          <br />
          <div className={classes.toolbar} />
          <BreadcrumbComponent
            Onclick={function () {
              const origin = window.location.origin;
              window.location.href = `${origin}/ticket-admin/facility-request/`;
            }}
            textSpan={"Facility Request"}
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
            {isLoading ? null : (
              <Grid item xs={12} className={classes.cardPadding}>
                <InformationTicketFac ticketData={ticketData} />
              </Grid>
            )}
            <Grid item xs={4}>
              <div className="card-status">
                <h3>Change Status</h3>
                <br />
                {isLoading ? null : (
                  <div className="card-status-item">
                    {statusBtn
                      .filter((row) => [4, 11, 12, 21].includes(row.id))
                      .map((row) => (
                        <ButtonStatusFacility
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
              <ChatFacility />
            </Grid>
          </Grid>
        </>
      );

    case "/ticket-admin/facility-request/detail/purchase":
      return (
        <>
          <br />
          <div className={classes.toolbar} />
          <BreadcrumbComponent
            Onclick={function () {
              const origin = window.location.origin;
              window.location.href = `${origin}/ticket-admin/facility-request/`;
            }}
            textSpan={"Facility Request"}
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
            {isLoading ? null : (
              <Grid item xs={12} className={classes.cardPadding}>
                <PurchaseTicketFac ticketData={ticketData} />
              </Grid>
            )}
            <Grid item xs={4}>
              <div className="card-status">
                <h3>Change Status</h3>
                <br />
                {isLoading ? null : (
                  <div className="card-status-item">
                    {statusBtn
                      .filter((row) => [4, 11, 12, 19, 21].includes(row.id))
                      .map((row) => (
                        <ButtonStatusFacility
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
              <ChatFacility />
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

    case "/ticket-admin/facility-request/detail/good-receive":
      return (
        <>
          <br />
          <div className={classes.toolbar} />
          <BreadcrumbComponent
            Onclick={function () {
              const origin = window.location.origin;
              window.location.href = `${origin}/ticket-admin/facility-request/`;
            }}
            textSpan={"Facility Request"}
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
                        <ButtonStatusFacility
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
              <ChatFacility />
            </Grid>
          </Grid>
        </>
      );
    default:
      return "ERROR!";
  }
};

export default FacilityReqTicketDetail;

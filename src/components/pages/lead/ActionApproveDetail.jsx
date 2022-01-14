import React, { useState, useEffect } from "react";

import { invEndPoint, authEndPoint } from "../../../assets/menu";

import {
  makeStyles,
  Grid,
  Breadcrumbs,
  Typography,
  Backdrop,
  Fade,
  Modal,
} from "@material-ui/core";

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

const ActionApproveDetail = () => {
  const classes = useStyles();
  const dataStorage = localStorage.getItem("ticketData");
  const parseObject = JSON.parse(dataStorage);
  const [dataRequest] = useState(parseObject);
  const [modalOpen, setModalOpen] = useState(false);
  const [areaInput, setAreaInput] = useState(null);
  const [leadEmail, setLeadEmail] = useState(null);
  const [allDataUser, setAllDataUser] = useState([]);
  const [approve, setApprove] = useState(null);

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = async () => {
    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    await axios
      .get(user, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const DataUser = response.data.data.users;
        const AllData = DataUser.map((item) => ({
          id: item.id,
          name: item.username,
          role: item.role,
          departement: item.departement,
          subdepartement: item.subdepartement,
          area: item.area,
          email: item.email,
        }));

        setAllDataUser(AllData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleModal = () => {
    const getDataAdmin = allDataUser.filter((item) => item.role === 1);
    setModalOpen((prevSelected) => !prevSelected);
    setApprove("approve");

    var arr = [];
    getDataAdmin.forEach((x) => arr.push(x.email));
    setLeadEmail(arr);
  };

  const handleModalDeny = () => {
    setApprove("deny");
    setModalOpen((prevSelected) => !prevSelected);
    setLeadEmail(dataRequest.id_user.email);
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    const host = window.location.origin;

    if (approve === "deny") {
      const getLead = allDataUser.filter(
        (item) => item.id === parseInt(userID)
      );

      await axios
        .patch(
          `${invEndPoint[0].url}${
            invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
          }/api/v1/action-req/updated-ticket/${dataRequest.id}`,
          {
            status_id: 7,
            leader_id: parseInt(userID),
            lead: leadEmail,
            username: getLead[0].name,
            email: getLead[0].email,
            url: host,
            action_req_code: dataRequest.action_req_code,
            type_response: "reject",
          }
        )
        .then((response) => {
          alert(response.data.status);

          setTimeout(() => {
            window.location = `${host}/approval/action-request/`;
          }, 1500);
        })
        .catch((error) => {
          console.log(error);
        });

      return;
    }

    if (areaInput === "" || areaInput === null) {
      alert("comment cant be empty");
      return;
    }
    if (areaInput.length < 10) {
      alert("comment must have min 10 character");
      return;
    }

    await axios
      .patch(
        `${invEndPoint[0].url}${
          invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
        }/api/v1/action-req/updated-ticket/${dataRequest.id}`,
        {
          leader_comment: areaInput,
          status_id: 12,
          leader_id: parseInt(userID),
          lead: leadEmail,
          username: dataRequest.id_user.name,
          email: dataRequest.id_user.email,
          url: host,
          action_req_code: dataRequest.action_req_code,
          type_response: "approve",
        }
      )
      .then((response) => {
        alert(response.data.status);

        setTimeout(() => {
          window.location = `${host}/approval/action-request/`;
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <form onSubmit={handleApprove}>
            <div className="row">
              {approve === "approve" ? (
                <>
                  <div className="col-12">
                    <p className="comment-pop-title">Leave a comment for IT</p>
                    <p className="comment-pop-title-2">
                      Please leave a comment bellow
                    </p>
                  </div>
                  <div className="col-12">
                    <textarea
                      value={areaInput}
                      onChange={(e) => setAreaInput(e.target.value)}
                      className="form-input-area"
                      placeholder="Comment here... "
                      cols="30"
                      rows="10"></textarea>
                  </div>
                </>
              ) : (
                <div className="col-12">
                  <p className="comment-pop-title">
                    Are you sure want deny this request ?
                  </p>
                  <br /> <br />
                </div>
              )}
            </div>
            <div className="footer-modal">
              <button className="btn-cancel" onClick={handleModal}>
                Cancel
              </button>
              <button className="btn-submit" type="submit">
                {approve === "approve" ? "Approved" : "Reject"}
              </button>
            </div>
          </form>
        </div>
      </Fade>
    </>
  );

  return (
    <>
      <div className={classes.toolbar} />
      <br />
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        <span className={"span_crumb"}>Action Request</span>
        <Typography color="textPrimary">
          {dataRequest.action_req_code}
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <div className="flex-card">
              <h3>Information</h3>

              <div className="button-approve">
                <button
                  type="button"
                  onClick={handleModal}
                  className="approve-btn">
                  Approve
                </button>
                <button
                  type="button"
                  className="deny-btn"
                  onClick={handleModalDeny}>
                  Deny
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Request Number</p>
                <p>{dataRequest.action_req_code}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Asset Number</p>
                <p>{dataRequest.invent_id.asset_number}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Asset Name</p>
                <p>{dataRequest.invent_id.asset_name}</p>
              </div>
              <div className="col-3">
                <p className="label-asset text-center">Status</p>
                <p className="text-center">
                  <span
                    className="chip-action"
                    style={{
                      background: `${dataRequest.status_id.color_status}4C`,
                      color: `${dataRequest.status_id.color_status}FF`,
                    }}>
                    {dataRequest.status_id.status_name}
                  </span>
                </p>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Request By</p>
                <p>{dataRequest.id_user.name}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Date</p>
                <p>{`${calbill(dataRequest.createdAt)}`}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Description Of Problem</p>
                <p className="wrap-paraf">
                  {dataRequest.action_req_description}
                </p>
              </div>
            </div>
          </div>
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
};

export default ActionApproveDetail;

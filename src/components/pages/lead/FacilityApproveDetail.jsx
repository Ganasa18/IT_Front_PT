import React, { useState, useEffect } from "react";
import Loader from "react-loader-spinner";
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
import { authEndPoint, FacEndPoint } from "../../../assets/menu";
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

const FacilityApproveDetail = () => {
  const classes = useStyles();
  const dataStorage = localStorage.getItem("ticketData");
  const parseObject = JSON.parse(dataStorage);
  const [dataRequest] = useState(parseObject);
  const [generalRequest] = useState(JSON.parse(dataRequest.general_request));
  const [applicationRequest] = useState(JSON.parse(dataRequest.aplication_req));
  const [modalOpen, setModalOpen] = useState(false);
  const [approve, setApprove] = useState(null);
  const [areaInput, setAreaInput] = useState(null);
  const [allDataUser, setAllDataUser] = useState([]);
  const [leadEmail, setLeadEmail] = useState(null);

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
    console.log(arr);
    setLeadEmail(arr);
  };

  const handleModalDeny = () => {
    setApprove("deny");
    setModalOpen((prevSelected) => !prevSelected);
    setLeadEmail(dataRequest.user_email);
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    const host = window.location.origin;

    if (approve === "deny") {
      const getLead = allDataUser.filter(
        (item) => item.id === parseInt(userID)
      );

      document.getElementById("overlay").style.display = "block";

      await axios
        .patch(
          `${FacEndPoint[0].url}${
            FacEndPoint[0].port !== "" ? ":" + FacEndPoint[0].port : ""
          }/api/v1/facility-req/updated-ticket/${dataRequest.id}`,
          {
            status_id: 20,
            leader_id: parseInt(userID),
            lead: leadEmail,
            username: getLead[0].name,
            email: getLead[0].email,
            url: host,
            facility_req_code: dataRequest.facility_req_code,
            type_response: "reject",
          }
        )
        .then((response) => {
          alert(response.data.status);
          document.getElementById("overlay").style.display = "block";
          setTimeout(() => {
            window.location = `${host}/approval/facility-request/`;
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

    document.getElementById("overlay").style.display = "block";

    await axios
      .patch(
        `${FacEndPoint[0].url}${
          FacEndPoint[0].port !== "" ? ":" + FacEndPoint[0].port : ""
        }/api/v1/facility-req/updated-ticket/${dataRequest.id}`,
        {
          leader_comment: areaInput,
          status_id: 12,
          leader_id: parseInt(userID),
          lead: leadEmail,
          username: dataRequest.user_name,
          email: dataRequest.user_email,
          url: host,
          facility_req_code: dataRequest.facility_req_code,
          type_response: "approve",
        }
      )
      .then((response) => {
        alert(response.data.status);
        setTimeout(() => {
          window.location = `${host}/approval/facility-request/`;
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

  return (
    <>
      <div className={classes.toolbar} />
      <br />
      <Breadcrumbs
        onClick={function () {
          const origin = window.location.origin;
          window.location.href = `${origin}/approval/facility-request`;
        }}
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        <span className={"span_crumb"}>Facility Request</span>
        <Typography color="textPrimary">
          {dataRequest.facility_req_code}
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <div className="flex-card">
              <h3>Personal Data</h3>

              <div className="button-approve">
                <button
                  onClick={handleModal}
                  type="button"
                  className="approve-btn">
                  Approve
                </button>
                <button
                  onClick={handleModalDeny}
                  type="button"
                  className="deny-btn">
                  Deny
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Request Number</p>
                <p>{dataRequest.facility_req_code}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">New User</p>
                <p>{dataRequest.facility_req_code}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Email</p>
                <p>{dataRequest.user_email}</p>
              </div>
              <div className="col-3">
                <p className="label-asset ">Status</p>
                <p className="">
                  <span
                    class="chip-action"
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
                <p className="label-asset">Area</p>
                <p className="">
                  {dataRequest.area_id.area_name} -
                  {dataRequest.area_id.alias_name}
                </p>
              </div>
              <div className="col-3">
                <p className="label-asset">Department</p>
                <p>{dataRequest.depart_id.departement_name}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Sub Department</p>
                <p>
                  {!dataRequest.user_subdepartement
                    ? " - "
                    : dataRequest.user_subdepartement.subdepartement_name}
                </p>
              </div>
              <div className="col-3">
                <p className="label-asset ">Date Create</p>
                <p className="">{`${calbill(dataRequest.createdAt)}`}</p>
              </div>
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
                    data-icon="clarity:success-line"></span>
                </p>
                <p className="wrap-paraf">{generalRequest.comp_detail}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">
                  Telephone
                  {generalRequest.telephone === "yes" ? (
                    <span
                      class="iconify check-class"
                      data-icon="clarity:success-line"></span>
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
                      data-icon="clarity:success-line"></span>
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
                      data-icon="clarity:success-line"></span>
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
                      data-icon="clarity:success-line"></span>
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
                      data-icon="clarity:success-line"></span>
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
                      data-icon="clarity:success-line"></span>
                  ) : null}
                </p>
              </div>
              <div className="col-3">
                <p className="">
                  Klick BCA bisnis
                  {applicationRequest.clickBca === true ? (
                    <span
                      class="iconify check-class"
                      data-icon="clarity:success-line"></span>
                  ) : null}
                </p>
              </div>
              <div className="col-3">
                <p className="">
                  Odoo
                  {applicationRequest.odoo === true ? (
                    <span
                      class="iconify check-class"
                      data-icon="clarity:success-line"></span>
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
                      data-icon="clarity:success-line"></span>
                  ) : null}
                </p>
              </div>
              <div className="col-3">
                <p className="">
                  Randevoo
                  {applicationRequest.randevoo === true ? (
                    <span
                      class="iconify check-class"
                      data-icon="clarity:success-line"></span>
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
                      data-icon="clarity:success-line"></span>
                  ) : null}
                </p>
              </div>
              <div className="col-3">
                <p className="">
                  Solution
                  {applicationRequest.solution === true ? (
                    <span
                      class="iconify check-class"
                      data-icon="clarity:success-line"></span>
                  ) : null}
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

export default FacilityApproveDetail;

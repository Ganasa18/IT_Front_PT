import React, { useState, useEffect } from "react";
import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../../../assets/select-search.css";
import { makeStyles, Grid, Backdrop, Fade, Modal } from "@material-ui/core";
import axios from "axios";

import "../../../../assets/master.css";
import "../../../../assets/asset_user.css";
import "../../../asset/chips.css";

import { authEndPoint, FacEndPoint } from "../../../../assets/menu";
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

  paper: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "30%",
    left: "50%",
    width: 950,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 8, 3),
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

const InformationTicketFac = (props) => {
  const classes = useStyles();
  const { ticketData } = props;
  const [dataRequest] = useState(ticketData[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [generalRequest] = useState(JSON.parse(dataRequest.general_request));
  const [applicationRequest] = useState(JSON.parse(dataRequest.aplication_req));
  const [dataRole, setDataRole] = useState([]);
  const [valueEmail, setValueEmail] = useState("");
  const [valueRole, setValueRole] = useState("");
  // console.log(dataRequest);

  const modalHandle = () => {
    setModalOpen((prevModal) => !prevModal);
  };

  useEffect(() => {
    getRoleList();
  }, []);

  const getRoleList = async () => {
    await axios
      .get(
        `${authEndPoint[0].url}${
          authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
        }/api/v1/role`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        let dataRole = response.data.data.roles;

        dataRole = dataRole.map((item) => ({
          value: item.id,
          name: item.role_name,
        }));

        setDataRole(dataRole);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveHandlerUser = async (event) => {
    event.preventDefault();

    if (valueRole.length === 0) {
      alert("please select 1 role");
      return;
    }

    if (valueEmail.length === 0) {
      alert("fill email");
      return;
    }

    const fac_req = `${FacEndPoint[0].url}${
      FacEndPoint[0].port !== "" ? ":" + FacEndPoint[0].port : ""
    }/api/v1/facility-req/updated-is-user-create/${dataRequest.id}`;

    const dataUser = {
      username: dataRequest.user_name,
      email: valueEmail,
      password: "123",
      no_handphone: "",
      area: dataRequest.user_area,
      departement: dataRequest.depart_id.id,
      subdepartement:
        dataRequest.subdepart_id === undefined
          ? null
          : dataRequest.subdepart_id.id,
      employe_status: dataRequest.user_status,
      role: parseInt(valueRole),
    };

    await axios
      .post(
        `${authEndPoint[0].url}${
          authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
        }/api/v1/auth/`,
        dataUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => {
        setValueRole("");
        setValueEmail("");

        axios
          .patch(fac_req, {
            user_create: true,
          })
          .then((resp) => {
            alert(resp.data.status);
            setTimeout(() => {
              setModalOpen(false);
              window.location.reload();
            }, 1500);
          })
          .catch((err) => {
            alert("something wrong");
          });
      })
      .catch((error) => {
        alert("something wrong");
      });
  };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <form onSubmit={saveHandlerUser}>
            <div className="row">
              <div className="col-12">
                <h3>Create User</h3>
              </div>
              <div className="col-6">
                <label htmlFor="">Nama User</label>
                <input
                  type="text"
                  value={dataRequest.user_name}
                  className="form-input"
                  readOnly
                />
              </div>
              <div className="col-6">
                <label htmlFor="">Role</label>
                <SelectSearch
                  options={dataRole}
                  value={dataRole}
                  onChange={(e) => {
                    setValueRole(e);
                  }}
                  filterOptions={fuzzySearch}
                  search
                  placeholder="Role Search"
                />
              </div>
              <div className="col-6">
                <label htmlFor="">Departement</label>
                <input
                  type="text"
                  value={dataRequest.depart_id.departement_name}
                  className="form-input"
                  readOnly
                />
              </div>
              <div className="col-6">
                <label htmlFor="">Email</label>
                <input
                  type="text"
                  value={valueEmail}
                  className="form-input"
                  onChange={(e) => {
                    setValueEmail(e.target.value);
                  }}
                />
              </div>
              <div className="col-6">
                <label htmlFor="">Sub Departement</label>
                <input
                  type="text"
                  value={
                    dataRequest.subdepart_id === undefined
                      ? ""
                      : dataRequest.subdepart_id.subdepartement_name
                  }
                  className="form-input"
                  readOnly
                />
              </div>
              <div className="col-6">
                <label htmlFor="">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={"123"}
                  readOnly
                />
              </div>
            </div>
            <br />
            <div className="footer-modal">
              <button className={"btn-cancel"} onClick={modalHandle}>
                Cancel
              </button>
              <button className={"btn-submit"} type="submit">
                Submit
              </button>
            </div>
          </form>
        </div>
      </Fade>
    </>
  );

  return (
    <>
      <Grid item xs={12} className={classes.cardPadding}>
        <div className="card-asset-action">
          <div className="flex-card">
            <h3>Personal Data</h3>

            {!dataRequest.user_create ? (
              <div className="button-creat-user">
                <button
                  onClick={modalHandle}
                  type="button"
                  className="creat-user-btn">
                  Create Account
                </button>
              </div>
            ) : (
              <p style={{ marginRight: "5px" }}>
                <span
                  className="iconify iconSuccessFac"
                  data-icon="clarity:success-standard-solid"></span>
                Success Create Account
              </p>
            )}
          </div>

          <div className="row">
            <div className="col-3">
              <p className="label-asset">Request Number</p>
              <p>{dataRequest.facility_req_code}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">New User</p>
              <p>{dataRequest.user_name}</p>
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
            <div className="col-3">
              <p className="label-asset ">Create By</p>
              <p className="">{ticketData[0].created_by}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Comment</p>
              <p className="wrap-paraf">{ticketData[0].leader_comment}</p>
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

export default InformationTicketFac;

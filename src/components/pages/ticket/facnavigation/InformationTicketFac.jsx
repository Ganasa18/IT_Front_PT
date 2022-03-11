import React, { useState, useEffect } from "react";

import { makeStyles, Grid } from "@material-ui/core";
import axios from "axios";

import "../../../../assets/master.css";
import "../../../../assets/asset_user.css";
import "../../../asset/chips.css";

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

const InformationTicketFac = (props) => {
  const classes = useStyles();
  const { ticketData } = props;
  const [dataRequest] = useState(ticketData[0]);
  const [generalRequest] = useState(JSON.parse(dataRequest.general_request));
  const [applicationRequest] = useState(JSON.parse(dataRequest.aplication_req));
  console.log(dataRequest);
  return (
    <>
      <Grid item xs={12} className={classes.cardPadding}>
        <div className="card-asset-action">
          <div className="flex-card">
            <h3>Personal Data</h3>

            <div className="button-creat-user">
              <button type="button" className="creat-user-btn">
                Create Account
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
    </>
  );
};

export default InformationTicketFac;

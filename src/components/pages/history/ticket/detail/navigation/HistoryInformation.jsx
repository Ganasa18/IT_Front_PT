import React, { useState, useEffect } from "react";

import { makeStyles, Grid } from "@material-ui/core";
import axios from "axios";
import "../../../../../../assets/master.css";
import "../../../../../../assets/asset_user.css";
import "../../../../../asset/chips.css";

import {
  authEndPoint,
  pathEndPoint,
  invEndPoint,
} from "../../../../../../assets/menu";
import Cookies from "universal-cookie";

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

const HistoryInformation = () => {
  const classes = useStyles();
  const req_no = localStorage.getItem("req_no");
  return (
    <>
      <Grid item xs={12} className={classes.cardPadding}>
        <div className="card-asset-action">
          <h3>Information</h3>
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Request Number</p>
              <p>awdawd</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Asset Number</p>
              <p>awdawd</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Asset Name</p>
              <p>awdawdaw</p>
            </div>
            <div className="col-3">
              <p className="label-asset text-center">Status</p>
              <p className="text-center">
                <span
                  class="chip-action"
                  style={{
                    background: `#2196534C`,
                    color: `#219653FF`,
                  }}>
                  Open
                </span>
              </p>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Date</p>
              <p>{`23 Okt 2022`}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Description Of Problem</p>
              <p className="wrap-paraf">
                Pada saat nyalain laptop, layar warna biru, ditunggu 5 menit
                layar langsung mati
              </p>
            </div>

            <>
              <div className="col-2">
                <p className="label-asset">Approved By</p>
                <p>{capitalizeFirstLetter("Leadadmin")}</p>
              </div>

              <div className="col-3">
                <p className="label-asset">Comment</p>
                <p className="wrap-paraf">comment</p>
              </div>
            </>
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Attachment</p>
              <p>
                <button className="attachment-view">view</button>
              </p>
            </div>
            <div className="col-3">
              <p className="label-asset">Troubleshoot</p>
              <p>-</p>
              <p className="wrap-paraf">-</p>
            </div>
            <div className="col-2">
              <p className="label-asset">Close Remark</p>
              <p className="wrap-paraf">-</p>
            </div>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} className={classes.cardPadding}>
        <div className="card-asset-action">
          <h3>Profile</h3>
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Request By</p>
              <p>{capitalizeFirstLetter("user")}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Departement</p>
              <p>{capitalizeFirstLetter("user")}</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Role</p>
              <p>{capitalizeFirstLetter("user")}</p>
            </div>
            <div className="col-3"></div>
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Area</p>
              <p>JKT- HO</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Sub Departement</p>
              <p>sub departement</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Status User</p>
              <p>{capitalizeFirstLetter("permanent")}</p>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
      </Grid>
    </>
  );
};

export default HistoryInformation;

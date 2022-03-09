import React, { useState, useEffect } from "react";

import {
  makeStyles,
  Grid,
  Breadcrumbs,
  Typography,
  Divider,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import "../../../assets/master.css";
import "../../../assets/asset_user.css";
import "../../asset/chips.css";

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

const FacilityReqDetail = () => {
  const classes = useStyles();
  const dataStorage = localStorage.getItem("ticketData");
  const parseObject = JSON.parse(dataStorage);
  const [dataRequest] = useState(parseObject);
  const [generalRequest] = useState(JSON.parse(dataRequest.general_request));

  console.log(generalRequest);

  return (
    <>
      <div className={classes.toolbar} />
      <br />
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        <span className={"span_crumb"}>Action Request</span>
        <Typography color="textPrimary">
          {dataRequest.facility_req_code}
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <h4>Personal Data</h4>
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
                <p className="label-asset text-center">Status</p>
                <p className="text-center">
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
                <p className="label-asset text-center">Date Create</p>
                <p className="text-center">{`${calbill(
                  dataRequest.createdAt
                )}`}</p>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <h4>General Request</h4>
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
                <p className="label-asset text-center">Status</p>
                <p className="text-center">
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
                <p className="label-asset text-center">Date Create</p>
                <p className="text-center">{`${calbill(
                  dataRequest.createdAt
                )}`}</p>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default FacilityReqDetail;

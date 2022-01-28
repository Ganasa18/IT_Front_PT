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
import ChatComponent from "../../asset/ChatComponent";

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

const ActionReqDetail = () => {
  const classes = useStyles();
  const dataStorage = localStorage.getItem("ticketData");
  const parseObject = JSON.parse(dataStorage);
  const [dataRequest] = useState(parseObject);

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
                <p className="label-asset">Description Of Problem</p>
                <p className="wrap-paraf">
                  {dataRequest.action_req_description}
                </p>
              </div>
              <div className="col-3">
                <p className="label-asset">Date</p>
                <p>{`${calbill(dataRequest.createdAt)}`}</p>
              </div>
              <div className="col-3"></div>
            </div>
          </div>
        </Grid>
        {dataRequest.status_id.id !== 7 ? (
          <>
            <Grid item xs={4}></Grid>
            <Grid item xs={8}>
              <ChatComponent />
            </Grid>
          </>
        ) : null}
      </Grid>
    </>
  );
};

export default ActionReqDetail;

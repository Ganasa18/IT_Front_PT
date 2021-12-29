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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
      {console.log(dataRequest)}
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
                <p>{dataRequest.action_req_description}</p>
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
              <div className="card-comment">
                <div className="card-title">
                  <h2>Comment</h2>
                </div>
                <div className="card-body">
                  <div className="container-chat">
                    {/* <div className="body-chat" id="style-2">
                  <div className="talk-bubble">
                    <span className="user-name">Username</span>
                    <div class="talktext">
                      <p>
                        Tesst asdawdawd awedagjkdawdgaaaaaaaaaaaaaaaaaaaaaaaaaaa
                      </p>
                    </div>
                    <span className="created">2 Okt 2021 | 10:33 </span>
                  </div>
                  <div className="talk-bubble-right">
                    <span className="user-name">Username</span>
                    <div class="talktext">
                      <p>
                        Hello Thereaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaa sdawdadw
                      </p>
                    </div>
                    <span className="created">2 Okt 2021 | 10:33 </span>
                  </div>
                </div> */}

                    {/* Empty Chat */}

                    <div className="empty-chat">
                      <div className="container">
                        <i
                          class="iconify icon-chat"
                          data-icon="bi:chat-left-dots-fill"></i>
                        <p>Waiting for comment</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="row">
                    <div className="col-10">
                      <span
                        className="iconify icon-attach"
                        data-icon="akar-icons:attach"></span>
                      <input type="text" className="input-field-comment" />
                    </div>
                    <div className="col-1">
                      <button className="button-send">
                        <i
                          class="iconify"
                          data-icon="fluent:send-16-filled"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
          </>
        ) : null}
      </Grid>
    </>
  );
};

export default ActionReqDetail;

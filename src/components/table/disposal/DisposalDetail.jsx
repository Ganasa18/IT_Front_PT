import React, { useState } from "react";

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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const DisposalDetail = () => {
  const classes = useStyles();
  const dataStorage = localStorage.getItem("disposalData");
  const parseObject = JSON.parse(dataStorage);
  const [dataDisposal] = useState(parseObject);

  return (
    <>
      <div className={classes.toolbar} />
      <br />
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        <span className={"span_crumb"}>Disposal Asset</span>
        <Typography color="textPrimary">
          {dataDisposal.disposal_code}
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset-action">
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Request Number</p>
                <p>{dataDisposal.disposal_code}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Disposal Name</p>
                <p>{dataDisposal.disposal_name}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Status</p>
                <p>
                  <span
                    class="chip-action"
                    style={{
                      background: `${dataDisposal.status_id.color_status}4C`,
                      color: `${dataDisposal.status_id.color_status}FF`,
                    }}>
                    {dataDisposal.status_id.status_name}
                  </span>
                </p>
              </div>
              <div className="col-3">
                <button className="btn-download-pdf" onClick={(e) => {}}>
                  <span class="iconify icon-btn" data-icon="fe:download"></span>
                  <span className="name-btn">Download PDF</span>
                </button>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col-3">
                <p className="label-asset">Date</p>
                <p>{`${calbill(dataDisposal.createdAt)}`}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Reason</p>
                <p>{dataDisposal.disposal_desc}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">PIC</p>
                <p>{dataDisposal.user_name}</p>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={3}></Grid>
    </>
  );
};

export default DisposalDetail;

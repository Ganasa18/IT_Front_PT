import React, { useState, useEffect } from "react";

import { makeStyles, Grid } from "@material-ui/core";
import axios from "axios";
import "../../../../../../assets/master.css";
import "../../../../../../assets/asset_user.css";
import "../../../../../asset/chips.css";
import Loader from "react-loader-spinner";

import {
  authEndPoint,
  pathEndPoint,
  invEndPoint,
  logsEndPoint,
} from "../../../../../../assets/menu";
import Cookies from "universal-cookie";
import HistoryAssetUserTable from "../../table/HistoryAssetUserTable";
import HistoryAssetDepartementTable from "../../table/HistoryAssetDepartementTable";

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

const HistoryInventory = (props) => {
  const classes = useStyles();
  const req_no = localStorage.getItem("req_no");
  const [ticketData, setTicketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { dateNow } = props;

  useEffect(() => {
    getDataHistory();
  }, [dateNow]);

  const getDataHistory = async () => {
    document.getElementById("overlay").style.display = "block";
    const logs = `${logsEndPoint[0].url}${
      logsEndPoint[0].port !== "" ? ":" + logsEndPoint[0].port : ""
    }/api/v1/logs-login/history-ar`;
    const requestOne = await axios.get(logs);
    axios
      .all([requestOne])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          let newDataLog = responseOne.data.data.log_ar;
          newDataLog = newDataLog.filter(
            (item) => item.request_number === req_no
          );
          newDataLog = newDataLog.filter((item) => item.createdAt === dateNow);
          setTicketData(newDataLog);
          setIsLoading(false);
          document.getElementById("overlay").style.display = "none";
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });

    // console.log(dateNow);
  };
  if (isLoading) {
    return (
      <div id="overlay">
        <Loader
          className="loading-data"
          type="Rings"
          color="#CECECE"
          height={550}
          width={80}
        />
      </div>
    );
  }

  return (
    <>
      <Grid item xs={12} className={classes.cardPadding}>
        <HistoryAssetUserTable
          dataAsset={`${
            !ticketData[0].inventory_update
              ? "null"
              : ticketData[0].inventory_update
          }`}
        />
      </Grid>
      <Grid item xs={12} className={classes.cardPadding}>
        <HistoryAssetDepartementTable
          dataAsset={`${
            !ticketData[0].inventory_departement_update
              ? "null"
              : ticketData[0].inventory_departement_update
          }`}
        />
      </Grid>
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
};

export default HistoryInventory;

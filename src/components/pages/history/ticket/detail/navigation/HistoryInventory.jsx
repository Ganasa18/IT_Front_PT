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
import HistoryAssetUserTable from "../../table/HistoryAssetUserTable";

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

const HistoryInventory = () => {
  const classes = useStyles();
  return (
    <>
      <Grid item xs={12} className={classes.cardPadding}>
        <HistoryAssetUserTable />
      </Grid>
    </>
  );
};

export default HistoryInventory;

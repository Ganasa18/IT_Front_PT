import React, { useState } from "react";
import { pathEndPoint } from "../../../assets/menu";

import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Backdrop,
  Fade,
  Modal,
  Snackbar,
} from "@material-ui/core";
import "../../../assets/master.css";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },

  headerMaster: {
    paddingLeft: "30px",
    paddingRight: "30px",
  },

  cardRoot: {
    fontSize: 12,
  },
}));

const GoodReceipt = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.toolbar} />
      <Grid container className={classes.headerMaster} spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom>
            Good Receipt
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className="card">
            <div className="row">
              <div className="col-4">
                <div className="input-container">
                  <span
                    className="iconify icon"
                    data-icon="bx:bx-search"></span>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Search..."
                  />
                </div>
              </div>
              <div className="col-4"></div>
              <div className="col-4"></div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={12}></Grid>
      </Grid>
    </>
  );
};

export default GoodReceipt;

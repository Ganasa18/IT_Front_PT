import React, { useState } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Backdrop,
  Fade,
  Modal,
  Divider,
} from "@material-ui/core";

import "../../../assets/master.css";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import { authEndPoint, pathEndPoint } from "../../../assets/menu";
import TablePurchaseDone from "../../table/purchase/TablePurchaseDone";

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
}));

const PurchaseDone = () => {
  const classes = useStyles();
  const [searchValue, SetSearchValue] = useState("");

  const handleSearch = (e) => {
    var typingTimer; //timer identifier
    var doneTypingInterval = 10000;
    clearTimeout(typingTimer);
    var value = e.target.value;
    if (value) {
      typingTimer = setTimeout(doneTyping(value), doneTypingInterval);
    }
  };

  function doneTyping(value) {
    SetSearchValue(value);
  }

  return (
    <>
      <div className={classes.toolbar} />
      <Grid container className={classes.headerMaster} spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom>
            Purchase Done
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
                    onChange={handleSearch}
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
        <Grid item xs={12} sm={12}>
          <div className="row">
            <TablePurchaseDone searchValue={searchValue} />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default PurchaseDone;

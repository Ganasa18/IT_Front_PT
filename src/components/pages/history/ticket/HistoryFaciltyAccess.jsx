import React, { useState } from "react";
import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Backdrop,
  Fade,
  Modal,
  Snackbar,
  Divider,
} from "@material-ui/core";
import "../../../../assets/master.css";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import { NavLink } from "react-router-dom";
import TicketManagementTable from "./table/TicketManagementTable";
import TicketManagementFacilityTable from "./table/TicketManagementFacilityTable";

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

  buttonAdd: {
    [theme.breakpoints.up("xl")]: {
      width: "150px",
      left: "60%",
      top: "20px",
    },

    [theme.breakpoints.down("lg")]: {
      width: "150px",
      left: "40%",
      top: "20px",
    },
    [theme.breakpoints.down("sm")]: {
      bottom: "20px",
      width: "120px",
    },
    fontSize: 12,
  },
  cardRoot: {
    fontSize: 12,
  },

  paper: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "50%",
    left: "50%",
    width: 950,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 6, 3),
  },
  marginBottomLink: {
    marginBottom: "30px",
  },
}));

const HistoryFaciltyAccess = () => {
  const classes = useStyles();
  let links = [
    {
      url: "/history/ticket",
      text: " Action Request",
    },
    {
      url: "/history/facility-access",
      text: " Fac & Acc",
    },
  ];

  return (
    <>
      <div className={classes.toolbar} />
      <Grid container className={classes.headerMaster} spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom>
            Ticket Managemenet
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12} className={classes.marginBottomLink}>
          {links.map(({ url, text, index }) => (
            <NavLink
              key={index}
              to={url}
              className={"navigation-tabs"}
              activeClassName="selected">
              {text}
            </NavLink>
          ))}
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
              <div className="col-4">
                <button className="filter-btn">Filter</button>
              </div>
              <div className="col-4"></div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className="row">
            <TicketManagementFacilityTable />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default HistoryFaciltyAccess;

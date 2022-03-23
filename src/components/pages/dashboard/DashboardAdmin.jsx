import React, { useState } from "react";

import { makeStyles, Grid, Typography } from "@material-ui/core";
import "../../../assets/master.css";
import ActionTicketTable from "../../table/ticket/ActionTicketTable";
import FacilityTicketTable from "../../table/ticket/FacilityTicketTable";

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
}));

const DashboardAdmin = () => {
  return (
    <>
      <Grid item xs={12} sm={12}>
        <div className="row">
          <ActionTicketTable />
        </div>
        <br />
        <br />
        <div className="row">
          <Typography variant="h5" style={{ marginLeft: "20px" }}>
            Facility & Access
          </Typography>
          <FacilityTicketTable />
        </div>
      </Grid>
    </>
  );
};

export default DashboardAdmin;

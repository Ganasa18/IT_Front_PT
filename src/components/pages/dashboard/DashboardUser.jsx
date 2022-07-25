import React, { useState } from "react";
import { makeStyles, Grid, Paper, Typography } from "@material-ui/core";
import "../../../assets/master.css";
import "../../../assets/dashboard.css";
import TableActionReq from "../../table/user/TableActionReq";
import FacilityTicketTable from "../../table/user/TableFacilityAcc";
import TableAssetUser from "../../table/user/TableAssetUser";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));

const DashboardUser = () => {
  const classes = useStyles();
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableAssetUser />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper style={{ padding: "50px" }}>
            <div className="row">
              <Typography variant="h5" style={{ marginLeft: "20px" }}>
                Action Request Ticket Status
              </Typography>
              <TableActionReq />
            </div>
            <br />
            <br />
            <br />
            <div className="row">
              <Typography variant="h5" style={{ marginLeft: "20px" }}>
                Facility & Access Ticket Status
              </Typography>
              <FacilityTicketTable />
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardUser;

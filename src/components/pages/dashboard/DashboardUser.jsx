import React, { useState } from "react";
import { makeStyles, Grid, Paper } from "@material-ui/core";
import "../../assets/master.css";
import "../../assets/dashboard.css";

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
      <div className={classes.toolbar} />
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>xs=12</Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>xs=12</Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default DashboardUser;

import React from "react";
import { makeStyles, Grid, Paper, Typography } from "@material-ui/core";
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
  headerMaster: {
    paddingLeft: "30px",
    paddingRight: "30px",
  },
}));

const Home = () => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.toolbar} />
      <Grid container className={classes.headerMaster} spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom>
            Dashboard
          </Typography>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <div className="card">
              <div className="container-head">
                <p className="title-card">Action Request Approval</p>
                <div className="grow"></div>
                <p>
                  <span
                    className="iconify icon-dashboard"
                    data-icon="wpf:approval"></span>
                </p>
              </div>
              <div className="container-body">
                <p className="total-request">10</p>
                <p className="total-title">Request need to approve</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="card">
              <div className="container-head">
                <p className="title-card">Facility & Access Approval</p>
                <div className="grow"></div>
                <p>
                  <span
                    className="iconify icon-dashboard"
                    data-icon="wpf:approval"></span>
                </p>
              </div>
              <div className="container-body">
                <p className="total-request">10</p>
                <p className="total-title">Request need to approve</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>xs=12 sm=6</Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>xs=12 sm=6</Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>xs=6 sm=3</Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>xs=6 sm=3</Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>xs=6 sm=3</Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper className={classes.paper}>xs=6 sm=3</Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;

import React from "react";
import { makeStyles, Grid, Paper, Typography } from "@material-ui/core";
import "../../assets/master.css";
import "../../assets/dashboard.css";
import Cookies from "universal-cookie";
import DashboardAdmin from "./dashboard/DashboardAdmin";
import DashboardLead from "./dashboard/DashboardLead";
import DashboardUser from "./dashboard/DashboardUser";
import DashboardManagement from "./dashboard/DashboardManagement";
import DashboardPurchase from "./dashboard/DashboardPurchase";
const cookies = new Cookies();
const roleUser = cookies.get("role");

console.log(roleUser);

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
          {roleUser === "1" ? (
            <>
              <Grid item xs={12}>
                <Paper style={{ padding: "50px" }}>
                  <Typography variant="h5" style={{ marginLeft: "5px" }}>
                    Action Request
                  </Typography>
                  <DashboardAdmin />
                </Paper>
              </Grid>
            </>
          ) : roleUser === "3" ? (
            <>
              <Grid item xs={12}>
                <DashboardLead />
              </Grid>
            </>
          ) : roleUser === "2" ? (
            <>
              <Grid item xs={12}>
                <DashboardUser />
              </Grid>
            </>
          ) : roleUser === "4" ? (
            <>
              <Grid item xs={12}>
                <DashboardManagement />
              </Grid>
            </>
          ) : roleUser === "5" || roleUser === "6" ? (
            <>
              <Grid item xs={12}>
                <DashboardPurchase />
              </Grid>
            </>
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;

import React from "react";
import { makeStyles, Grid, Paper } from "@material-ui/core";

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

const NotFound = () => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.toolbar} />
      <Grid container spacing={3}>
        <h2>Not Found</h2>
      </Grid>
    </div>
  );
};

export default NotFound;

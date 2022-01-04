import React, { useState } from "react";
import { makeStyles, Grid, Paper } from "@material-ui/core";
import "../../../assets/master.css";

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

const InputDisposal = ({ dataDisposal }) => {
  const classes = useStyles();

  return (
    <>
      <Grid item xs={5}>
        <label htmlFor="">Name Disposal</label>
        <input type="text" className="form-input" />
      </Grid>
      <Grid item xs={1}></Grid>
      <Grid item xs={5}>
        <label htmlFor="">Description</label>
        <textarea className="form-input-area" cols="30" rows="10"></textarea>
      </Grid>
      <Grid item xs={1}></Grid>
      <Grid item xs={8}>
        <div className="wrapper_dispos__status">
          <label className="label-inv" htmlFor="">
            Status
          </label>
          <Grid container spacing={3}>
            <div className="radio-disposal">
              <input
                type="radio"
                id="hilang"
                value={"hilang"}
                name="statusdis"
              />
              <label htmlFor="hilang" className="radio-label">
                Hilang
              </label>
            </div>
            <div className="radio-disposal">
              <input type="radio" id="rusak" value={"rusak"} name="statusdis" />
              <label htmlFor="rusak" className="radio-label">
                Rusak
              </label>
            </div>
            <div className="radio-disposal">
              <input
                type="radio"
                id="transfer"
                value={"transfer"}
                name="statusdis"
              />
              <label htmlFor="transfer" className="radio-label">
                Transfer
              </label>
            </div>
          </Grid>
        </div>
      </Grid>
      <Grid item xs={4}></Grid>
    </>
  );
};

export default InputDisposal;

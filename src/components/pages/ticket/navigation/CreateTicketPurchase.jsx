import React, { useState } from "react";
import { makeStyles, Grid, Typography, Divider } from "@material-ui/core";
import "../../../../assets/master.css";
import "../../../../assets/asset_user.css";
import "../.././../asset/chips.css";
import { NavLink } from "react-router-dom";

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

const CreateTicketPurchase = () => {
  const classes = useStyles();

  return (
    <>
      <Grid item xs={12} sm={12}>
        <Typography variant="h6" gutterBottom>
          Purchase Request
        </Typography>
      </Grid>
      <Divider />
      <br />
      <div className="row">
        <div className="col-6">
          <label htmlFor="">Fisik / Non Fisik</label>
          <div className="row">
            <div class="col-6">
              <div className="radio">
                <input
                  type="radio"
                  id="fisik"
                  value={"fisik"}
                  name="fisiknon"
                  checked
                />
                <label htmlFor="fisik" className="radio-label">
                  Fisik
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="radio">
                <input
                  type="radio"
                  id="nonfisik"
                  value={"nonfisik"}
                  name="fisiknon"
                />
                <label htmlFor="nonfisik" className="radio-label">
                  Non Fisik
                </label>
              </div>
            </div>
          </div>
          <br />
        </div>
        <div className="col-6"></div>
      </div>
      <div className="row">
        <div className="col-6">
          <label htmlFor="">Unit / Part</label>
          <div className="row">
            <div class="col-6">
              <div className="radio">
                <input
                  type="radio"
                  id="part"
                  value={"part"}
                  name="unit_parts"
                  checked
                />
                <label htmlFor="part" className="radio-label">
                  Unit
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="radio">
                <input
                  type="radio"
                  id="unit"
                  value={"unit"}
                  name="unit_parts"
                />
                <label htmlFor="unit" className="radio-label">
                  Part
                </label>
              </div>
            </div>
          </div>
          <br />
        </div>
        <div className="col-6"></div>
      </div>
      <div className="row">
        <div className="col-6">
          <label htmlFor="">User / Dept.</label>
          <div className="row">
            <div class="col-6">
              <div className="radio">
                <input
                  type="radio"
                  id="type_user"
                  value={"part"}
                  name="inventory_type"
                  checked
                />
                <label htmlFor="type_user" className="radio-label">
                  User
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="radio">
                <input
                  type="radio"
                  id="type_departement"
                  value={"unit"}
                  name="inventory_type"
                />
                <label htmlFor="type_departement" className="radio-label">
                  Departement
                </label>
              </div>
            </div>
          </div>
          <br />
        </div>
        <div className="col-6"></div>
      </div>
      <br />
    </>
  );
};

export default CreateTicketPurchase;

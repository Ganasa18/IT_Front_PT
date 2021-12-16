import React from "react";

import { makeStyles, Grid } from "@material-ui/core";

import "../../../../assets/master.css";
import "../../../../assets/asset_user.css";
import "../../../asset/chips.css";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },

  cardPadding: {
    marginTop: theme.spacing(5),
  },
}));

const InformationTicket = () => {
  const classes = useStyles();
  return (
    <>
      <Grid item xs={12} className={classes.cardPadding}>
        <div className="card-asset-action">
          <h3>Information</h3>
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Request Number</p>
              <p>412312312</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Asset Number</p>
              <p>MKDLTHO01</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Asset Name</p>
              <p>Laptop hp 123</p>
            </div>
            <div className="col-3">
              <p className="label-asset text-center">Status</p>
              <p className="text-center">
                <span
                  class="chip-action"
                  style={{
                    background: `#2196534C`,
                    color: `#219653FF`,
                  }}>
                  Open
                </span>
              </p>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Date</p>
              <p>10 Dec 2021</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Description Of Problem</p>
              <p>
                Pada saat nyalain laptop, layar warna biru, ditunggu 5 menit
                layar langsung mati
              </p>
            </div>
            <div className="col-3">
              <p className="label-asset">Approved By</p>
              <p>leader</p>
            </div>

            <div className="col-3"></div>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} className={classes.cardPadding}>
        <div className="card-asset-action">
          <h3>Profile</h3>
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Request By</p>
              <p>User A</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Departement</p>
              <p>MKDLTHO01</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Role</p>
              <p>Laptop hp 123</p>
            </div>
            <div className="col-3"></div>
          </div>
          <br />
          <div className="row">
            <div className="col-3">
              <p className="label-asset">Area</p>
              <p>Laptop hp 123</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Sub Departement</p>
              <p>Laptop hp 123</p>
            </div>
            <div className="col-3">
              <p className="label-asset">Status User</p>
              <p>Permanent</p>
            </div>
            <div className="col-3"></div>
          </div>
        </div>
      </Grid>
    </>
  );
};

export default InformationTicket;

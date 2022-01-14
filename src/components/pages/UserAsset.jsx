import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Grid,
  Breadcrumbs,
  Typography,
  Divider,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import "../../assets/master.css";
import "../../assets/asset_user.css";
import TableAssetUser from "../table/TableAssetUser";
import { Redirect } from "react-router-dom";
import TableUserDepartementAsset from "../table/TableUserDepartementAsset";

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

function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

const UserAsset = (props) => {
  const userData =
    props.location.query !== undefined ? props.location.query.row : null;
  const checkData = props.location.query;
  const classes = useStyles();

  if (checkData === undefined) {
    return <Redirect to="/master/user" />;
  }

  return (
    <>
      <div className={classes.toolbar} />
      <br />
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        <span onClick={() => props.history.goBack()} className={"span_crumb"}>
          Master User
        </span>
        <Typography color="textPrimary">
          {userData !== undefined
            ? userData.username.charAt(0).toUpperCase() +
              userData.username.slice(1)
            : ""}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.cardPadding}>
          <div className="card-asset">
            <h2>Profile</h2>
            <div className="row">
              <div className="col-2">
                <p className="label-asset">Name</p>
                <p>
                  {userData !== undefined ? titleCase(userData.username) : ""}
                </p>
              </div>
              <div className="col-3">
                <p className="label-asset">Email</p>
                <p>{userData.email}</p>
              </div>
              <div className="col-2">
                <p className="label-asset">No Hp</p>
                <p>{userData.no_handphone}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Role</p>
                <p>{userData.role_id.role_name}</p>
              </div>
              <div className="col-2">
                <p className="label-asset">Status</p>
                <p>{userData.employe_status}</p>
              </div>
            </div>
            <Divider style={{ marginTop: "5px", marginBottom: "5px" }} />
            <div className="row">
              <div className="col-2">
                <p className="label-asset">Area</p>
                <p>{userData.area_id.area_name}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Departement</p>
                <p>{userData.depart_id.name}</p>
              </div>
              <div className="col-3">
                <p className="label-asset">Sub Departement</p>
                <p>
                  {!userData.subdepart_id ? "null" : userData.subdepart_id.name}
                </p>
              </div>
            </div>
          </div>
        </Grid>
        <br />
        <Grid item xs={12}>
          <TableAssetUser dataUser={userData} />
        </Grid>
        <Grid item xs={12}>
          <TableUserDepartementAsset dataUser={userData} />
        </Grid>
      </Grid>
    </>
  );
};

export default UserAsset;

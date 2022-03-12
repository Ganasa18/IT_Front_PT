import React from "react";

import { makeStyles, Grid } from "@material-ui/core";

import "../../../../assets/master.css";
import "../../../../assets/asset_user.css";
import "../../../asset/chips.css";
import TableAssetUser from "../../../table/TableAssetUser";
import TableUserDepartementAsset from "../../../table/TableUserDepartementAsset";

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

const InventoryTicket = ({ dataTicket }) => {
  const classes = useStyles();

  return (
    <>
      <Grid item xs={12} className={classes.cardPadding}>
        <TableAssetUser dataUser={dataTicket} />
      </Grid>
      <Grid item xs={12} className={classes.cardPadding}>
        <TableUserDepartementAsset dataUser={dataTicket} />
      </Grid>
    </>
  );
};

export default InventoryTicket;

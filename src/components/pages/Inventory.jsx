import React, { useState, useEffect } from "react";

import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Backdrop,
  Fade,
  Modal,
  Divider,
} from "@material-ui/core";

import "../../assets/master.css";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import { authEndPoint, pathEndPoint } from "../../assets/menu";

import Cookies from "universal-cookie";
import TableInventory from "../table/TableInventory";
import CreateInventory from "./inventory/CreateInventory";

const cookies = new Cookies();

const token = cookies.get("token");

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

  buttonAdd: {
    [theme.breakpoints.up("xl")]: {
      width: "150px",
      left: "60%",
      top: "20px",
    },

    [theme.breakpoints.down("lg")]: {
      width: "150px",
      left: "40%",
      top: "20px",
    },
    [theme.breakpoints.down("sm")]: {
      bottom: "20px",
      width: "120px",
    },
    fontSize: 12,
  },
  cardRoot: {
    fontSize: 12,
  },

  paper: {
    position: "fixed",
    transform: "translate(-50%,-50%)",
    top: "45%",
    left: "50%",
    width: 850,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(4, 10, 4),
    [theme.breakpoints.down("lg")]: {
      transform: "translate(-50%,-45%)",
    },
  },

  cancelBtn: {
    color: "#EB5757",
    border: "1px solid #EB5757",
    width: "130px",
    height: "40px",
    fontSize: "13px",
    position: "relative",
    left: "0",
    transform: "translate(0%, -20%)",
    textTransform: "capitalize",
    [theme.breakpoints.down("lg")]: {
      width: "115px",
      height: "30px",
      fontSize: "11px",
    },
  },
}));

const Inventory = () => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [lastNumber, setLastNumber] = useState("");

  useEffect(() => {
    getInvLatestId();
  }, []);

  const modalPop = () => {
    setModalOpen(true);
  };

  const modalClose = () => {
    setModalOpen(false);
  };

  const getInvLatestId = async () => {
    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory/latestId`;

    await axios
      .get(inventory)
      .then((response) => {
        var text = response.data.data.inventory[0].asset_number;
        text = text.split("-")[1].trim();

        var numb = text.match(/\d/g);
        numb = numb.join("");
        numb = parseInt(numb) + 1;
        var str = "" + numb;
        var pad = "000";
        var ans = pad.substring(0, pad.length - str.length) + str;
        setLastNumber(ans);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <div className="row">
            <div className="col-10">
              <h3>Create Inventory</h3>
            </div>
            <div className="col-2">
              <p className="last-number">{lastNumber}</p>
            </div>
          </div>

          <Divider />
          <br />

          <CreateInventory />
          <Button
            className={classes.cancelBtn}
            onClick={modalClose}
            variant="outlined">
            Cancel
          </Button>
        </div>
      </Fade>
    </>
  );

  return (
    <>
      <div className={classes.toolbar} />
      <Grid container className={classes.headerMaster} spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom>
            Inventory
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className="card">
            <div className="row">
              <div className="col-4">
                <div className="input-container">
                  <span
                    className="iconify icon"
                    data-icon="bx:bx-search"></span>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Search..."
                  />
                </div>
              </div>
              <div className="col-4"></div>
              <div className="col-4">
                <Button
                  onClick={modalPop}
                  variant="contained"
                  color="primary"
                  className={classes.buttonAdd}
                  startIcon={<AddIcon />}>
                  Create New
                </Button>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className="row">
            <TableInventory />
          </div>
        </Grid>
      </Grid>
      <Modal
        open={modalOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModal}
      </Modal>
    </>
  );
};

export default Inventory;

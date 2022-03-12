import React, { useState } from "react";

import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Backdrop,
  Fade,
  Modal,
  Snackbar,
} from "@material-ui/core";

import "../../assets/master.css";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import { pathEndPoint } from "../../assets/menu";

import Cookies from "universal-cookie";
import MuiAlert from "@material-ui/lab/Alert";
import TableTrouble from "../table/TableTrouble";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
    top: "30%",
    left: "50%",
    width: 550,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Troubleshoot = () => {
  const classes = useStyles();

  const [modalOpen, setModalOpen] = useState(false);
  const [troubleName, setTroubleName] = useState("");
  const [toast, setToast] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(false);
  };

  const modalPop = () => {
    setModalOpen(true);
  };

  const modalClose = () => {
    setModalOpen(false);
  };

  const saveHandler = async (event) => {
    event.preventDefault();

    await axios.post(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/trouble`,
      {
        trouble_name: troubleName,
      }
    );
    setToast(true);
    setModalOpen(false);
    setTroubleName("");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <form onSubmit={saveHandler}>
            <div className="row">
              <div className="col-12">
                <h3>Add New Trouble</h3>
              </div>
              <div className="col-12">
                <label htmlFor="roleName">Name</label>
                <input
                  type="text"
                  id="troubleName"
                  value={troubleName}
                  className="form-input"
                  onChange={function (e) {
                    let value = e.target.value.toLowerCase();
                    value = value.replace(/[^A-Za-z]/gi, "");
                    setTroubleName(value);
                  }}
                />
              </div>
            </div>
            <br />
            <div className="footer-modal">
              <button className={"btn-cancel"} onClick={modalClose}>
                Cancel
              </button>
              <button className={"btn-submit"} type="submit">
                Submit
              </button>
            </div>
          </form>
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
            Master Troubleshoot
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
            <TableTrouble />
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
      <Snackbar
        autoHideDuration={5000}
        open={toast}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="success">
          submit successful
        </Alert>
      </Snackbar>
    </>
  );
};

export default Troubleshoot;

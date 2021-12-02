import React, { useState } from "react";

import {
  makeStyles,
  Grid,
  Typography,
  Button,
  Backdrop,
  Fade,
  Modal,
} from "@material-ui/core";

import "../../assets/master.css";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import { authEndPoint } from "../../assets/menu";
import TableRole from "../table/TableRole";
import Cookies from "universal-cookie";
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
    top: "30%",
    left: "50%",
    width: 550,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Roles = () => {
  const classes = useStyles();

  const [modalOpen, setModalOpen] = useState(false);
  const [roleName, setRoleName] = useState("");

  const modalPop = () => {
    setModalOpen(true);
  };

  const saveHandler = async (event) => {
    event.preventDefault();

    await axios.post(
      `${authEndPoint[0].url}${
        authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
      }/api/v1/role`,
      {
        role_name: roleName,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setModalOpen(false);
    setRoleName("");
  };

  const modalClose = () => {
    setModalOpen(false);
  };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <form onSubmit={saveHandler}>
            <div className="row">
              <div className="col-12">
                <h3>Add Role</h3>
              </div>
              <div className="col-12">
                <label htmlFor="roleName">Name</label>
                <input
                  type="text"
                  id="roleName"
                  value={roleName}
                  className="form-input"
                  onChange={function (e) {
                    let value = e.target.value.toLowerCase();
                    value = value.replace(/[^A-Za-z]/gi, "");
                    setRoleName(value);
                  }}
                />
              </div>
            </div>
            <br />
            <div className="footer-modal">
              <button onClick={modalClose}>Close</button>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </Fade>
    </>
  );

  return (
    <div>
      <div className={classes.toolbar} />

      <Grid container className={classes.headerMaster} spacing={3}>
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" gutterBottom>
            Master Role
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
            <TableRole />
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
    </div>
  );
};

export default Roles;

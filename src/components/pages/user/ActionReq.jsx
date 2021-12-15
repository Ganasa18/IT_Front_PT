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
  Divider,
} from "@material-ui/core";
import "../../../assets/master.css";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import TableActionReq from "../../table/user/TableActionReq";

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
    top: "50%",
    left: "50%",
    width: 950,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 6, 3),
  },
}));

// const readImg = (file) => {
//   if (file.files && file.files[0]) {
//     var reader = new FileReader();
//     console.log(reader);
//   }
// };

const handleImage = () => {
  const labelImg = document.getElementById("labelImg");
  labelImg.click();
};

const ActionReq = () => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  const modalPop = () => {
    setModalOpen(true);
  };

  const modalClose = () => {
    setModalOpen(false);
  };

  function handleChangeImg(e) {
    const output = document.getElementById("idimg");
    const icon = document.querySelector(".wrapper-img .icon");

    if (e.target.files.length !== 0) {
      icon.style.display = "none";
      output.src = URL.createObjectURL(e.target.files[0]);
    }

    output.onload = function () {
      URL.revokeObjectURL(output.src); // free memory
    };
  }

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <form>
            <div className="row">
              <div className="col-12">
                <h3>Create Action Request</h3>
              </div>
            </div>
            <Divider />
            <br />
            <div className="row margin-top">
              <div className="col-6">
                <label htmlFor="">My Asset</label>
                <input type="text" className="form-input" />
              </div>
              <div className="col-6">
                <label htmlFor="">Description Of Problem(Chronological)</label>
                <textarea
                  className="form-input-area"
                  id=""
                  cols="30"
                  rows="10"></textarea>
              </div>
            </div>
            <div className="row">
              <div className="col-6 position-image">
                <label htmlFor="filesImg" id="labelImg">
                  Image
                </label>
                <input
                  accept="image/jpg,image/png,image/jpeg"
                  type="file"
                  className="image-req"
                  id="filesImg"
                  onChange={handleChangeImg.bind(this)}
                />
                <div className="wrapper-img" onClick={handleImage}>
                  <div className="image">
                    <img id="idimg" />
                  </div>
                  <div class="icon">
                    <i class="iconify" data-icon="bi:image"></i>
                  </div>
                </div>
              </div>
            </div>

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
            Action Request
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
              <div className="col-4">
                <button className="filter-btn">Filter</button>
              </div>
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
            <TableActionReq />
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

export default ActionReq;

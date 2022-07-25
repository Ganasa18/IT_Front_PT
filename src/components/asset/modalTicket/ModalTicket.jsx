import React, { useState, useEffect } from "react";
import { makeStyles, Backdrop, Fade, Modal } from "@material-ui/core";
import "../../../assets/master.css";
import { useDispatch, useSelector } from "react-redux";
import {
  updateTicketResponded,
  updateTicketRespondedFacility,
} from "../../redux/action/global";
import Loader from "react-loader-spinner";

const useStyles = makeStyles((theme) => ({
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

const ModalTicket = () => {
  const classes = useStyles();
  const { globalReducer } = useSelector((state) => state);
  const req_no = localStorage.getItem("req_no");
  const modalTicket = globalReducer.isModalTicketReq;
  const commentTicket = globalReducer.commentTicket;
  const userAdmin = globalReducer.userOnly;
  const dispatch = useDispatch();

  const bodyModal = (
    <>
      <Fade in={modalTicket}>
        <div className={classes.paper}>
          <div className="row">
            <div className="col-12">
              <h3>Ticket</h3>
            </div>
            <div className="col-12">
              <label htmlFor="">Comment</label>
              <textarea
                onChange={(e) =>
                  dispatch({
                    type: "SET_COMMENT_REQUEST",
                    value: e.target.value,
                  })
                }
                className={"form-input-area"}
                rows="4"
                cols="50"></textarea>
            </div>
          </div>
          <br />
          <div className="footer-modal">
            <button
              className={"btn-cancel"}
              onClick={() =>
                dispatch({ type: "SET_MODAL_REQUEST", value: false })
              }>
              Cancel
            </button>
            <button
              className={"btn-submit"}
              onClick={() => {
                if (req_no.replace(/[0-9]/g, "") === "MKDFR") {
                  dispatch(
                    updateTicketRespondedFacility(
                      userAdmin,
                      commentTicket,
                      req_no
                    )
                  );
                  return;
                }
                dispatch(
                  updateTicketResponded(userAdmin, commentTicket, req_no)
                );
              }}>
              Submit
            </button>
          </div>
        </div>
      </Fade>
      <div id="overlay">
        <Loader
          className="loading-data"
          type="Rings"
          color="#CECECE"
          height={550}
          width={80}
        />
      </div>
    </>
  );

  return (
    <>
      <Modal
        open={modalTicket}
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

export default ModalTicket;

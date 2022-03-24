import React, { useState } from "react";
import "../../assets/master.css";
import "../../assets/asset_user.css";
import { FacEndPoint } from "../../assets/menu";
import { makeStyles, Modal, Backdrop, Fade, Divider } from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: (props) => ({
    padding: "6px 8px",
    borderRadius: "5px",
    fontSize: 10,
    margin: "0 10px",
    outline: "none",
    border: "1px solid" + props.backgroundColor + "FF",
    color: props.colorName + "FF",
    background: "transparent",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: props.backgroundColor + "4C",
      color: props.colorName + "FF",
    },
    "&:active": {
      backgroundColor: props.backgroundColor + "4C",
      color: props.colorName + "FF",
    },
  }),
  rootActive: (props) => ({
    padding: "6px 8px",
    borderRadius: "5px",
    fontSize: 10,
    margin: "0 10px",
    outline: "none",
    border: "1px solid" + props.backgroundColor + "FF",
    backgroundColor: props.backgroundColor + "4C",
    color: props.colorName + "FF",
  }),

  paper: {
    position: "fixed",
    transform: "translate(-50%,-60%)",
    top: "54%",
    left: "50%",
    width: 1200,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(4, 10, 4),
    [theme.breakpoints.down("lg")]: {
      transform: "translate(-50%,-45%)",
      width: 700,
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
    transform: "translate(35%, -40%)",
  },
}));

const ButtonStatusFacility = (styleProps) => {
  const props = {
    colorName: styleProps.colorName,
    backgroundColor: styleProps.backgroundColor,
  };

  const classes = useStyles(props);
  const [buttonType, setButtonType] = useState("");
  const [idStatus, setIdStatus] = useState(null);
  const [idRequest, setIdRequest] = useState(null);
  const [modalOpenDefault, setModalOpenDefault] = useState(false);

  const disbledButton = async (props, data) => {
    const button = document.querySelector(`#buttonCheck-${props}`);
    setButtonType(button.innerHTML);

    if (data.status_id.id === props || button.innerHTML === "open") {
      button.setAttribute("disabled", true);
      button.style.cursor = "not-allowed";
      return;
    }

    if (data.status_id.id === 4) {
      if (button.innerHTML === "purchase") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      return;
    }

    if (data.status_id.id === 12) {
      if (button.innerHTML === "request") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      return;
    }

    if (data.status_id.id === 21) {
      if (button.innerHTML === "on progress") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      if (button.innerHTML === "purchase") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      return;
    }

    if (
      data.status_id.id === 8 ||
      data.status_id.id === 11 ||
      data.status_id.id === 19
    ) {
      button.setAttribute("disabled", true);
      button.style.cursor = "not-allowed";
      return;
    }
  };

  const statusChange = async (props, data) => {
    setIdStatus(props);
    setIdRequest(data.id);
    setModalOpenDefault(true);
  };

  const submitStatus = async () => {
    let ticket = `${FacEndPoint[0].url}${
      FacEndPoint[0].port !== "" ? ":" + FacEndPoint[0].port : ""
    }/api/v1/facility-req/updated-ticket-status/${idRequest}`;

    await axios
      .patch(ticket, {
        status_id: parseInt(idStatus),
      })
      .then((response) => {
        alert(response.data.status);
        setTimeout(() => {
          setIdStatus(null);
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
      });

    // console.log(idStatus);
    // console.log(idRequest);
  };

  const modalClose = () => {
    setModalOpenDefault(false);
  };

  const bodyModalDefault = (
    <>
      <Fade in={modalOpenDefault}>
        <div className={classes.paper}>
          <h3>Are you sure want to changed status request</h3>
          <Divider />
          <br />
          <div className="footer-modal">
            <button className="btn-cancel" onClick={modalClose}>
              Cancel
            </button>
            <button className="btn-submit" onClick={submitStatus}>
              Submit
            </button>
          </div>
        </div>
      </Fade>
    </>
  );

  return (
    <>
      <button
        onMouseEnter={() => disbledButton(styleProps.idStatus, styleProps.data)}
        id={`buttonCheck-${styleProps.idStatus}`}
        onClick={() => statusChange(styleProps.idStatus, styleProps.data)}
        className={`${
          styleProps.status === styleProps.nameBtn
            ? classes.rootActive
            : classes.root
        }`}>
        {styleProps.nameBtn}
      </button>
      <Modal
        open={modalOpenDefault}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModalDefault}
      </Modal>
    </>
  );
};

export default ButtonStatusFacility;

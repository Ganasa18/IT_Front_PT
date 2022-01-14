import React, { useState } from "react";
import "../../assets/master.css";
import "../../assets/asset_user.css";
import { pathEndPoint, prEndPoint, invEndPoint } from "../../assets/menu";
import {
  makeStyles,
  Modal,
  Backdrop,
  Fade,
  Button,
  Divider,
} from "@material-ui/core";
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

const StatusButton = (styleProps) => {
  const props = {
    colorName: styleProps.colorName,
    backgroundColor: styleProps.backgroundColor,
  };
  const classes = useStyles(props);
  const req_no = localStorage.getItem("req_no");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen2, setModalOpen2] = useState(false);
  const [modalOpenDefault, setModalOpenDefault] = useState(false);
  const [buttonType, setButtonType] = useState("");
  const [idRequest, setIdRequest] = useState(null);
  const [idStatus, setIdStatus] = useState(null);
  const [troubleTitle, setTroubleTitle] = useState("");
  const [remark, setRemark] = useState("");

  const statusChange = async (props, data) => {
    setIdStatus(props);
    setIdRequest(data.action_req_code);
    if (buttonType === "troubleshoot") {
      setModalOpen2(true);
      return;
    }
    if (buttonType === "closed") {
      setModalOpen(true);
      return;
    }

    // if (buttonType === "damaged") {
    //   alert("damaged");
    //   return;
    // }
    setModalOpenDefault(true);

    // console.log(props, data);
    // const button = document.querySelector(`#buttonCheck-${props}`);
  };

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
      if (button.innerHTML === "purchase") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      return;
    }

    if (data.status_id.id === 9) {
      if (button.innerHTML === "damaged") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }

      if (button.innerHTML === "purchase") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      return;
    }

    if (data.status_id.id === 13) {
      if (button.innerHTML === "troubleshoot") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      if (button.innerHTML === "damaged") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      if (button.innerHTML === "on progress") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }

      if (button.innerHTML === "closed") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      if (button.innerHTML === "purchase") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }

      return;
    }

    if (data.status_id.id === 14) {
      if (button.innerHTML === "troubleshoot") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      if (button.innerHTML === "damaged") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      if (button.innerHTML === "on progress") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }

      if (button.innerHTML === "closed") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      if (button.innerHTML === "purchase") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }

      if (button.innerHTML === "in order") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }

      return;
    }

    if (data.status_id.id === 15) {
      if (button.innerHTML === "troubleshoot") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      if (button.innerHTML === "damaged") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }
      if (button.innerHTML === "on progress") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }

      if (button.innerHTML === "purchase") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }

      if (button.innerHTML === "in order") {
        button.setAttribute("disabled", true);
        button.style.cursor = "not-allowed";
      }

      return;
    }

    if (
      data.status_id.id === 8 ||
      data.status_id.id === 19 ||
      data.status_id.id === 11
    ) {
      button.setAttribute("disabled", true);
      button.style.cursor = "not-allowed";
      return;
    }
  };

  const modalClose = () => {
    setModalOpen(false);
    setModalOpen2(false);
    setModalOpenDefault(false);
  };

  const submitStatus = async () => {
    let ticket = `${invEndPoint[0].url}${
      invEndPoint[0].port !== "" ? ":" + invEndPoint[0].port : ""
    }/api/v1/action-req/updated-ticket-status/${idRequest}`;

    await axios
      .patch(ticket, {
        status_id: idStatus,
        trouble_title: troubleTitle,
        trouble_detail: buttonType === "troubleshoot" ? remark : null,
        close_remark: buttonType === "closed" ? remark : null,
      })
      .then((response) => {
        alert(response.data.status);
        setTimeout(() => {
          setIdRequest(null);
          setIdStatus(null);
          setTroubleTitle("");
          setRemark("");
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
      });

    // console.log(idStatus);
    // console.log(idRequest);
  };

  const submitTrouble = async () => {
    console.log(troubleTitle);
    console.log(remark);
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

  const bodyModal1 = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <h3>Are you sure want to close this request</h3>
          <Divider />
          <br />

          <div className="row">
            <div className="col-12">
              <p className="comment-pop-title-2">Remark</p>
            </div>
            <div className="col-12">
              <textarea
                className="form-input-area"
                placeholder="Comment here... "
                cols="30"
                rows="10"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}></textarea>
            </div>
          </div>
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

  const bodyModal2 = (
    <>
      <Fade in={modalOpen2}>
        <div className={classes.paper}>
          <h3>Troubleshoot</h3>
          <Divider />
          <br />

          <div className="row">
            <div className="col-12">
              <p className="comment-pop-title-2">What’s the problem?</p>
            </div>
            <div className="col-12">
              <input
                type="text"
                className="form-input"
                value={troubleTitle}
                onChange={(e) => setTroubleTitle(e.target.value)}
              />
            </div>
            <div className="col-12">
              <p className="comment-pop-title-2">Remark</p>
            </div>
            <div className="col-12">
              <textarea
                className="form-input-area"
                placeholder="Comment here... "
                cols="30"
                rows="10"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}></textarea>
            </div>
          </div>
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
        id={`buttonCheck-${styleProps.idStatus}`}
        // onClick={() => alert(styleProps.idStatus)}
        onClick={() => statusChange(styleProps.idStatus, styleProps.data)}
        onMouseEnter={() => disbledButton(styleProps.idStatus, styleProps.data)}
        className={`${
          styleProps.status === styleProps.nameBtn
            ? classes.rootActive
            : classes.root
        }`}>
        {styleProps.nameBtn}
      </button>
      <Modal
        open={modalOpen}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModal1}
      </Modal>
      <Modal
        open={modalOpen2}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        {bodyModal2}
      </Modal>

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

export default StatusButton;

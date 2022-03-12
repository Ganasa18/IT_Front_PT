import React, { useState } from "react";
import "../../assets/master.css";
import "../../assets/asset_user.css";
import { invEndPoint } from "../../assets/menu";
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

  const disbledButton = async (props, data) => {
    const button = document.querySelector(`#buttonCheck-${props}`);
    setButtonType(button.innerHTML);

    if (data.status_id.id === props || button.innerHTML === "open") {
      button.setAttribute("disabled", true);
      button.style.cursor = "not-allowed";
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

  return (
    <>
      <button
        onMouseEnter={() => disbledButton(styleProps.idStatus, styleProps.data)}
        id={`buttonCheck-${styleProps.idStatus}`}
        className={`${
          styleProps.status === styleProps.nameBtn
            ? classes.rootActive
            : classes.root
        }`}>
        {styleProps.nameBtn}
      </button>
    </>
  );
};

export default ButtonStatusFacility;

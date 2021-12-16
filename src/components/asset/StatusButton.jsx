import React from "react";
import "../../assets/master.css";
import "../../assets/asset_user.css";
import { makeStyles } from "@material-ui/core";

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
}));

const StatusButton = (styleProps) => {
  const props = {
    colorName: styleProps.colorName,
    backgroundColor: styleProps.backgroundColor,
  };
  const classes = useStyles(props);
  return (
    <>
      <button
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

export default StatusButton;

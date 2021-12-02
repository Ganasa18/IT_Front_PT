import React, { useState } from "react";
import { makeStyles, Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  buttonAdd: {
    [theme.breakpoints.up("xl")]: {
      width: "170px",
      left: "60%",
      top: "20px",
    },

    [theme.breakpoints.down("lg")]: {
      width: "170px",
      left: "40%",
      top: "20px",
    },
    [theme.breakpoints.down("sm")]: {
      bottom: "20px",
      width: "120px",
    },
    fontSize: 12,
  },
}));

const ButtonComponent = (props) => {
  const classes = useStyles();

  return (
    <Button
      variant="contained"
      color="secondary"
      className={classes.buttonAdd}
      startIcon={<AddIcon />}>
      {props.children}
    </Button>
  );
};

export default ButtonComponent;

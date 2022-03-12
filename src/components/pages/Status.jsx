import React, { useState } from "react";
import { Panel as ColorPickerPanel } from "rc-color-picker";
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
import MuiAlert from "@material-ui/lab/Alert";
import AddIcon from "@material-ui/icons/Add";
import "rc-color-picker/assets/index.css";
import TableStatus from "../table/TableStatus";
import axios from "axios";
import { pathEndPoint } from "../../assets/menu";

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

const Status = () => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [color, setColor] = useState(false);
  const [thiscolor, setThisColor] = useState("");
  const [statusName, setStatusName] = useState("");
  const [toast, setToast] = useState(false);

  const colorHex = React.useRef(null);

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
    setColor(false);
  };

  function handlePick() {
    setColor((prevSelected) => !prevSelected);
  }

  const changeHandler = (colors) => {
    setThisColor(colors.color);
    colorHex.current.value = thiscolor;
  };

  const setColorType = (event) => {
    const colorType = event.target.value;

    setThisColor(colorType);
  };

  const saveHandler = async (event) => {
    event.preventDefault();

    await axios.post(
      `${pathEndPoint[0].url}${
        pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
      }/api/v1/status`,
      {
        status_name: statusName,
        color_status: thiscolor,
      }
    );

    // setGetData([
    //   ...getData,
    //   {
    //     id: generateId(),
    //     status_name: statusName,
    //     color_status: thiscolor,
    //   },
    // ]);
    setToast(true);
    setModalOpen(false);
    setColor(false);
  };

  // function generateId() {
  //   return Date.now();
  // }

  // const modalSubmit = () => {
  //   const statusName = document.getElementById("statusName").value;
  //   const colorHex = document.getElementById("color-hex").value;
  // };

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <form onSubmit={saveHandler}>
            <div className="row">
              <div className="col-12">
                <h3>Title Header</h3>
              </div>
              <div className="col-12">
                <label htmlFor="">Status Name</label>
                <input
                  type="text"
                  id="statusName"
                  className="form-input"
                  value={statusName}
                  onChange={function (e) {
                    setStatusName(e.target.value);
                  }}
                />
              </div>
              <div className="col-1">
                <ColorPickerPanel
                  color={thiscolor}
                  className={`color-pick ${color ? "active" : ""}`}
                  enableAlpha={true}
                  onChange={changeHandler}
                  mode="RGB"
                />
                <button
                  type="button"
                  className=" button-color"
                  style={{ background: thiscolor }}
                  onClick={handlePick}></button>
              </div>
              <div className="col-1"></div>
              <div className="col-6">
                <input
                  type="text"
                  className="form-input"
                  ref={colorHex}
                  value={thiscolor}
                  onChange={setColorType}
                />
              </div>
            </div>
            <br />
            <div className="footer-modal">
              <button className="btn-cancel" onClick={modalClose}>
                Cancel
              </button>
              <button className="btn-submit" type="submit">
                Submit
              </button>
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
            Master Status
          </Typography>
        </Grid>
        <Grid item xs={12} sm={12}>
          <div className="card">
            <div className="row">
              <div className="col-4"></div>
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
            <TableStatus />
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
    </div>
  );
};

export default Status;

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
import TableCategory from "../table/TableCategory";
import StepperComponent from "../asset/category/StepperComponent";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useDispatch, useSelector } from "react-redux";
import { exportListCategory } from "../redux/action";

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
    width: 850,
    display: "block",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    padding: theme.spacing(2, 4, 3),
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

const Category = () => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchValue, SetSearchValue] = useState("");
  const dispatch = useDispatch();

  const modalPop = () => {
    setModalOpen((prevSelected) => !prevSelected);
  };

  const handleSearch = (e) => {
    var typingTimer; //timer identifier
    var doneTypingInterval = 10000;
    clearTimeout(typingTimer);
    var value = e.target.value;
    if (value) {
      typingTimer = setTimeout(doneTyping(value), doneTypingInterval);
    }
  };

  function doneTyping(value) {
    SetSearchValue(value);
  }

  const bodyModal = (
    <>
      <Fade in={modalOpen}>
        <div className={classes.paper}>
          <StepperComponent />
          <Button
            className={classes.cancelBtn}
            onClick={modalPop}
            variant="outlined">
            Cancel
          </Button>
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
            Master Category
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
                    onChange={handleSearch}
                    className="input-field"
                    type="text"
                    placeholder="Search..."
                  />
                </div>
              </div>
              <div className="col-4"></div>
              <div className="col-4">
                <Button
                  onClick={() => dispatch(exportListCategory())}
                  variant="contained"
                  color="primary"
                  className={classes.buttonAdd}
                  startIcon={<GetAppIcon />}>
                  Export
                </Button>
              </div>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={12}>
          <div className="row">
            <TableCategory searchValue={searchValue} />
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

export default Category;

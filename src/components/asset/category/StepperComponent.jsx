import React, { useState, useEffect } from "react";

import { pathEndPoint } from "../../../assets/menu";

import "../../../assets/master.css";
import {
  makeStyles,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Divider,
  Snackbar,
} from "@material-ui/core";
import axios from "axios";

import MuiAlert from "@material-ui/lab/Alert";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
    textTransform: "capitalize",
    position: "absolute",
    width: "130px",
    height: "40px",
    right: "0%",
    transform: "translate(-185%, 50%)",
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  step_label_root: {
    fontSize: "14px",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
  btnNext: {
    textTransform: "capitalize",
    position: "relative",
    width: "130px",
    height: "40px",
    left: "0",
    transform: "translate(475%, 50%)",
  },

  iconContainer: {
    transform: "scale(1.6)",
  },
}));

function getSteps() {
  return ["Category", "Sub Category"];
}

const StepperComponent = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [toast, setToast] = useState(false);

  const [lastCategoryId, setLastCategoryId] = useState(null);

  useEffect(() => {
    getLatestId();
  }, []);

  const getLatestId = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/category`
      )
      .then((response) => {
        const dataCategory = response.data.data.category;
        setLastCategoryId(dataCategory.shift().id);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      const category = document.getElementById("categoryName");

      if (category.value !== "") {
        await axios
          .post(
            `${pathEndPoint[0].url}${
              pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
            }/api/v1/category`,
            {
              category_name: category.value,
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        return alert("Please Fill Empty Form");
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    if (activeStep === 1) {
      var categoryId = document.getElementById("categoryId");
      var lis = document.getElementById("fields").getElementsByTagName("li");

      var arr = [...lis];
      arr.forEach((element) => {
        axios.post(
          `${pathEndPoint[0].url}${
            pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
          }/api/v1/subcategory/`,
          {
            subcategory_name: element.children[0].value,
            id_category: parseInt(categoryId.value),
          }
        );
      });
      setToast(true);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(false);
  };

  return (
    <>
      <div className={classes.root}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                classes={{
                  label: classes.step_label_root,
                  iconContainer: classes.iconContainer,
                }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>
                All steps completed
              </Typography>
            </div>
          ) : (
            <div>
              <Typography className={classes.instructions}>
                {getStepContent(activeStep, lastCategoryId)}
              </Typography>
              <div style={{ marginTop: "60px" }}>
                {activeStep === 0 ? null : (
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.backButton}
                    variant="outlined"
                    color="primary">
                    Back
                  </Button>
                )}

                {/* <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.backButton}
                  variant="outlined"
                  color="primary">
                  Back
                </Button> */}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.btnNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Snackbar
        autoHideDuration={5000}
        open={toast}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleClose} severity="success">
          submit successful
        </Alert>
      </Snackbar>
    </>
  );
};

var count = 0;

function createInput() {
  var field_area = document.getElementById("fields");
  var li = document.createElement("li");
  li.className = "box";
  var input = document.createElement("input");
  input.id = "field" + count;
  input.name = "field" + count;
  input.className = "input-field-pop-add";
  input.type = "text"; //Type of field - can be any valid input type like text,file,checkbox etc.
  li.appendChild(input);
  field_area.appendChild(li);
  //create the removal link
  var removalLink = document.createElement("button");
  removalLink.className = "remove input-group-button";
  removalLink.onclick = function () {
    field_area.removeChild(li);
  };
  removalLink.appendChild(document.createTextNode("X"));
  li.appendChild(removalLink);
  count++;
}

function getStepContent(stepIndex, lastCategoryId) {
  switch (stepIndex) {
    case 0:
      return (
        <>
          <div className="row">
            <div className="col-12">
              <Divider />
              <div className="row">
                <div className="col-6">
                  <input
                    type="text"
                    id="categoryName"
                    className="form-input-pop"
                    placeholder="Category Name"
                  />
                </div>
                <div className="col-6"></div>
              </div>
            </div>
          </div>
        </>
      );
    case 1:
      return (
        <>
          <div className="row">
            <div className="col-12">
              <Divider />
              <div className="row">
                <button className="input-create-element" onClick={createInput}>
                  Add Field
                </button>
              </div>
              <input type="hidden" id="categoryId" value={lastCategoryId + 1} />

              <ul id="fields" className="ul-list">
                <li className="box">
                  <input
                    id={`field${count}`}
                    name={`field${count}`}
                    type="text"
                    className="input-field-pop-add"
                  />
                </li>
              </ul>
            </div>
          </div>
        </>
      );
    default:
      return "Unknown stepIndex";
  }
}

export default StepperComponent;

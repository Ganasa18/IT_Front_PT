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
  instructions2: {
    marginTop: theme.spacing(20),
    marginBottom: theme.spacing(20),
  },
  step_label_root: {
    fontSize: "14px",
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

  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
}));

function getSteps() {
  return ["Category", "Sub Category"];
}

const StepperEdit = (props) => {
  const { dataCategory } = props;
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [categoryEdit] = useState(dataCategory);
  const [subCategoryEdit, setSubCategoryEdit] = useState(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    getSubCategoryList();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToast(false);
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      const categoryId = document.getElementById("categoryId");
      const category = document.getElementById("categoryName");

      if (category.value !== "") {
        await axios
          .patch(
            `${pathEndPoint[0].url}${
              pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
            }/api/v1/category/${categoryId.value}`,
            {
              category_name: category.value,
            }
          )
          .then((response) => {
            // console.log(response);
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
      const categoryId = document.getElementById("categoryId");
      var selectId = document.querySelectorAll(".editfieldbox");
      var addField = document.querySelectorAll("input.addfield");
      var arr = [...selectId];
      var arr2 = [...addField];

      arr.forEach((element) => {
        axios.post(
          `${pathEndPoint[0].url}${
            pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
          }/api/v1/subcategory/`,
          {
            id: parseInt(element.children[0].value),
            subcategory_name: element.children[1].value,
            id_category: parseInt(categoryId.value),
          }
        );
      });

      if (arr2.length !== 0) {
        arr2.forEach((element) => {
          axios.post(
            `${pathEndPoint[0].url}${
              pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
            }/api/v1/subcategory/`,
            {
              subcategory_name: element.value,
              id_category: parseInt(categoryId.value),
            }
          );
        });
      }
      setToast(true);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getSubCategoryList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/subcategory`
      )
      .then((response) => {
        const subdata = response.data.data.subcategory;

        const obj = subdata.filter(
          (item) => item.id_category === categoryEdit.id
        );

        setSubCategoryEdit(obj);
      })
      .catch((error) => {
        console.log(error);
        setSubCategoryEdit([]);
      });
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
              <Typography className={classes.instructions2}>
                All steps completed
              </Typography>
            </div>
          ) : (
            <div>
              <Typography className={classes.instructions}>
                {getStepContent(activeStep, categoryEdit, subCategoryEdit)}
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

  input.className = "input-field-pop-add addfield";
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

const deleteSubCategory = async (row) => {
  if (window.confirm("Delete the item?")) {
    await axios
      .delete(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/subcategory/${row}`
      )
      .then((response) => {
        alert(response.data.status);
        console.log(response.data.status);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

function getStepContent(stepIndex, categoryEdit, subCategoryEdit) {
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
                    type="hidden"
                    id="categoryId"
                    value={categoryEdit.id}
                  />
                  <input
                    defaultValue={categoryEdit.category_name}
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
              <input
                type="hidden"
                id="categoryId"
                defaultValue={categoryEdit.id}
                className="hiddenSubs"
              />
              <ul id="fields" className="ul-list">
                {subCategoryEdit.length > 0 ? (
                  subCategoryEdit.map((subs, index) => (
                    <li className="box editfieldbox">
                      <input type="hidden" value={subs.id} id="idSubCategory" />
                      <input
                        id={`editfield${count + index}`}
                        name={`editfield${count + index}`}
                        type="text"
                        className="input-field-pop-add"
                        defaultValue={subs.subcategory_name}
                      />
                      <button
                        class="remove input-group-button"
                        onClick={(e) => deleteSubCategory(subs.id)}>
                        X
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="box">
                    <input
                      id={`field${count}`}
                      name={`field${count}`}
                      type="text"
                      className="input-field-pop-add addfield"
                    />
                  </li>
                )}
              </ul>
            </div>
          </div>
        </>
      );
    default:
      return "Unknown stepIndex";
  }
}

export default StepperEdit;

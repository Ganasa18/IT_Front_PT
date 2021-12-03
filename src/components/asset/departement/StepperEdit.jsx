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
} from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
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
}));

function getSteps() {
  return ["Departement", "Sub Departement"];
}

const StepperEdit = (props) => {
  const { dataDepartement } = props;
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [area, setArea] = useState([]);
  const [departementEdit] = useState(dataDepartement);
  const [subDepartementEdit, setSubDepartementEdit] = useState(null);

  const handleNext = async () => {
    if (activeStep === 0) {
      const departementId = document.getElementById("departementId");
      const departement = document.getElementById("departementName");
      const area = document.getElementById("areaSelect");

      if (departement.value !== "") {
        await axios
          .patch(
            `${pathEndPoint[0].url}${
              pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
            }/api/v1/departement/${departementId.value}`,
            {
              departement_name: departement.value,
              id_area: parseInt(area.value),
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
      alert("success");
      var departementId = document.getElementById("departementId");
      var selectId = document.querySelectorAll(".editfieldbox");
      var addField = document.querySelectorAll("input.addfield");

      var arr = [...selectId];
      var arr2 = [...addField];

      arr.forEach((element) => {
        axios.post(
          `${pathEndPoint[0].url}${
            pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
          }/api/v1/subdepartement/`,
          {
            id: parseInt(element.children[0].value),
            subdepartement_name: element.children[1].value,
            id_departement: parseInt(departementId.value),
          }
        );
      });

      if (arr2.length !== 0) {
        arr2.forEach((element) => {
          axios.post(
            `${pathEndPoint[0].url}${
              pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
            }/api/v1/subdepartement/`,
            {
              subdepartement_name: element.value,
              id_departement: parseInt(departementId.value),
            }
          );
        });
      }

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {
    getAreaList();
    getSubDepartementList();
  }, []);

  const getAreaList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/area`
      )
      .then((response) => {
        setArea(response.data.data.areas);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSubDepartementList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/subdepartement/${departementEdit.id}`
      )
      .then((response) => {
        setSubDepartementEdit(response.data.data.subdepartement);
      })
      .catch((error) => {
        console.log(error);
        setSubDepartementEdit([]);
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
                {getStepContent(
                  activeStep,
                  area,
                  departementEdit,
                  subDepartementEdit
                )}
              </Typography>
              <div style={{ marginTop: "60px" }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className={classes.backButton}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
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

const deleteSubDepart = async (row) => {
  if (window.confirm("Delete the item?")) {
    await axios
      .delete(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/subdepartement/${row}`
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

function getStepContent(stepIndex, area, departementEdit, subDepartementEdit) {
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
                    id="departementId"
                    value={departementEdit.id}
                  />
                  <input
                    defaultValue={departementEdit.departement_name}
                    type="text"
                    id="departementName"
                    className="form-input-pop"
                    placeholder="Departement Name"
                  />
                </div>
                <div className="col-6">
                  <select name="" id="areaSelect" className="form-input-select">
                    {area.map((row) => (
                      <option
                        key={row.id}
                        value={row.id}
                        selected={`${
                          departementEdit.id_area === row.id ? "selected" : ""
                        }`}>
                        {row.area_name}
                      </option>
                    ))}
                  </select>
                </div>
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
              <input
                type="hidden"
                id="departementId"
                defaultValue={departementEdit.id}
                className="hiddenSubs"
              />

              <ul id="fields" className="ul-list">
                {subDepartementEdit.map((subs, index) => (
                  <li className="box editfieldbox">
                    <input
                      type="hidden"
                      value={subs.id}
                      id="idSubDepartement"
                    />
                    <input
                      id={`editfield${count + index}`}
                      name={`editfield${count + index}`}
                      type="text"
                      className="input-field-pop-add"
                      defaultValue={subs.subdepartement_name}
                    />
                    <button
                      class="remove input-group-button"
                      onClick={(e) => deleteSubDepart(subs.id)}>
                      X
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="row">
            <button className="input-create-element" onClick={createInput}>
              Add Field
            </button>
          </div>
        </>
      );
    default:
      return "Unknown stepIndex";
  }
}

export default StepperEdit;

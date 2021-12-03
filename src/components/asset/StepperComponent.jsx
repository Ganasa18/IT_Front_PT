import React, { useState } from "react";

import { pathEndPoint } from "../../assets/menu";

import "../../assets/master.css";
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

const StepperComponent = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [area, setArea] = useState([]);
  const [lastDepartementId, setLastDepartementId] = useState(null);

  React.useEffect(() => {
    getAreaList();
    getLatestId();
    // setTimeout(() => {
    //   getLatestId();
    // }, 3000);
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

  const getLatestId = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/departement/latestId`
      )
      .then((response) => {
        setLastDepartementId(response.data.data.departement.id);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      const departement = document.getElementById("departementName");
      const area = document.getElementById("areaSelect");
      console.log(departement.value);
      if (departement.value !== "") {
        await axios
          .post(
            `${pathEndPoint[0].url}${
              pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
            }/api/v1/departement`,
            {
              departement_name: departement.value,
              id_area: parseInt(area.value),
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
      alert("success");
      var departementId = document.getElementById("departementId");
      var lis = document.getElementById("fields").getElementsByTagName("li");
      //   console.log(lis[1].children[0].value);

      var arr = [...lis];
      arr.forEach((element) => {
        // console.log(element.children[0].value);
        // console.log(departementId.value);
        axios.post(
          `${pathEndPoint[0].url}${
            pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
          }/api/v1/subdepartement/`,
          {
            subdepartement_name: element.children[0].value,
            id_departement: parseInt(departementId.value),
          }
        );
      });

      window.location.reload();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
                {getStepContent(activeStep, area, lastDepartementId)}
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

function getStepContent(stepIndex, area, lastDepartementId) {
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
                    id="departementName"
                    className="form-input-pop"
                    placeholder="Departement Name"
                  />
                </div>
                <div className="col-6">
                  <select  id="areaSelect" className="form-input-select">
                    {area.map((row) => (
                      <option key={row.id} value={row.id}>
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
                value={lastDepartementId + 1}
              />

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

              {/* <div className="input-group box">
                <input type="text" className="input-field-pop " />
                <button type="button" class="input-group-button">
                  Add
                </button>
              </div> */}
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

export default StepperComponent;

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
import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../../assets/select-search.css";

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
    transform: "translate(-180%, 50%)",
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
    fontSize: "12px",
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
    transform: "translate(585%, 50%)",
  },

  iconContainer: {
    transform: "scale(1.6)",
  },
}));

function getSteps() {
  return ["Personal Data", "General Request", "Aplication"];
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const FacilityCreate = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [valueArea, setValueArea] = useState("");
  const [valueDepartement, setValueDepartement] = useState("");
  const [valueSubDepartement, setValueSubDepartement] = useState("");
  const [dataArea, setDataArea] = useState([]);
  const [dataDepartement, setDataDepartement] = useState([]);
  const [dataSubDepartement, setDataSubDepartement] = useState([]);

  useEffect(() => {
    getAreaList();
  }, []);

  const getAreaList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/area`
      )
      .then((response) => {
        const DataArea = response.data.data.areas;

        const arr = [...DataArea];
        const newArr = arr.map((row) => ({
          value: row.id,
          name: row.area_name,
        }));
        setDataArea(newArr);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleArea = async (e) => {
    setValueArea(e);
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/departement`
      )
      .then((response) => {
        const DepartementList = response.data.data.departements;
        const depart = [...DepartementList];
        const idDepart = depart.filter((item) => item.id_area === e);
        if (idDepart === undefined || idDepart.length === 0) {
          setDataDepartement([]);
        } else {
          const newArr = idDepart.map((dpt) => ({
            value: dpt.id,
            name: dpt.departement_name,
          }));
          setDataDepartement(newArr);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubDepartement = async (e) => {
    setValueDepartement(e);
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/subdepartement/${valueDepartement}`
      )
      .then((response) => {
        const SubDepartementList = response.data.data.subdepartement;
        const newArr = SubDepartementList.map((dpt) => ({
          value: dpt.id,
          name: dpt.subdepartement_name,
        }));
        setDataSubDepartement(newArr);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleDetail1 = () => {
    const type = document.querySelector('input[name="internetacc"]:checked');

    if (type.value === "yes") {
      document.getElementById("internetacc_detail").style.display = "block";
    } else {
      document.getElementById("internetacc_detail").style.display = "none";
    }
  };

  const handleDetail2 = () => {
    const type = document.querySelector('input[name="emailid"]:checked');

    if (type.value === "yes") {
      document.getElementById("emailid_detail").style.display = "block";
    } else {
      document.getElementById("emailid_detail").style.display = "none";
    }
  };

  const handleDetail3 = () => {
    const type = document.querySelector('input[name="wifiaccess"]:checked');

    if (type.value === "yes") {
      document.getElementById("wifiaccess_detail").style.display = "block";
    } else {
      document.getElementById("wifiaccess_detail").style.display = "none";
    }
  };
  const handleDetail4 = () => {
    const type = document.querySelector('input[name="telephone"]:checked');

    if (type.value === "yes") {
      document.getElementById("telephone_detail").style.display = "block";
    } else {
      document.getElementById("telephone_detail").style.display = "none";
    }
  };
  const handleDetail5 = () => {
    const type = document.querySelector('input[name="printeracc"]:checked');

    if (type.value === "yes") {
      document.getElementById("printeracc_detail").style.display = "block";
    } else {
      document.getElementById("printeracc_detail").style.display = "none";
    }
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      const status = document.querySelector('input[name="employee"]:checked');
      const name = document.getElementById("nameUser");
      const email = document.getElementById("emailUser");

      // if (name.value === "") {
      //   alert("cannot empty name");
      //   return;
      // }

      // if (email.value === "") {
      //   alert("cannot empty email");
      //   return;
      // }
      // const valEmail = validateEmail(email.value);
      // if (valEmail === null) {
      //   alert("insert valid email");
      //   return;
      // }

      // if (valueArea === "") {
      //   alert("area cannot empty");
      //   return;
      // }

      // if (valueDepartement === "") {
      //   alert("departement cannot empty");
      //   return;
      // }

      // localStorage.setItem("emailVal", email.value);
      // localStorage.setItem("nameVal", name.value);
      // localStorage.setItem("statusVal", status.value);

      // console.log(area.childNodes[0].lastElementChild.value);
    }

    if (activeStep === 1) {
      const computer = document.querySelector('input[name="computer"]:checked');
      const emailid = document.querySelector('input[name="emailid"]:checked');
      const internetacc = document.querySelector(
        'input[name="internetacc"]:checked'
      );
      const wifiaccess = document.querySelector(
        'input[name="wifiaccess"]:checked'
      );
      const telephone = document.querySelector(
        'input[name="telephone"]:checked'
      );
      const printeracc = document.querySelector(
        'input[name="printeracc"]:checked'
      );

      const comp_detail = document.getElementById("computer_detail");
      const internetacc_detail = document.getElementById("internetacc_detail");
      const emailid_detail = document.getElementById("emailid_detail");
      const telephone_detail = document.getElementById("telephone_detail");
      const printeracc_detail = document.getElementById("printeracc_detail");
      const other_desc = document.getElementById("other_desc");

      if (
        computer === null ||
        internetacc === null ||
        emailid === null ||
        wifiaccess === null ||
        telephone === null ||
        printeracc === null
      ) {
        alert("must select 1");
        return;
      }

      const dataGeneral = {
        computer: computer.value,
        comp_detail: comp_detail.value,
        internetacc: internetacc.value,
        internetacc_detail: internetacc_detail.value,
        emailid: emailid.value,
        emailid_detail: emailid_detail.value,
        telephone: telephone.value,
        telephone_detail: telephone_detail.value,
        printeracc: printeracc.value,
        printeracc_detail: printeracc_detail.value,
        other: other_desc.value,
      };

      localStorage.setItem("dataGeneral", JSON.stringify(dataGeneral));
    }

    if (activeStep === 2) {
      const checkbox1 = document.getElementById("checkbox2-example-one");
      const checkbox2 = document.getElementById("checkbox2-example-two");
      const checkbox3 = document.getElementById("checkbox2-example-three");
      const checkbox4 = document.getElementById("checkbox2-example-four");
      const checkbox5 = document.getElementById("checkbox2-example-five");
      const checkbox6 = document.getElementById("checkbox2-example-six");
      const checkbox7 = document.getElementById("checkbox2-example-seven");
      const checkbox8 = document.getElementById("checkbox2-example-eight");
      const other_app = document.getElementById("other_desc_2");

      const dataApplication = {
        openERP: checkbox1.checked,
        eskom: checkbox2.checked,
        accurate: checkbox3.checked,
        tax: checkbox4.checked,
        clickBca: checkbox5.checked,
        randevoo: checkbox6.checked,
        solution: checkbox7.checked,
        odoo: checkbox8.checked,
        other: other_app.value,
      };
      console.log(dataApplication);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    const dataGeneral = localStorage.getItem("dataGeneral");
    const emailVal = localStorage.getItem("emailVal");
    const nameVal = localStorage.getItem("nameVal");
    console.log(valueArea, valueDepartement, nameVal, emailVal);
    console.log(JSON.parse(dataGeneral));
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
                {getStepContent(
                  activeStep,
                  dataArea,
                  valueArea,
                  handleArea,
                  dataDepartement,
                  valueDepartement,
                  dataSubDepartement,
                  valueSubDepartement,
                  handleSubDepartement,
                  handleDetail1,
                  handleDetail2,
                  handleDetail3,
                  handleDetail4,
                  handleDetail5
                )}
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
    </>
  );
};

function getStepContent(
  stepIndex,
  dataArea,
  valueArea,
  handleArea,
  dataDepartement,
  valueDepartement,
  dataSubDepartement,
  valueSubDepartement,
  handleSubDepartement,
  handleDetail,
  handleDetail2,
  handleDetail3,
  handleDetail4,
  handleDetail5
) {
  switch (stepIndex) {
    case 0:
      return (
        <>
          <div className="row">
            <div className="col-12">
              <Divider />
              <br />
              <div className="wrapper-facility">
                <div className="row margin-left-0">
                  <div className="col-5">
                    <label className="label-text" htmlFor="">
                      Employee Status.
                    </label>
                    <div className="row margin-top-1">
                      <div class="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="permanent"
                            value={"permanent"}
                            name="employee"
                            checked
                          />
                          <label
                            htmlFor="permanent"
                            className="radio-label label-select">
                            Permanent
                          </label>
                        </div>
                      </div>
                      <div className="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="temporary"
                            value={"temporary"}
                            name="employee"
                          />
                          <label
                            htmlFor="temporary"
                            className="radio-label label-select">
                            Temporary
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-1"></div>
                  <div className="col-5">
                    <label className="label-text" htmlFor="">
                      Departement
                    </label>
                    <SelectSearch
                      options={dataDepartement}
                      value={dataDepartement}
                      filterOptions={fuzzySearch}
                      onChange={handleSubDepartement}
                      search
                      placeholder="Search Departement"
                    />
                  </div>
                </div>
                <div className="row margin-top-1 margin-left-0">
                  <div className="col-5">
                    <label className="label-text" htmlFor="nameUser">
                      Name
                    </label>
                    <input type="text" className="form-input" id="nameUser" />
                  </div>
                  <div className="col-1"></div>
                  <div className="col-5">
                    <label className="label-text" htmlFor="">
                      Sub Departement
                    </label>
                    <SelectSearch
                      options={dataSubDepartement}
                      value={dataSubDepartement}
                      filterOptions={fuzzySearch}
                      search
                      placeholder="Search Sub Departement"
                    />
                  </div>
                </div>
                <div className="row margin-top-1 margin-left-0">
                  <div className="col-5">
                    <label className="label-text" htmlFor="emailUser">
                      Personal Email
                    </label>
                    <input
                      type="email"
                      className="form-input"
                      id="emailUser"
                      required
                    />
                  </div>
                </div>
                <div className="row margin-top-1 margin-left-0">
                  <div className="col-5">
                    <label className="label-text">Area</label>
                    <SelectSearch
                      id="areaId"
                      options={dataArea}
                      value={dataArea}
                      onChange={handleArea}
                      filterOptions={fuzzySearch}
                      search
                      placeholder="Search Area"
                    />
                  </div>
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
              <br />
              <div className="wrapper-facility">
                <div className="row margin-left-0">
                  <div className="col-5">
                    <label className="label-text" htmlFor="">
                      Computer
                    </label>
                    <div className="row margin-top-1">
                      <div class="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="laptop"
                            value={"laptop"}
                            name="computer"
                          />
                          <label
                            htmlFor="laptop"
                            className="radio-label label-select">
                            Laptop
                          </label>
                        </div>
                      </div>
                      <div className="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="pc"
                            value={"pc"}
                            name="computer"
                          />
                          <label
                            htmlFor="pc"
                            className="radio-label label-select">
                            PC
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row margin-top-0">
                      <input
                        type="text"
                        id="computer_detail"
                        className="form-data"
                      />
                    </div>
                  </div>
                  <div className="col-1"></div>
                  <div className="col-5">
                    <label className="label-text" htmlFor="">
                      Internet Access.
                    </label>
                    <div className="row margin-top-1">
                      <div class="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="internetacc_yes"
                            value={"yes"}
                            name="internetacc"
                            onChange={handleDetail}
                          />
                          <label
                            htmlFor="internetacc_yes"
                            className="radio-label label-select">
                            Yes
                          </label>
                        </div>
                      </div>
                      <div className="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="internetacc_no"
                            value={"no"}
                            name="internetacc"
                            onChange={handleDetail}
                          />
                          <label
                            htmlFor="internetacc_no"
                            className="radio-label label-select">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row margin-top-0">
                      <input
                        type="text"
                        id="internetacc_detail"
                        className="form-data"
                      />
                    </div>
                  </div>
                </div>
                <div className="row margin-left-0 margin-top-2">
                  <div className="col-5">
                    <label className="label-text" htmlFor="">
                      Email ID
                    </label>
                    <div className="row margin-top-1">
                      <div class="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="emailid_yes"
                            value={"yes"}
                            name="emailid"
                            onChange={handleDetail2}
                          />
                          <label
                            htmlFor="emailid_yes"
                            className="radio-label label-select">
                            Yes
                          </label>
                        </div>
                      </div>
                      <div className="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="emailid_no"
                            value={"no"}
                            name="emailid"
                            onChange={handleDetail2}
                          />
                          <label
                            htmlFor="emailid_no"
                            className="radio-label label-select">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row margin-top-0">
                      <input
                        type="text"
                        id="emailid_detail"
                        className="form-data"
                      />
                    </div>
                  </div>
                  <div className="col-1"></div>
                  <div className="col-5">
                    <label className="label-text" htmlFor="">
                      Wifi Access
                    </label>
                    <div className="row margin-top-1">
                      <div class="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="wifiaccess_yes"
                            value={"yes"}
                            name="wifiaccess"
                            onChange={handleDetail3}
                          />
                          <label
                            htmlFor="wifiaccess_yes"
                            className="radio-label label-select">
                            Yes
                          </label>
                        </div>
                      </div>
                      <div className="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="wifiaccess_no"
                            value={"no"}
                            name="wifiaccess"
                            onChange={handleDetail3}
                          />
                          <label
                            htmlFor="wifiaccess_no"
                            className="radio-label label-select">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row margin-top-0">
                      <input
                        type="text"
                        id="wifiaccess_detail"
                        className="form-data"
                      />
                    </div>
                  </div>
                </div>
                <div className="row margin-left-0 margin-top-2">
                  <div className="col-5">
                    <label className="label-text" htmlFor="">
                      Telephone
                    </label>
                    <div className="row margin-top-1">
                      <div class="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="telephone_yes"
                            value={"yes"}
                            name="telephone"
                            onChange={handleDetail4}
                          />
                          <label
                            htmlFor="telephone_yes"
                            className="radio-label label-select">
                            Yes
                          </label>
                        </div>
                      </div>
                      <div className="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="telephone_no"
                            value={"no"}
                            name="telephone"
                            onChange={handleDetail4}
                          />
                          <label
                            htmlFor="telephone_no"
                            className="radio-label label-select">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row margin-top-0">
                      <input
                        type="text"
                        id="telephone_detail"
                        className="form-data"
                      />
                    </div>
                  </div>
                  <div className="col-1"></div>
                  <div className="col-5">
                    <label className="label-text" htmlFor="">
                      Others
                    </label>
                    <textarea
                      id="other_desc"
                      className="form-input-area"
                      cols="30"
                      rows="5"></textarea>
                  </div>
                </div>
                <div className="row margin-left-0">
                  <div className="col-5">
                    <label className="label-text" htmlFor="">
                      Printer Access
                    </label>
                    <div className="row margin-top-1">
                      <div class="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="printeracc_yes"
                            value={"yes"}
                            name="printeracc"
                            onChange={handleDetail5}
                          />
                          <label
                            htmlFor="printeracc_yes"
                            className="radio-label label-select">
                            Yes
                          </label>
                        </div>
                      </div>
                      <div className="col-5">
                        <div className="radio">
                          <input
                            type="radio"
                            id="printeracc_no"
                            value={"no"}
                            name="printeracc"
                            onChange={handleDetail5}
                          />
                          <label
                            htmlFor="printeracc_no"
                            className="radio-label label-select">
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row margin-top-0">
                      <input
                        type="text"
                        id="printeracc_detail"
                        className="form-data"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );

    case 2:
      return (
        <>
          <div className="row">
            <div className="col-12">
              <Divider />
              <br />
              <div className="wrapper-facility">
                <div className="row margin-left-0">
                  <h5 className="label-text" htmlFor="">
                    Aplication
                  </h5>
                </div>
                <div className="row margin-left-0">
                  <div className="col-5">
                    <div class="single-col">
                      <div class="styled-input-container styled-input--square">
                        <div class="styled-input-single">
                          <input
                            type="checkbox"
                            name="fieldset-6"
                            id="checkbox2-example-one"
                          />
                          <label for="checkbox2-example-one">Open ERP</label>
                        </div>
                        <div class="styled-input-single">
                          <input
                            type="checkbox"
                            name="fieldset-6"
                            id="checkbox2-example-two"
                          />
                          <label for="checkbox2-example-two">Eskom</label>
                        </div>
                        <div class="styled-input-single">
                          <input
                            type="checkbox"
                            name="fieldset-6"
                            id="checkbox2-example-three"
                          />
                          <label for="checkbox2-example-three">Accurate</label>
                        </div>
                        <div class="styled-input-single">
                          <input
                            type="checkbox"
                            name="fieldset-6"
                            id="checkbox2-example-four"
                          />
                          <label for="checkbox2-example-four">Tax</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-1"></div>
                  <div className="col-5">
                    <div class="single-col">
                      <div class="styled-input-container styled-input--square">
                        <div class="styled-input-single">
                          <input
                            type="checkbox"
                            name="fieldset-6"
                            id="checkbox2-example-five"
                          />
                          <label for="checkbox2-example-five">
                            Click BCA bisnis
                          </label>
                        </div>
                        <div class="styled-input-single">
                          <input
                            type="checkbox"
                            name="fieldset-6"
                            id="checkbox2-example-six"
                          />
                          <label for="checkbox2-example-six">Randevoo</label>
                        </div>
                        <div class="styled-input-single">
                          <input
                            type="checkbox"
                            name="fieldset-6"
                            id="checkbox2-example-seven"
                          />
                          <label for="checkbox2-example-seven">Solution</label>
                        </div>
                        <div class="styled-input-single">
                          <input
                            type="checkbox"
                            name="fieldset-6"
                            id="checkbox2-example-eight"
                          />
                          <label for="checkbox2-example-eight">Odoo</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row margin-top-1 margin-left-0">
                  <div className="col-5">
                    <label className="label-text" htmlFor="">
                      Others
                    </label>
                    <textarea
                      id="other_desc_2"
                      className="form-input-area"
                      cols="30"
                      rows="6"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );

    default:
      return "Unknown stepIndex";
  }
}

export default FacilityCreate;

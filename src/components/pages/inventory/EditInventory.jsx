import React, { useState, useEffect } from "react";
import { makeStyles, Button } from "@material-ui/core";

import "../../../assets/master.css";
import "../../../assets/asset_user.css";
import { authEndPoint, pathEndPoint } from "../../../assets/menu";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get("token");

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },

  btnNext: {
    textTransform: "capitalize",
    position: "relative",
    width: "130px",
    height: "40px",
    left: "50%",
    top: "50%",
    transform: "translate(200%, 120%)",
    [theme.breakpoints.down("lg")]: {
      width: "130px",
      height: "40px",
      transform: "translate(270%, 140%)",
    },
  },
}));

const EditInventory = (props) => {
  const { rowData } = props;
  const classes = useStyles();
  const [dataInventory] = useState(rowData);

  return (
    <>
      <div className="wrapper-create-inv">
        <form action="">
          <div className="row">
            <div className="col-6">
              <label className="label-inv" htmlFor="">
                Status
              </label>

              <div className="row">
                <div class="col-6">
                  <div className="radio">
                    <input
                      type="radio"
                      id="used"
                      value={true}
                      name="status_asset"
                      checked={`${
                        dataInventory.status_asset === true ? "checked" : ""
                      }`}
                    />
                    <label htmlFor="used" className="radio-label">
                      Used
                    </label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="radio">
                    <input
                      type="radio"
                      id="available"
                      value={false}
                      name="status_asset"
                      checked={`${
                        dataInventory.status_asset === false ? "checked" : ""
                      }`}
                    />
                    <label htmlFor="available" className="radio-label">
                      Available
                    </label>
                  </div>
                </div>
              </div>
              <br />
            </div>
            <div className="col-6"></div>
          </div>

          <div className="row">
            <div className="col-6">
              <label className="label-inv" htmlFor="">
                Fisik / Non Fisik
              </label>
              <div className="row">
                {dataInventory.asset_fisik_or_none === "fisik" ? (
                  <div class="col-6">
                    <div className="radio">
                      <input
                        type="radio"
                        id="fisik"
                        value={"fisik"}
                        name="fisiknon"
                        disabled
                      />
                      <label htmlFor="fisik" className="radio-label">
                        Fisik
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="col-6">
                    <div className="radio">
                      <input
                        type="radio"
                        id="nonfisik"
                        value={"nonfisik"}
                        name="fisiknon"
                        disabled
                      />
                      <label htmlFor="nonfisik" className="radio-label">
                        Non Fisik
                      </label>
                    </div>
                  </div>
                )}
              </div>
              <br />
            </div>
            <div className="col-6"></div>
          </div>

          {dataInventory.asset_part_or_unit !== "" ? (
            <>
              <div className="row">
                <div className="col-6">
                  <label htmlFor="">Unit / Part</label>
                  <div className="row">
                    {dataInventory.asset_part_or_unit === "unit" ? (
                      <div class="col-6">
                        <div className="radio">
                          <input
                            type="radio"
                            id="part"
                            value={"unit"}
                            name="unit_parts"
                            disabled
                          />
                          <label htmlFor="part" className="radio-label">
                            Unit
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="col-6">
                        <div className="radio">
                          <input
                            type="radio"
                            id="unit"
                            value={"part"}
                            name="unit_parts"
                            disabled
                          />
                          <label htmlFor="unit" className="radio-label">
                            Part
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                  <br />
                </div>
                <div className="col-6"></div>
              </div>
            </>
          ) : null}

          {dataInventory.type_asset !== "" ? (
            <div className="row">
              <div className="col-6">
                <label htmlFor="">User / Dept.</label>
                <div className="row">
                  {dataInventory.type_asset === "user" ? (
                    <div class="col-6">
                      <div className="radio">
                        <input
                          type="radio"
                          id="type_user"
                          value={"user"}
                          name="inventory_type"
                          disabled
                        />
                        <label htmlFor="type_user" className="radio-label">
                          User
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="col-6">
                      <div className="radio">
                        <input
                          type="radio"
                          id="type_departement"
                          value={"departement"}
                          name="inventory_type"
                          disabled
                        />
                        <label
                          htmlFor="type_departement"
                          className="radio-label">
                          Departement
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                <br />
              </div>
              <div className="col-6"></div>
            </div>
          ) : null}
          <div className="row">
            <div className="col-6">
              <label htmlFor="">Asset Name</label>
              <input
                value={dataInventory.asset_name}
                type="text"
                className="form-input-inv"
                disabled
              />
            </div>
            <div className="col-6">
              <label htmlFor="">Item Initials</label>
              <input
                type="text"
                className="form-input-inv"
                value={dataInventory.initial_asset_name}
                disabled
              />
            </div>
          </div>
          <div className="row margin-top">
            <div className="col-6">
              <label htmlFor="">Category</label>
              <input
                value={dataInventory.category_name}
                type="text"
                className="form-input-inv"
                disabled
              />
            </div>
            <div className="col-6">
              <label htmlFor="">Area</label>
              <input
                type="text"
                className="form-input-inv"
                value={`${dataInventory.area_name}-${dataInventory.alias_name}`}
                disabled
              />
            </div>
          </div>
          <div className="row margin-top-2">
            <div className="col-6">
              <label htmlFor="">SubCategory</label>
              <input
                value={dataInventory.subcategory_name}
                type="text"
                className="form-input-inv"
                disabled
              />
            </div>
            <div className="col-6">
              <label htmlFor="">User</label>
              <input type="text" className="form-input-inv" />
            </div>
          </div>
          <br />
        </form>
      </div>
    </>
  );
};

export default EditInventory;

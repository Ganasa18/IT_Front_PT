import React, { useState, useEffect } from "react";
import { makeStyles, Button } from "@material-ui/core";
import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../../assets/select-search.css";
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
    transform: "translate(200%, 230%)",
  },
}));

const CreateInventory = () => {
  const classes = useStyles();
  const initialRef = React.useRef(null);
  const getInitialRef = React.useRef(null);
  const [dataCategory, setDataCategory] = useState([]);
  const [dataSubCategory, setDataSubCategory] = useState([]);
  const [dataArea, setDataArea] = useState([]);
  const [dataTypeAsset, setDataTypeAsset] = useState([]);
  const [typeAsset, setTypeAsset] = useState("user");
  const [aliasName, setAliasName] = useState("");

  useEffect(() => {
    getCategoryList();
    getAreaList();
  }, []);

  const handleInitial = () => {
    var typingTimer; //timer identifier
    var doneTypingInterval = 5000;
    clearTimeout(typingTimer);
    var value = initialRef.current.value;
    var variable1 = value.substring(0, 1);
    var variable2 = variable1.toUpperCase();
    var variable3 = value.substring(2);
    var variabel4 = [...variable3];
    if (value) {
      typingTimer = setTimeout(
        doneTyping(variable2, variabel4),
        doneTypingInterval
      );
    }
  };

  function doneTyping(variable2, variabel4) {
    var ran = variabel4[Math.floor(Math.random() * variabel4.length)];
    var randVal = variable2 + ran;
    getInitialRef.current.value = randVal.toUpperCase();
  }

  const getCategoryList = async () => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/category`
      )
      .then((response) => {
        const DataCategory = response.data.data.category;
        const newArrCategory = DataCategory.map((row) => ({
          value: row.id,
          name: row.category_name,
        }));

        setDataCategory(newArrCategory);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const handleCategory = async (e) => {
    await axios
      .get(
        `${pathEndPoint[0].url}${
          pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
        }/api/v1/subcategory`
      )
      .then((response) => {
        const SubCategoryList = response.data.data.subcategory;
        const subcat = [...SubCategoryList];
        const idSubCatgory = subcat.filter((item) => item.id_category === e);
        if (idSubCatgory === undefined || idSubCatgory.length === 0) {
          setDataSubCategory([]);
        } else {
          const newArr = idSubCatgory.map((sub) => ({
            value: sub.id,
            name: sub.subcategory_name,
          }));
          setDataSubCategory(newArr);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleArea = async (e) => {
    let area = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/area/${e}`;

    await axios
      .get(area)
      .then((response) => {
        const DataArea = response.data.data.area;
        setAliasName(DataArea.alias_name);
      })
      .catch((error) => {
        console.log(error);
      });

    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    let departement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/departement`;

    if (typeAsset === "user") {
      await axios
        .get(user, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const userList = response.data.data.users;

          const user = [...userList];
          const idSubUser = user.filter((item) => item.area === e);
          const newArrUser = idSubUser.map((row) => ({
            value: row.id,
            name: row.username,
          }));

          setDataTypeAsset(newArrUser);
        })
        .catch((error) => {
          console.log(error);
        });

      return;
    }
    if (typeAsset === "departement") {
      await axios
        .get(departement)
        .then((response) => {
          const departementList = response.data.data.departements;
          const departement = [...departementList];
          const idDepartement = departement.filter(
            (item) => item.id_area === e
          );

          const newArrDepart = idDepartement.map((row) => ({
            value: row.id,
            name: row.departement_name,
          }));

          setDataTypeAsset(newArrDepart);
        })
        .catch((error) => {
          console.log(error);
        });
      return;
    }
  };

  const handleUserDepart = (e) => {
    setTypeAsset(e.target.value);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    var str = "" + 1;
    var pad = "000";
    var ans = pad.substring(0, pad.length - str.length) + str;

    const fisiknon = document.querySelector(
      'input[name="fisiknon"]:checked'
    ).value;
    const unit_part = document.querySelector(
      'input[name="unit_parts"]:checked'
    ).value;

    const inventory_type = document.querySelector(
      'input[name="inventory_type"]:checked'
    ).value;

    console.log(fisiknon, unit_part, inventory_type, aliasName, ans);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-6">
            <label htmlFor="">Fisik / Non Fisik</label>
            <div className="row">
              <div class="col-6">
                <div className="radio">
                  <input
                    type="radio"
                    id="fisik"
                    value={"fisik"}
                    name="fisiknon"
                  />
                  <label htmlFor="fisik" className="radio-label">
                    Fisik
                  </label>
                </div>
              </div>
              <div className="col-6">
                <div className="radio">
                  <input
                    type="radio"
                    id="nonfisik"
                    value={"nonfisik"}
                    name="fisiknon"
                  />
                  <label htmlFor="nonfisik" className="radio-label">
                    Non Fisik
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
            <label htmlFor="">Unit / Part</label>
            <div className="row">
              <div class="col-6">
                <div className="radio">
                  <input
                    type="radio"
                    id="part"
                    value={"part"}
                    name="unit_parts"
                  />
                  <label htmlFor="part" className="radio-label">
                    Unit
                  </label>
                </div>
              </div>
              <div className="col-6">
                <div className="radio">
                  <input
                    type="radio"
                    id="unit"
                    value={"unit"}
                    name="unit_parts"
                  />
                  <label htmlFor="unit" className="radio-label">
                    Part
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
            <label htmlFor="">User / Dept.</label>
            <div className="row">
              <div class="col-6">
                <div className="radio">
                  <input
                    type="radio"
                    id="type_user"
                    value={"user"}
                    name="inventory_type"
                    onClick={handleUserDepart}
                  />
                  <label htmlFor="type_user" className="radio-label">
                    User
                  </label>
                </div>
              </div>
              <div className="col-6">
                <div className="radio">
                  <input
                    type="radio"
                    id="type_departement"
                    value={"departement"}
                    name="inventory_type"
                    onClick={handleUserDepart}
                  />
                  <label htmlFor="type_departement" className="radio-label">
                    Departement
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
            <label htmlFor="">Asset Name</label>
            <input
              ref={initialRef}
              type="text"
              className="form-input-inv"
              onKeyUp={handleInitial}
            />
          </div>
          <div className="col-6">
            <label htmlFor="">Item Initials</label>
            <input
              type="text"
              className="form-input-inv"
              onInput={function (e) {
                getInitialRef.current.value = e.target.value.toUpperCase();
              }}
              ref={getInitialRef}
            />
          </div>
        </div>
        <div className="row margin-top">
          <div className="col-6">
            <label htmlFor="roleName">Category</label>
            <SelectSearch
              options={dataCategory}
              value={dataCategory}
              filterOptions={fuzzySearch}
              onChange={handleCategory}
              search
              placeholder="Search Category"
            />
          </div>
          <div className="col-6">
            <label htmlFor="roleName">Area</label>
            <SelectSearch
              options={dataArea}
              value={dataArea}
              filterOptions={fuzzySearch}
              onChange={handleArea}
              search
              placeholder="Search Area"
            />
          </div>
        </div>
        <div className="row margin-top-2">
          <div className="col-6">
            <label htmlFor="roleName">Sub Category</label>
            <SelectSearch
              options={dataSubCategory}
              value={dataSubCategory}
              filterOptions={fuzzySearch}
              search
              placeholder="Search Sub Category"
            />
          </div>
          <div className="col-6">
            <label htmlFor="roleName">{capitalizeFirstLetter(typeAsset)}</label>
            <SelectSearch
              options={dataTypeAsset}
              value={dataTypeAsset}
              filterOptions={fuzzySearch}
              onChange={function (e) {
                console.log(e);
              }}
              search
              placeholder={`Search ${capitalizeFirstLetter(typeAsset)}`}
            />
          </div>
        </div>
        <div className="row">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.btnNext}>
            Submit
          </Button>
        </div>
      </form>
      <br />
      <br />
      <br />
    </>
  );
};

export default CreateInventory;

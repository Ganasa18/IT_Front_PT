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
    transform: "translate(200%, 120%)",
    [theme.breakpoints.down("lg")]: {
      width: "130px",
      height: "40px",
      transform: "translate(270%, 140%)",
    },
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
  const [typeAsset, setTypeAsset] = useState("");
  const [aliasName, setAliasName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [areaId, setAreaId] = useState("");
  const [partVisible, setPartVisible] = useState("");
  const [userId, setUserId] = useState(null);
  const [departementId, setDepartementId] = useState(null);
  const [getArrUser, setGetArrUser] = useState([]);

  useEffect(() => {
    getCategoryList();
    getAreaList();
    getUserList();
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

  const getUserList = async () => {
    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    await axios
      .get(user, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const DataUser = response.data.data.users;
        const newArrUser = DataUser.map((row) => ({
          id: row.id,
          uuid: row.uuid,
          name: row.username,
          area: row.area,
          role: row.role,
          departement: row.departement,
          subdepartement: row.subdepartement,
        }));

        setGetArrUser(newArrUser);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
    setCategoryId(e);
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
    setAreaId(e);
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

  const visiblePart = () => {
    const fisiknon = document.querySelector('input[name="fisiknon"]:checked');
    let visibleUnitPart = document.getElementById("hiddenParts");
    if (fisiknon.value === "fisik") {
      visibleUnitPart.style.display = "block";
    } else {
      setPartVisible("");
      visibleUnitPart.style.display = "none";
    }
  };

  const partValue = () => {
    let unit_part = document.querySelector('input[name="unit_parts"]:checked');
    setPartVisible(unit_part.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory`;

    var nowNumber = document.querySelectorAll(".last-number");
    const fisiknon = document.querySelector('input[name="fisiknon"]:checked');
    // let unit_part = document.querySelector('input[name="unit_parts"]:checked');
    let inventory_type = document.querySelector(
      'input[name="inventory_type"]:checked'
    );
    const typeAsset = document.querySelector("#nullValue");
    let idArea = document.querySelector("#areaId");
    let idCategory = document.querySelector("#idCategory");

    if (fisiknon === null) {
      alert("type fisik or none select 1");
      return;
    }
    if (fisiknon.value === "fisik") {
      if (partVisible === "") {
        alert("type unit select 1");
        return;
      }
    } else {
    }

    let checkfisik = fisiknon.value === "fisik" ? "0" : "1";

    if (initialRef.current.value === "") {
      alert("Name Cannot be null");
      return;
    }

    if (idCategory.children[0].childNodes[0].value === "") {
      alert("Category can't be null");
      return;
    }

    if (idArea.children[0].childNodes[0].value === "") {
      alert("Area can't be null");
      return;
    }

    const assetName = initialRef.current.value;
    const code =
      "MKD" +
      getInitialRef.current.value +
      aliasName +
      checkfisik +
      "-" +
      nowNumber[0].textContent;

    if (inventory_type === null) {
      await axios
        .post(inventory, {
          asset_name: assetName,
          asset_number: code,
          asset_fisik_or_none: fisiknon.value,
          category_asset: parseInt(categoryId),
          subcategory_asset:
            subCategoryId === null ? null : parseInt(subCategoryId),
          initial_asset_name: getInitialRef.current.value,
          asset_part_or_unit: partVisible,
          area: parseInt(areaId),
          type_asset: typeAsset.value,
        })
        .then((response) => {
          alert(response.data.message);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        })
        .catch((error) => {
          console.log(error);
        });

      return;
    }

    // Create For User

    if (inventory_type.value === "user") {
      await axios
        .post(inventory, {
          asset_name: assetName,
          asset_number: code,
          asset_fisik_or_none: fisiknon.value,
          category_asset: parseInt(categoryId),
          subcategory_asset:
            subCategoryId === null ? null : parseInt(subCategoryId),
          initial_asset_name: getInitialRef.current.value,
          asset_part_or_unit: partVisible,
          area: parseInt(areaId),
          used_by: userId[0].id,
          type_asset: inventory_type.value,
          departement: userId[0].departement,
          subdepartement: userId[0].subdepartement,
          status_asset: true,
        })
        .then((response) => {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        })
        .catch((error) => {
          console.log(error);
        });

      return;
    }

    // Create For Departement

    await axios
      .post(inventory, {
        asset_name: assetName,
        asset_number: code,
        asset_fisik_or_none: fisiknon.value,
        category_asset: parseInt(categoryId),
        subcategory_asset:
          subCategoryId === null ? null : parseInt(subCategoryId),
        initial_asset_name: getInitialRef.current.value,
        asset_part_or_unit: partVisible,
        area: parseInt(areaId),
        type_asset: inventory_type.value,
        departement: parseInt(departementId),
        status_asset: true,
      })
      .then((response) => {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setUser = async (e) => {
    console.log(e);
    const user = [...getArrUser];
    const idUser = user.filter((item) => item.id === e);
    setUserId(idUser);
  };

  const setDepartement = (e) => {
    setDepartementId(e);
  };

  return (
    <>
      <div className="wrapper-create-inv">
        <form onSubmit={handleSubmit} id="resetForm">
          <div className="row">
            <div className="col-6">
              <label className="label-inv" htmlFor="">
                Fisik / Non Fisik
              </label>
              <div className="row">
                <div class="col-6">
                  <div className="radio">
                    <input
                      type="radio"
                      id="fisik"
                      value={"fisik"}
                      name="fisiknon"
                      onChange={visiblePart}
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
                      onChange={visiblePart}
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
          <div className="row" id="hiddenParts">
            <div className="col-6">
              <label htmlFor="">Unit / Part</label>
              <div className="row">
                <div class="col-6">
                  <div className="radio">
                    <input
                      type="radio"
                      id="part"
                      value={"unit"}
                      name="unit_parts"
                      onChange={partValue}
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
                      value={"part"}
                      name="unit_parts"
                      onChange={partValue}
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
              <label htmlFor="">
                Item Initials{" "}
                <span style={{ color: "#ec9108" }}>
                  {" "}
                  ( initial can be edit )
                </span>
              </label>
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
                id="idCategory"
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
                id="areaId"
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
                onChange={(e) => setSubCategoryId(e)}
                search
                placeholder="Search Sub Category"
              />
            </div>
            <div className="col-6">
              {typeAsset !== "" ? (
                <>
                  <label htmlFor="roleName">
                    {capitalizeFirstLetter(typeAsset)}
                  </label>
                  {typeAsset === "user" ? (
                    <SelectSearch
                      options={dataTypeAsset}
                      value={dataTypeAsset}
                      onChange={setUser}
                      filterOptions={fuzzySearch}
                      search
                      placeholder={`Search ${capitalizeFirstLetter(typeAsset)}`}
                    />
                  ) : (
                    <SelectSearch
                      options={dataTypeAsset}
                      value={dataTypeAsset}
                      filterOptions={fuzzySearch}
                      onChange={setDepartement}
                      search
                      placeholder={`Search ${capitalizeFirstLetter(typeAsset)}`}
                    />
                  )}
                </>
              ) : (
                <>
                  <label htmlFor="">Null</label>
                  <input
                    id="nullValue"
                    type="text"
                    className="form-input-inv"
                    placeholder="Null"
                    value={null}
                    readOnly
                  />
                </>
              )}
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
      </div>
      <br />
    </>
  );
};

export default CreateInventory;

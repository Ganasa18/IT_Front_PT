import React, { useState, useEffect } from "react";
import { makeStyles, Button } from "@material-ui/core";
import SelectSearch, { fuzzySearch } from "react-select-search";
import "../../../assets/select-search.css";
import Loading from "../../asset/Loading";
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// const useIsMounted = () => {
//   const isMounted = React.useRef(false);
//   React.useEffect(() => {
//     isMounted.current = true;
//     return () => isMounted.current = false;
//   }, []);
//   return isMounted;
// };

const EditInventory = (props) => {
  const { rowData } = props;
  const classes = useStyles();
  const [dataInventory] = useState(rowData);
  const [dataUser, setDataUser] = useState([]);
  const [dataDepartement, setDataDepartement] = useState([]);
  const [dataSelectUser, setDataSelectUser] = useState([]);
  const [dataSelectDepartement, setDataSelectDepartement] = useState([]);
  const [typeAsset, setTypeAsset] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dataTypeAsset, setDataTypeAsset] = useState([]);
  const [userId, setUserId] = useState(null);
  const checkUserDeptRef = React.useRef(null);
  const [departementId, setDepartementId] = useState(null);

  useEffect(() => {
    if (dataUser.length === 0 || dataDepartement.length === 0) {
      getSelectList();
    }
    setTimeout(() => {
      checkSelect(rowData);
    }, 10000);
  });

  const getSelectList = async () => {
    let user = `${authEndPoint[0].url}${
      authEndPoint[0].port !== "" ? ":" + authEndPoint[0].port : ""
    }/api/v1/auth/`;

    let departement = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/departement`;

    const requestOne = await axios.get(user, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const requestTwo = await axios.get(departement);

    axios
      .all([requestOne, requestTwo])
      .then(
        axios.spread((...responses) => {
          const responseOne = responses[0];
          const responseTwo = responses[1];
          let newDataUser = responseOne.data.data.users;
          let newDataDepartement = responseTwo.data.data.departements;
          const new_arrUser = [...newDataUser];
          const new_arrDepart = [...newDataDepartement];
          const newArrUser = new_arrUser.map((row) => ({
            value: row.id,
            name: row.username,
            area: row.area,
            role: row.role,
            departement: row.departement,
            subdepartement: row.subdepartement,
          }));

          const newArrDepartement = new_arrDepart.map((row) => ({
            value: row.id,
            name: row.departement_name,
            area: row.id_area,
          }));

          setDataUser(newArrUser);
          setDataDepartement(newArrDepartement);
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
  };

  const handleUserDepart = (e) => {
    setTypeAsset(e.target.value);
    const type = e.target.value;
    const idArea = e.target.getAttribute("data-area");
    if (type === "user") {
      const idUser = dataUser.filter((item) => item.area === parseInt(idArea));
      setDataTypeAsset(idUser);
      return;
    }
    if (type === "departement") {
      const idDepartement = dataDepartement.filter(
        (item) => item.area === parseInt(idArea)
      );
      setDataTypeAsset(idDepartement);
      return;
    }
  };

  const checkSelect = (row) => {
    if (row.type_asset !== "") {
      if (row.type_asset === "user") {
        const idUser = dataUser.filter((item) => item.area === row.area_pk);

        if (idUser.length > 0) {
          setDataSelectUser(idUser);
          setIsLoading(false);
        }
        return;
      }

      if (row.type_asset === "departement") {
        const idDepartement = dataDepartement.filter(
          (item) => item.area === row.area_pk
        );

        if (idDepartement.length > 0) {
          setDataSelectDepartement(idDepartement);
          setIsLoading(false);
        }

        return;
      }
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory/updatedInvent`;

    const checkUsed = e.target[0].checked;
    if (checkUsed === false) {
      return alert("Status must checked used");
    }

    if (dataInventory.type_asset !== "") {
      if (dataInventory.type_asset === "user") {
        await axios
          .patch(inventory, {
            id: dataInventory.id,
            type_asset: dataInventory.type_asset,
            status_asset: true,
            used_by: parseInt(userId[0].value),
            departement: parseInt(userId[0].departement),
            subdepartement:
              userId[0].subdepartement !== null
                ? userId[0].subdepartement
                : null,
          })
          .then((response) => {
            alert(response.data.status);
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        await axios
          .patch(inventory, {
            id: dataInventory.id,
            type_asset: dataInventory.type_asset,
            status_asset: true,
            used_by: null,
            departement: parseInt(departementId),
            subdepartement: null,
          })
          .then((response) => {
            alert(response.data.status);
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      return;
    }

    var userSelect = null;
    var departSelect = null;

    if (checkUserDeptRef.current !== null) {
      const checkUserDept = checkUserDeptRef.current;

      userSelect =
        checkUserDept.children[1].children[0].children[0].children[0].checked;

      departSelect =
        checkUserDept.children[1].children[1].children[0].children[0].checked;
    }

    if (userSelect === true || departSelect === true) {
      if (typeAsset === "user") {
        await axios
          .patch(inventory, {
            id: dataInventory.id,
            type_asset: typeAsset,
            status_asset: true,
            used_by: parseInt(userId[0].value),
            departement: parseInt(userId[0].departement),
            subdepartement:
              userId[0].subdepartement !== null
                ? userId[0].subdepartement
                : null,
          })
          .then((response) => {
            alert(response.data.status);
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        await axios
          .patch(inventory, {
            id: dataInventory.id,
            type_asset: typeAsset,
            status_asset: true,
            used_by: null,
            departement: parseInt(departementId),
            subdepartement: null,
          })
          .then((response) => {
            alert(response.data.status);
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          })
          .catch((error) => {
            console.log(error);
          });
      }
      return;
    }

    console.log("cannot submit");
  };

  const handleReset = async () => {
    let inventory = `${pathEndPoint[0].url}${
      pathEndPoint[0].port !== "" ? ":" + pathEndPoint[0].port : ""
    }/api/v1/inventory/updatedInvent`;

    await axios
      .patch(inventory, {
        id: dataInventory.id,
        type_asset: dataInventory.type_asset,
        status_asset: false,
      })
      .then((response) => {
        alert(response.data.status);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const setRowData = async (e) => {
    if (typeAsset === "user" || dataInventory.type_asset === "user") {
      const idUser = dataUser.filter((item) => item.value === e);
      setUserId(idUser);

      return;
    }
    if (
      typeAsset === "departement" ||
      dataInventory.type_asset === "departement"
    ) {
      setDepartementId(e);
      return;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="wrapper-create-inv">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-7">
              <label className="label-inv" htmlFor="">
                Status
              </label>

              {dataInventory.type_asset !== "" ? (
                <div className="row">
                  <div class="col-6">
                    <div className="radio">
                      <input
                        type="radio"
                        id="used"
                        value={true}
                        name="status_asset"
                        checked
                      />
                      <label htmlFor="used" className="radio-label">
                        Used
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="container-status">
                      <label htmlFor="available" className="radio-label">
                        Available :
                      </label>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="button-change__status">
                        Changed To Available
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <div class="col-6">
                    <div className="radio">
                      <input
                        type="radio"
                        id="used"
                        value={true}
                        name="status_asset"
                      />
                      <label htmlFor="used" className="radio-label">
                        Used
                      </label>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="container-status">
                      <label htmlFor="available" className="radio-label">
                        Available :
                      </label>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="button-change__status">
                        Changed To Available
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <br />
            </div>
            <div className="col-5"></div>
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
          ) : (
            <div className="row">
              <div className="col-6" ref={checkUserDeptRef}>
                <label htmlFor="">User / Dept.</label>
                <div className="row">
                  <div class="col-6">
                    <div className="radio">
                      <input
                        type="radio"
                        id="type_user"
                        value={"user"}
                        name="inventory_type"
                        data-area={dataInventory.area_pk}
                        onChange={handleUserDepart}
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
                        data-area={dataInventory.area_pk}
                        onChange={handleUserDepart}
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
          )}
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
              {dataInventory.type_asset !== "" ? (
                <>
                  <label htmlFor="">
                    {capitalizeFirstLetter(dataInventory.type_asset)}
                  </label>
                  {dataInventory.type_asset === "user" ? (
                    <SelectSearch
                      options={dataSelectUser}
                      value={dataSelectUser}
                      filterOptions={fuzzySearch}
                      onChange={setRowData}
                      search
                      placeholder={`Search ${capitalizeFirstLetter(
                        dataInventory.type_asset
                      )}`}
                    />
                  ) : (
                    <SelectSearch
                      options={dataSelectDepartement}
                      value={dataSelectDepartement}
                      filterOptions={fuzzySearch}
                      search
                      onChange={setRowData}
                      placeholder={`Search ${capitalizeFirstLetter(
                        dataInventory.type_asset
                      )}`}
                    />
                  )}
                </>
              ) : (
                <>
                  <label htmlFor="">
                    {typeAsset !== ""
                      ? capitalizeFirstLetter(typeAsset)
                      : "Null"}
                  </label>

                  {typeAsset !== "" ? (
                    <SelectSearch
                      options={dataTypeAsset}
                      value={dataTypeAsset}
                      filterOptions={fuzzySearch}
                      onChange={setRowData}
                      search
                      placeholder={`Search ${capitalizeFirstLetter(typeAsset)}`}
                    />
                  ) : (
                    <>
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
    </>
  );
};

export default EditInventory;
